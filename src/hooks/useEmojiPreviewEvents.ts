import { createEffect, type Setter } from 'solid-js';

import { detectEmojyPartiallyBelowFold } from '../DomUtils/detectEmojyPartiallyBelowFold';
import { focusElement } from '../DomUtils/focusElement';
import {
  allUnifiedFromEmojiElement,
  buttonFromTarget
} from '../DomUtils/selectors';
import { useBodyRef } from '../components/context/ElementRefContext';
import type { PreviewEmoji } from '../components/footer/Preview';

import {
  useIsMouseDisallowed
} from './useDisallowMouseMove';

export function useEmojiPreviewEvents(
  allow: boolean,
  setPreviewEmoji: Setter<PreviewEmoji>
) {
  const BodyRef = useBodyRef();
  const isMouseDisallowed = useIsMouseDisallowed();

  createEffect(() => {
    if (!allow) {
      return;
    }
    const bodyRef = BodyRef.current;

    bodyRef?.addEventListener('keydown', onEscape, {
      passive: true
    });

    bodyRef?.addEventListener('mouseover', onMouseOver, true);

    bodyRef?.addEventListener('focus', onEnter, true);

    bodyRef?.addEventListener('mouseout', onLeave, {
      passive: true
    });
    bodyRef?.addEventListener('blur', onLeave, true);

    function onEnter(e: FocusEvent) {
      const button = buttonFromTarget(e.target as HTMLElement);

      if (!button) {
        onLeave();
        return;
      }

      const { unified, originalUnified } = allUnifiedFromEmojiElement(button);

      if (!unified || !originalUnified) {
        onLeave();
        return;
      }

      setPreviewEmoji({
        unified,
        originalUnified
      });
    }
    
    function onLeave(e?: FocusEvent | MouseEvent) {
      if (e) {
        const relatedTarget = e.relatedTarget as HTMLElement;

        if (!buttonFromTarget(relatedTarget)) {
          setPreviewEmoji(null);
          return;
        }
      }

      setPreviewEmoji(null);
    }
    
    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setPreviewEmoji(null);
      }
    }

    function onMouseOver(e: MouseEvent) {
      if (isMouseDisallowed()) {
        return;
      }

      const button = buttonFromTarget(e.target as HTMLElement);

      if (button) {
        const belowFoldByPx = detectEmojyPartiallyBelowFold(button, bodyRef);
        const buttonHeight = button.getBoundingClientRect().height;
        if (belowFoldByPx < buttonHeight) {
          return handlePartiallyVisibleElementFocus(button, setPreviewEmoji);
        }

        focusElement(button);
      }
    }

    return () => {
      bodyRef?.removeEventListener('mouseover', onMouseOver);
      bodyRef?.removeEventListener('mouseout', onLeave);
      bodyRef?.removeEventListener('focus', onEnter, true);
      bodyRef?.removeEventListener('blur', onLeave, true);
      bodyRef?.removeEventListener('keydown', onEscape);
    };
  });
}

function handlePartiallyVisibleElementFocus(
  button: HTMLElement,
  setPreviewEmoji: Setter<PreviewEmoji>
) {
  const { unified, originalUnified } = allUnifiedFromEmojiElement(button);

  if (!unified || !originalUnified) {
    return;
  }

  (document.activeElement as HTMLElement)?.blur?.();

  setPreviewEmoji({
    unified,
    originalUnified
  });
}
