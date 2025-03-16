import { createMemo } from 'solid-js';

import { focusElement, focusFirstElementChild } from '../DomUtils/focusElement';
import {
  useCategoryNavigationRef,
  useSearchInputRef,
  useSkinTonePickerRef
} from '../components/context/ElementRefContext';

export function useFocusSearchInput() {
  const SearchInputRef = useSearchInputRef();

  return createMemo(() => {
    return () => {
      focusElement(SearchInputRef.current);
    };
  });
}

export function useFocusSkinTonePicker() {
  const SkinTonePickerRef = useSkinTonePickerRef();

  return createMemo(() => {
    return () => {
      if (!SkinTonePickerRef.current) {
        return;
      }

      focusFirstElementChild(SkinTonePickerRef.current);
    };
  });
}

export function useFocusCategoryNavigation() {
  const CategoryNavigationRef = useCategoryNavigationRef();

  return createMemo(() => {
    return () => {
      if (!CategoryNavigationRef.current) {
        return;
      }

      focusFirstElementChild(CategoryNavigationRef.current);
    };
  });
}
