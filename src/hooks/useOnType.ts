import { createMemo } from 'solid-js';

import { useSearchDisabledConfig } from '../config/useConfig';
import { useAppendSearch } from './useFilter';
import { useFocusSearchInput } from './useFocus';
import { useCloseAllOpenToggles } from './useCloseAllOpenToggles';

export function useOnType() {
  const appendSearch = useAppendSearch();
  const focusSearchInput = useFocusSearchInput();
  const searchDisabled = useSearchDisabledConfig();
  const closeAllOpenToggles = useCloseAllOpenToggles();

  return createMemo(() => {
    return (event: KeyboardEvent) => {
      const { key } = event;

      if (hasModifier(event) || searchDisabled) {
        return;
      }

      if (key.match(/(^[a-zA-Z0-9]$){1}/)) {
        event.preventDefault();
        closeAllOpenToggles();
        focusSearchInput();
        appendSearch(key);
      }
    };
  });
}

function hasModifier(event: KeyboardEvent): boolean {
  return event.ctrlKey || event.altKey || event.metaKey;
} 