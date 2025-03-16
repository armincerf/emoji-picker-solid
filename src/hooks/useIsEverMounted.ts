import { createSignal, createEffect } from 'solid-js';

let isEverMounted = false;

export function useIsEverMounted() {
  const [isMounted, setIsMounted] = createSignal(isEverMounted);

  createEffect(() => {
    setIsMounted(true);
    isEverMounted = true;
  });

  return isMounted() || isEverMounted;
}
