import {
  Categories,
  type CategoryConfig,
  type CustomCategoryConfig
} from '../config/categoryConfig';
import type { CustomEmoji } from '../config/customEmojiConfig';
import type { DataEmoji } from '../dataUtils/DataTypes';

export function isCustomCategory(
  category: CategoryConfig | CustomCategoryConfig
): category is CustomCategoryConfig {
  return category.category === Categories.CUSTOM;
}

export function isCustomEmoji(emoji: Partial<DataEmoji>): emoji is CustomEmoji {
  return emoji.imgUrl !== undefined;
}
