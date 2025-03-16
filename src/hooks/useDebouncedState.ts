import { createSignal } from 'solid-js';

export function useDebouncedState<T>(
  initialValue: T,
  delay = 0
): [T, (value: T) => Promise<T>] {
  const [state, setState] = createSignal<T>(initialValue);
  let timer: number | null = null;

  function debouncedSetState(value: T) {
    return new Promise<T>(resolve => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = window?.setTimeout(() => {
        setState(() => value);
        resolve(value);
      }, delay);
    });
  }

  return [state(), debouncedSetState];
}
