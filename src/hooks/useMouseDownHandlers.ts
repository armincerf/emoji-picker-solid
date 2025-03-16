import { createEffect, createMemo } from 'solid-js';

import {
  emojiFromElement,
  isEmojiElement,
  type NullableElement
} from '../DomUtils/selectors';
import {
  useActiveSkinToneState,
  useDisallowClickRef,
  useEmojiVariationPickerState,
  useUpdateSuggested
} from '../components/context/PickerContext';
import type { GetEmojiUrl } from '../components/emoji/BaseEmojiProps';
import {
  type MOUSE_EVENT_SOURCE,
  useEmojiStyleConfig,
  useGetEmojiUrlConfig,
  useOnEmojiClickConfig
} from '../config/useConfig';
import type { DataEmoji } from '../dataUtils/DataTypes';
import {
  activeVariationFromUnified,
  emojiHasVariations,
  emojiNames,
  emojiUnified
} from '../dataUtils/emojiSelectors';
import { parseNativeEmoji } from '../dataUtils/parseNativeEmoji';
import { setSuggested } from '../dataUtils/suggested';
import { isCustomEmoji } from '../typeRefinements/typeRefinements';
import { type EmojiClickData, type SkinTones, EmojiStyle } from '../types/exposedTypes';

import { useCloseAllOpenToggles } from './useCloseAllOpenToggles';
import useSetVariationPicker from './useSetVariationPicker';

export function useMouseDownHandlers(
  ContainerRef: { current: NullableElement },
  mouseEventSource: MOUSE_EVENT_SOURCE
) {
  let mouseDownTimer: number | undefined;
  const setVariationPicker = useSetVariationPicker();
  const disallowClickRef = useDisallowClickRef();
  const [, setEmojiVariationPicker] = useEmojiVariationPickerState();
  const closeAllOpenToggles = useCloseAllOpenToggles();
  const [activeSkinTone] = useActiveSkinToneState();
  const onEmojiClick = useOnEmojiClickConfig(mouseEventSource);
  const [, updateSuggested] = useUpdateSuggested();
  const getEmojiUrl = useGetEmojiUrlConfig();
  const activeEmojiStyle = useEmojiStyleConfig();

  const onClick = createMemo(() => {
    return function onClick(event: MouseEvent) {
      if (disallowClickRef.current) {
        return;
      }

      closeAllOpenToggles();

      const [emoji, unified] = emojiFromEvent(event);

      if (!emoji || !unified) {
        return;
      }

      const skinToneToUse =
        activeVariationFromUnified(unified) || activeSkinTone;

      updateSuggested();
      setSuggested(emoji, skinToneToUse);
      onEmojiClick(
        emojiClickOutput(emoji, skinToneToUse, activeEmojiStyle, getEmojiUrl),
        event
      );
    };
  });

  const onMouseDown = createMemo(() => {
    return function onMouseDown(event: MouseEvent) {
      if (mouseDownTimer) {
        clearTimeout(mouseDownTimer);
      }

      const [emoji] = emojiFromEvent(event);

      if (!emoji || !emojiHasVariations(emoji)) {
        return;
      }

      mouseDownTimer = window?.setTimeout(() => {
        disallowClickRef.current = true;
        mouseDownTimer = undefined;
        closeAllOpenToggles();
        setVariationPicker(event.target as HTMLElement);
        setEmojiVariationPicker(emoji);
      }, 500);
    };
  });

  const onMouseUp = createMemo(() => {
    return function onMouseUp() {
      if (mouseDownTimer) {
        clearTimeout(mouseDownTimer);
        mouseDownTimer = undefined;
      } else if (disallowClickRef.current) {
        // The problem we're trying to overcome here
        // is that the emoji has both mouseup and click events
        // and when releasing a mouseup event
        // the click gets triggered too
        // So we're disallowing the click event for a short time

        requestAnimationFrame(() => {
          disallowClickRef.current = false;
        });
      }
    };
  });

  createEffect(() => {
    if (!ContainerRef.current) {
      return;
    }
    const containerRef = ContainerRef.current;
    containerRef.addEventListener('click', onClick(), {
      passive: true
    });

    containerRef.addEventListener('mousedown', onMouseDown(), {
      passive: true
    });
    containerRef.addEventListener('mouseup', onMouseUp(), {
      passive: true
    });

    return () => {
      containerRef?.removeEventListener('click', onClick());
      containerRef?.removeEventListener('mousedown', onMouseDown());
      containerRef?.removeEventListener('mouseup', onMouseUp());
    };
  });
}

function emojiFromEvent(event: MouseEvent): [DataEmoji, string] | [] {
  const target = event?.target as HTMLElement;
  if (!isEmojiElement(target)) {
    return [];
  }

  return emojiFromElement(target);
}

function emojiClickOutput(
  emoji: DataEmoji,
  activeSkinTone: SkinTones,
  activeEmojiStyle: EmojiStyle,
  getEmojiUrl: GetEmojiUrl
): EmojiClickData {
  const names = emojiNames(emoji);

  if (isCustomEmoji(emoji)) {
    const unified = emojiUnified(emoji);
    return {
      activeSkinTone,
      emoji: unified,
      getImageUrl() {
        return emoji.imgUrl;
      },
      imageUrl: emoji.imgUrl,
      isCustom: true,
      names,
      unified,
      unifiedWithoutSkinTone: unified
    };
  }
  const unified = emojiUnified(emoji, activeSkinTone);

  return {
    activeSkinTone,
    emoji: parseNativeEmoji(unified),
    getImageUrl(emojiStyle: EmojiStyle = activeEmojiStyle ?? EmojiStyle.APPLE) {
      return getEmojiUrl(unified, emojiStyle);
    },
    imageUrl: getEmojiUrl(unified, activeEmojiStyle ?? EmojiStyle.APPLE),
    isCustom: false,
    names,
    unified,
    unifiedWithoutSkinTone: emojiUnified(emoji)
  };
}
