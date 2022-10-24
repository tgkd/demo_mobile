import { createStore, createEvent, forward } from 'effector';

import { Car } from '../types';
import { searchFx } from './filters';

const setInitFinished = createEvent();
const resetInitFinished = createEvent();
const $initFinished = createStore(false)
  .on(setInitFinished, () => true)
  .reset(resetInitFinished);

forward({ from: searchFx.done, to: setInitFinished });

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

export { resetInitFinished, $cars, $initFinished };
