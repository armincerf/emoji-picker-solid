import { createContext, useContext, createEffect } from 'solid-js';

import type {MouseDownEvent, OnSkinToneChange} from './config';

export type MutableConfig = {
  onEmojiClick?: MouseDownEvent;
  onReactionClick?: MouseDownEvent;
  onSkinToneChange?: OnSkinToneChange;
};

export type MutableConfigRef = {
  current: MutableConfig;
};

export const MutableConfigContext = createContext<MutableConfigRef>({} as MutableConfigRef);

export function useMutableConfig(): MutableConfigRef {
  const mutableConfig = useContext(MutableConfigContext);
  return mutableConfig;
}

export function useDefineMutableConfig(
  config: MutableConfig
): MutableConfigRef {
  const MutableConfigRef: MutableConfigRef = {
    current: {
      onEmojiClick: config.onEmojiClick || emptyFunc,
      onReactionClick: config.onReactionClick || config.onEmojiClick,
      onSkinToneChange: config.onSkinToneChange || emptyFunc
    }
  };

  createEffect(() => {
    MutableConfigRef.current.onEmojiClick = config.onEmojiClick || emptyFunc;
    MutableConfigRef.current.onReactionClick =
      config.onReactionClick || config.onEmojiClick;
  });

  createEffect(() => {
    MutableConfigRef.current.onSkinToneChange = config.onSkinToneChange || emptyFunc;
  });

  return MutableConfigRef;
}

function emptyFunc() {}
