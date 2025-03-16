import { createEffect, type Setter } from 'solid-js';

export function useMarkInitialLoad(
  dispatch: Setter<boolean>
) {
  createEffect(() => {
    dispatch(true);
  });
}
