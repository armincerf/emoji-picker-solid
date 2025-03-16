import { createMemo } from 'solid-js';

import { focusFirstVisibleEmoji } from '../DomUtils/keyboardNavigation';
import { useBodyRef } from '../components/context/ElementRefContext';
import { useFocusCategoryNavigation } from './useFocus';
import useIsSearchMode from './useIsSearchMode';

export function useGoDownFromSearchInput() {
  const focusCategoryNavigation = useFocusCategoryNavigation();
  const isSearchMode = useIsSearchMode();
  const BodyRef = useBodyRef();

  return createMemo(() => {
    return () => {
      if (isSearchMode) {
        return focusFirstVisibleEmoji(BodyRef.current);
      }
      return focusCategoryNavigation();
    };
  });
} 