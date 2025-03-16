import { type JSX } from 'solid-js';

import EmojiPickerSolid from './EmojiPickerSolid';
import ErrorBoundary from './components/ErrorBoundary';
import type { PickerConfig } from './config/config';
import { useDefineMutableConfig as createMutableConfig, MutableConfigContext } from './config/mutableConfig';

export { ExportedEmoji as Emoji } from './components/emoji/ExportedEmoji';

export type { EmojiClickData } from './types/exposedTypes';
export {
  EmojiStyle,
  SkinTones,
  Theme,
  Categories,
  SuggestionMode,
  SkinTonePickerLocation
} from './types/exposedTypes';

export interface PickerProps extends PickerConfig {}

export default function EmojiPicker(props: PickerProps): JSX.Element {
  const mutableConfigRef = createMutableConfig({
    onEmojiClick: props.onEmojiClick,
    onReactionClick: props.onReactionClick,
    onSkinToneChange: props.onSkinToneChange,
  });

  return (
    <ErrorBoundary>
      <MutableConfigContext.Provider value={mutableConfigRef}>
        <EmojiPickerSolid {...props} />
      </MutableConfigContext.Provider>
    </ErrorBoundary>
  );
}
