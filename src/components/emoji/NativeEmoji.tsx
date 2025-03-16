import { cx } from 'flairup';
import type { JSX } from 'solid-js';

import { stylesheet } from '../../Stylesheet/stylesheet';
import { parseNativeEmoji } from '../../dataUtils/parseNativeEmoji';

import { emojiStyles } from './emojiStyles';

export function NativeEmoji({
  unified,
  style,
  class: className
}: {
  unified: string;
  style: JSX.CSSProperties;
  class?: string;
}) {
  return (
    <span
      class={cx(
        styles.nativeEmoji,
        emojiStyles.common,
        emojiStyles.external,
        className
      )}
      data-unified={unified}
      style={style}
    >
      {parseNativeEmoji(unified)}
    </span>
  );
}

const styles = stylesheet.create({
  nativeEmoji: {
    '.': 'epr-emoji-native',
    fontFamily:
      '"Segoe UI Emoji", "Segoe UI Symbol", "Segoe UI", "Apple Color Emoji", "Twemoji Mozilla", "Noto Color Emoji", "EmojiOne Color", "Android Emoji"!important',
    position: 'relative',
    lineHeight: '100%',
    fontSize: 'var(--epr-emoji-size)',
    textAlign: 'center',
    alignSelf: 'center',
    justifySelf: 'center',
    letterSpacing: '0',
    padding: 'var(--epr-emoji-padding)'
  }
});
