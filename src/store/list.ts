import {
  createStore,
  createEvent,
  sample,
  attach,
  forward,
  combine,
  createEffect,
} from 'effector';
import { throttle } from 'patronum';
import axios from 'axios';

import { Car, CarFuel } from '../types';

const API_URL = 'http://localhost:3004/data';

type StateParams = {
  paging: {
    page: number;
    limit: number;
    total: number;
    nextPage?: number;
  };
  searchFilter: string;
  fuelTypeFilter?: CarFuel | null;
};

const setInitFinished = createEvent();
const resetInitFinished = createEvent();
const $initFinished = createStore(false)
  .on(setInitFinished, () => true)
  .reset(resetInitFinished);

const searchChanged = createEvent<string>();
const searchReset = createEvent();
const $searchFilter = createStore('')
  .on(searchChanged, (_, newSearch) => newSearch)
  .reset(searchReset);

const fuelTypeChanged = createEvent<CarFuel | null>();
const fuelTypeReset = createEvent();
const $fuelTypeFilter = createStore<StateParams['fuelTypeFilter']>(null)
  .on(fuelTypeChanged, (_, fuelType) => fuelType)
  .reset(fuelTypeReset);

const pagingChanged = createEvent<StateParams['paging']>();
const updatePaging = createEvent<StateParams['paging']>();
const pagingReset = createEvent();
const $paging = createStore<StateParams['paging']>({
  page: 1,
  limit: 10,
  total: 100,
})
  .on(pagingChanged, (_, paging) => paging)
  .on(updatePaging, (_, paging) => paging)
  .reset(pagingReset);

const $combinedFilter = combine({
  searchFilter: $searchFilter,
  paging: $paging,
  fuelTypeFilter: $fuelTypeFilter,
});

const searchFx = createEffect({
  async handler(params: StateParams) {
    const res = await axios.get(API_URL, {
      params: {
        _page: params.paging.page,
        q: params.searchFilter ?? undefined,
        fuelType: params.fuelTypeFilter ?? undefined,
      },
    });

    const nextPage =
      (params.paging.page + 1) * params.paging.limit <= params.paging.total
        ? params.paging.page + 1
        : undefined;

    return {
      paging: { ...params.paging, nextPage },
      payload: res.data,
    };
  },
});

forward({ from: searchFx.done, to: setInitFinished });

const searchWithPageFx = attach({
  effect: searchFx,
  source: $combinedFilter,
  mapParams: (paging: StateParams['paging'], filters) => ({
    ...filters,
    paging,
  }),
});

sample({
  source: $paging,
  target: searchWithPageFx,
  clock: pagingChanged,
});

const searchWithStringFx = attach({
  effect: searchFx,
  source: $combinedFilter,
  mapParams: (searchFilter: string, filters) => ({
    ...filters,
    searchFilter,
  }),
});

throttle({
  source: searchChanged,
  timeout: 500,
  target: searchWithStringFx,
});

const searchWithFuelTypeFx = attach({
  effect: searchFx,
  source: $combinedFilter,
  mapParams: (fuelTypeFilter: StateParams['fuelTypeFilter'], filters) => ({
    ...filters,
    fuelTypeFilter,
  }),
});

sample({
  source: $fuelTypeFilter,
  target: searchWithFuelTypeFx,
  clock: fuelTypeChanged,
});

forward({ from: [searchChanged, fuelTypeChanged], to: pagingReset });

sample({
  clock: searchFx.done,
  source: searchFx.done,
  fn: ({ result }) => result.paging,
  target: updatePaging,
});

const carsReset = createEvent();
const $cars = createStore<Car[]>([])
  .on(searchFx.done, (state, { result, params }) => {
    return params.paging.page === 1
      ? result.payload
      : state.concat(result.payload);
  })
  .on(searchFx.fail, (state, { error }) => {
    console.error('search request failed', error);
    return state;
  })
  .reset(carsReset);

const filtersReset = createEvent();

forward({
  from: filtersReset,
  to: [searchReset, fuelTypeReset, pagingReset],
});

export {
  pagingChanged,
  updatePaging,
  pagingReset,
  resetInitFinished,
  searchChanged,
  searchReset,
  filtersReset,
  $cars,
  $initFinished,
  fuelTypeChanged,
  $paging,
  $searchFilter,
  searchFx,
  $fuelTypeFilter,
};
