import { createEffect, createMemo } from 'solid-js';

import { hasNextElementSibling } from '../DomUtils/elementPositionInRow';
import {
  focusNextElementSibling,
  focusPrevElementSibling
} from '../DomUtils/focusElement';
import { getActiveElement } from '../DomUtils/getActiveElement';
import {
  focusAndClickFirstVisibleEmoji,
  focusFirstVisibleEmoji,
  focusNextVisibleEmoji,
  focusPrevVisibleEmoji,
  focusVisibleEmojiOneRowDown,
  focusVisibleEmojiOneRowUp
} from '../DomUtils/keyboardNavigation';
import { useScrollTo } from '../DomUtils/scrollTo';
import { buttonFromTarget } from '../DomUtils/selectors';
import {
  useBodyRef,
  useCategoryNavigationRef,
  usePickerMainRef,
  useSearchInputRef,
  useSkinTonePickerRef
} from '../components/context/ElementRefContext';
import { useSkinToneFanOpenState } from '../components/context/PickerContext';

import {
  useCloseAllOpenToggles,
  useHasOpenToggles
} from './useCloseAllOpenToggles';
import { useDisallowMouseMove } from './useDisallowMouseMove';
import { useClearSearch } from './useFilter';
import {
  useFocusSearchInput,
  useFocusSkinTonePicker
} from './useFocus';
import { useGoDownFromSearchInput } from './useGoDownFromSearchInput';
import { useGoUpFromBody } from './useGoUpFromBody';
import { useOnType } from './useOnType';
import useSetVariationPicker from './useSetVariationPicker';
import {
  useIsSkinToneInPreview,
  useIsSkinToneInSearch
} from './useShouldShowSkinTonePicker';

enum KeyboardEvents {
  ArrowDown = 'ArrowDown',
  ArrowUp = 'ArrowUp',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  Escape = 'Escape',
  Enter = 'Enter',
  Space = ' '
}

export function useKeyboardNavigation() {
  usePickerMainKeyboardEvents();
  useSearchInputKeyboardEvents();
  useSkinTonePickerKeyboardEvents();
  useCategoryNavigationKeyboardEvents();
  useBodyKeyboardEvents();
}

function usePickerMainKeyboardEvents() {
  const PickerMainRef = usePickerMainRef();
  const clearSearch = useClearSearch();
  const scrollTo = useScrollTo();
  const focusSearchInput = useFocusSearchInput();
  const hasOpenToggles = useHasOpenToggles();
  const disallowMouseMove = useDisallowMouseMove();

  const closeAllOpenToggles = useCloseAllOpenToggles();

  const onKeyDown = createMemo(() => {
    return function onKeyDown(event: KeyboardEvent): void {
      const { key } = event;

      disallowMouseMove();
      switch (key) {
        case KeyboardEvents.Escape:
          event.preventDefault();
          if (hasOpenToggles()) {
            closeAllOpenToggles();
            return;
          }
          clearSearch();
          scrollTo()(0);
          focusSearchInput();
          break;
      }
    };
  });

  createEffect(() => {
    const current = PickerMainRef.current;

    if (!current) {
      return;
    }

    const handler = onKeyDown();
    current.addEventListener('keydown', handler);

    return () => {
      current.removeEventListener('keydown', handler);
    };
  });
}

function useSearchInputKeyboardEvents() {
  const focusSkinTonePicker = useFocusSkinTonePicker();
  const BodyRef = useBodyRef();
  const SearchInputRef = useSearchInputRef();
  const [, setSkinToneFanOpenState] = useSkinToneFanOpenState();
  const goDownFromSearchInput = useGoDownFromSearchInput();
  const isSkinToneInSearch = useIsSkinToneInSearch();

  const onKeyDown = createMemo(() => {
    return function onKeyDown(event: KeyboardEvent): void {
      const { key } = event;

      switch (key) {
        case KeyboardEvents.ArrowRight:
          if (!isSkinToneInSearch) {
            return;
          }
          event.preventDefault();
          setSkinToneFanOpenState(true);
          focusSkinTonePicker();
          break;
        case KeyboardEvents.ArrowDown:
          event.preventDefault();
          goDownFromSearchInput();
          break;
        case KeyboardEvents.Enter:
          event.preventDefault();
          focusAndClickFirstVisibleEmoji(BodyRef.current);
          break;
      }
    };
  });

  createEffect(() => {
    const current = SearchInputRef.current;

    if (!current) {
      return;
    }

    const handler = onKeyDown();
    current.addEventListener('keydown', handler);

    return () => {
      current.removeEventListener('keydown', handler);
    };
  });
}

function useSkinTonePickerKeyboardEvents() {
  const SkinTonePickerRef = useSkinTonePickerRef();
  const focusSearchInput = useFocusSearchInput();
  const goDownFromSearchInput = useGoDownFromSearchInput();
  const [isOpen, setIsOpen] = useSkinToneFanOpenState();
  const isSkinToneInPreview = useIsSkinToneInPreview();
  const isSkinToneInSearch = useIsSkinToneInSearch();
  const onType = useOnType();

  const onKeyDown = createMemo(() => {
    return function onKeyDown(event: KeyboardEvent): void {
      const { key } = event;

      if (isSkinToneInSearch) {
        switch (key) {
          case KeyboardEvents.ArrowLeft:
            event.preventDefault();
            if (!isOpen) {
              focusSearchInput();
              return;
            }
            focusNextSkinTone();
            break;
          case KeyboardEvents.ArrowRight:
            event.preventDefault();
            if (!isOpen) {
              focusSearchInput();
              return;
            }
            focusPrevSkinTone();
            break;
          case KeyboardEvents.ArrowDown:
            event.preventDefault();
            if (isOpen) {
              setIsOpen(false);
            }
            goDownFromSearchInput();
            break;
          default:
            onType()(event);
            break;
        }
      }

      if (isSkinToneInPreview) {
        switch (key) {
          case KeyboardEvents.ArrowUp:
            event.preventDefault();
            if (!isOpen) {
              focusSearchInput();
              return;
            }
            focusNextSkinTone();
            break;
          case KeyboardEvents.ArrowDown:
            event.preventDefault();
            if (!isOpen) {
              focusSearchInput();
              return;
            }
            focusPrevSkinTone();
            break;
          default:
            onType()(event);
            break;
        }
      }
    };
  });

  createEffect(() => {
    const current = SkinTonePickerRef.current;

    if (!current) {
      return;
    }

    const handler = onKeyDown();
    current.addEventListener('keydown', handler);

    return () => {
      current.removeEventListener('keydown', handler);
    };
  });
}

function useCategoryNavigationKeyboardEvents() {
  const CategoryNavigationRef = useCategoryNavigationRef();
  const BodyRef = useBodyRef();
  const focusSearchInput = useFocusSearchInput();
  const onType = useOnType();

  const onKeyDown = createMemo(() => {
    return function onKeyDown(event: KeyboardEvent): void {
      const { key } = event;

      switch (key) {
        case KeyboardEvents.ArrowUp:
          event.preventDefault();
          focusSearchInput();
          break;
        case KeyboardEvents.ArrowDown:
          event.preventDefault();
          focusFirstVisibleEmoji(BodyRef.current);
          break;
        default:
          onType()(event);
          break;
      }
    };
  });

  createEffect(() => {
    const current = CategoryNavigationRef.current;

    if (!current) {
      return;
    }

    const handler = onKeyDown();
    current.addEventListener('keydown', handler);

    return () => {
      current.removeEventListener('keydown', handler);
    };
  });
}

function useBodyKeyboardEvents() {
  const BodyRef = useBodyRef();
  const goUpFromBody = useGoUpFromBody();
  const onType = useOnType();
  const setVariationPicker = useSetVariationPicker();
  const hasOpenToggles = useHasOpenToggles();
  const closeAllOpenToggles = useCloseAllOpenToggles();

  const onKeyDown = createMemo(() => {
    return function onKeyDown(event: KeyboardEvent): void {
      const { key } = event;
      const activeElement = getActiveElement();

      if (!activeElement) {
        return;
      }

      const button = buttonFromTarget(activeElement);

      if (!button) {
        return;
      }

      switch (key) {
        case KeyboardEvents.ArrowUp:
          event.preventDefault();
          if (hasOpenToggles()) {
            closeAllOpenToggles();
            return;
          }
          if (hasNextElementSibling(button)) {
            focusVisibleEmojiOneRowUp(button, goUpFromBody);
            return;
          }
          goUpFromBody();
          break;
        case KeyboardEvents.ArrowDown:
          event.preventDefault();
          if (hasOpenToggles()) {
            closeAllOpenToggles();
            return;
          }
          if (hasNextElementSibling(button)) {
            focusVisibleEmojiOneRowDown(button);
            return;
          }
          break;
        case KeyboardEvents.ArrowLeft:
          event.preventDefault();
          if (hasOpenToggles()) {
            closeAllOpenToggles();
            return;
          }
          focusPrevVisibleEmoji(button);
          break;
        case KeyboardEvents.ArrowRight:
          event.preventDefault();
          if (hasOpenToggles()) {
            closeAllOpenToggles();
            return;
          }
          focusNextVisibleEmoji(button);
          break;
        case KeyboardEvents.Space:
          event.preventDefault();
          setVariationPicker(button);
          break;
        default:
          onType()(event);
          break;
      }
    };
  });

  createEffect(() => {
    const current = BodyRef.current;

    if (!current) {
      return;
    }

    const handler = onKeyDown();
    current.addEventListener('keydown', handler);

    return () => {
      current.removeEventListener('keydown', handler);
    };
  });
}

function focusNextSkinTone() {
  const activeElement = getActiveElement();

  if (!activeElement) {
    return;
  }

  focusPrevElementSibling(activeElement);
}

function focusPrevSkinTone() {
  const activeElement = getActiveElement();

  if (!activeElement) {
    return;
  }

  focusNextElementSibling(activeElement);
}
