import { createMemo } from 'solid-js';

import { useFocusCategoryNavigation, useFocusSearchInput } from './useFocus';
import useIsSearchMode from './useIsSearchMode';

export function useGoUpFromBody() {
  const focusSearchInput = useFocusSearchInput();
  const focusCategoryNavigation = useFocusCategoryNavigation();
  const isSearchMode = useIsSearchMode();

  return createMemo(() => {
    return () => {
      if (isSearchMode) {
        return focusSearchInput();
      }
      return focusCategoryNavigation();
    };
  });
} 