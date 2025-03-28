import type { NullableElement } from './selectors';

export function getActiveElement() {
  return document.activeElement as NullableElement;
}
