import type { CustomEmoji } from '../../config/customEmojiConfig';
import type { DataEmoji } from '../../dataUtils/DataTypes';
import type { EmojiStyle } from '../../types/exposedTypes';

export type BaseEmojiProps = {
  emoji?: DataEmoji | CustomEmoji;
  emojiStyle: EmojiStyle;
  unified: string;
  size?: number;
  lazyLoad?: boolean;
  getEmojiUrl?: GetEmojiUrl;
  class?: string;
};
export type GetEmojiUrl = (unified: string, style: EmojiStyle) => string;
