import { createMemo } from 'solid-js';

import {
  useEmojiVariationPickerState,
  useSkinToneFanOpenState
} from '../components/context/PickerContext';

export function useCloseAllOpenToggles() {
  const [variationPicker, setVariationPicker] = useEmojiVariationPickerState();
  const [skinToneFanOpen, setSkinToneFanOpen] = useSkinToneFanOpenState();

  const closeAllOpenToggles = createMemo(() => {
    return () => {
      if (variationPicker) {
        setVariationPicker(null);
      }

      if (skinToneFanOpen) {
        setSkinToneFanOpen(false);
      }
    };
  });

  return closeAllOpenToggles;
}

export function useHasOpenToggles() {
  const [variationPicker] = useEmojiVariationPickerState();
  const [skinToneFanOpen] = useSkinToneFanOpenState();

  return function hasOpenToggles() {
    return !!variationPicker || skinToneFanOpen;
  };
}
