import axios from 'axios';
import {
  attach,
  combine,
  createEffect,
  createEvent,
  createStore,
  forward,
  sample,
} from 'effector';
import { throttle } from 'patronum';

import { CarFuel, ListRequestParams } from '../types';

const API_URL = 'http://localhost:3004/data';

const filtersReset = createEvent();

const searchFx = createEffect({
  async handler(params: ListRequestParams) {
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
const pagingChanged = createEvent<ListRequestParams['paging']>();
const updatePaging = createEvent<ListRequestParams['paging']>();
const pagingReset = createEvent();
const $paging = createStore<ListRequestParams['paging']>({
  page: 1,
  limit: 10,
  total: 100,
})
  .on(pagingChanged, (_, paging) => paging)
  .on(updatePaging, (_, paging) => paging)
  .reset(pagingReset);

const searchChanged = createEvent<string>();
const searchReset = createEvent();
const $searchFilter = createStore('')
  .on(searchChanged, (_, newSearch) => newSearch)
  .reset(searchReset);

const fuelTypeChanged = createEvent<CarFuel | null>();
const fuelTypeReset = createEvent();
const $fuelTypeFilter = createStore<ListRequestParams['fuelTypeFilter']>(null)
  .on(fuelTypeChanged, (_, fuelType) => fuelType)
  .reset(fuelTypeReset);

const $combinedFilter = combine({
  searchFilter: $searchFilter,
  paging: $paging,
  fuelTypeFilter: $fuelTypeFilter,
});

const searchWithPageFx = attach({
  effect: searchFx,
  source: $combinedFilter,
  mapParams: (paging: ListRequestParams['paging'], filters) => ({
    ...filters,
    paging,
  }),
});

sample({
  source: $paging,
  target: searchWithPageFx,
  clock: pagingChanged,
});

sample({
  clock: searchFx.done,
  source: searchFx.done,
  fn: ({ result }) => result.paging,
  target: updatePaging,
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
  mapParams: (
    fuelTypeFilter: ListRequestParams['fuelTypeFilter'],
    filters,
  ) => ({
    ...filters,
    fuelTypeFilter,
  }),
});

sample({
  source: $fuelTypeFilter,
  target: searchWithFuelTypeFx,
  clock: fuelTypeChanged,
});

forward({
  from: [searchChanged, fuelTypeChanged],
  to: pagingReset,
});

forward({
  from: filtersReset,
  to: [searchReset, fuelTypeReset, pagingReset],
});

sample({
  source: $combinedFilter,
  target: searchFx,
  clock: filtersReset,
});

export {
  searchChanged,
  searchReset,
  $searchFilter,
  fuelTypeChanged,
  fuelTypeReset,
  $fuelTypeFilter,
  pagingChanged,
  pagingReset,
  $paging,
  filtersReset,
  $combinedFilter,
  searchFx,
};
