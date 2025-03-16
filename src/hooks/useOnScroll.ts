import { createEffect } from 'solid-js';

import type { ElementRef } from '../components/context/ElementRefContext';

import { useCloseAllOpenToggles } from './useCloseAllOpenToggles';

export function useOnScroll(BodyRef: ElementRef) {
  const closeAllOpenToggles = useCloseAllOpenToggles();

  createEffect(() => {
    const bodyRef = BodyRef.current;
    if (!bodyRef) {
      return;
    }

    bodyRef.addEventListener('scroll', onScroll, {
      passive: true
    });

    function onScroll() {
      closeAllOpenToggles();
    }

    return () => {
      bodyRef?.removeEventListener('scroll', onScroll);
    };
  });
}
