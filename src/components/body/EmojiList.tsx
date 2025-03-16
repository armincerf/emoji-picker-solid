import { cx } from "flairup";
import { createSignal, Suspense, For, Show } from "solid-js";

import { ClassNames } from "../../DomUtils/classNames";
import { stylesheet } from "../../Stylesheet/stylesheet";
import {
	Categories,
	type CategoryConfig,
	categoryFromCategoryConfig,
} from "../../config/categoryConfig";
import {
	useCategoriesConfig,
	useEmojiStyleConfig,
	useGetEmojiUrlConfig,
	useLazyLoadEmojisConfig,
	useSkinTonesDisabledConfig,
} from "../../config/useConfig";
import { emojisByCategory, emojiUnified } from "../../dataUtils/emojiSelectors";
import { useIsEmojiHidden } from "../../hooks/useIsEmojiHidden";
import {
	useActiveSkinToneState,
	useIsPastInitialLoad,
} from "../context/PickerContext";
import { ClickableEmoji } from "../emoji/Emoji";

import { EmojiCategory } from "./EmojiCategory";
import { Suggested } from "./Suggested";

export function EmojiList() {
	const categories = useCategoriesConfig();
	const renderdCategoriesCountRef = { current: 0 };

	return (
		<ul class={cx(styles.emojiList)}>
			<For each={categories}>
				{(categoryConfig) => {
					const category = categoryFromCategoryConfig(categoryConfig);

					return (
						<Show
							when={category !== Categories.SUGGESTED}
							fallback={<Suggested categoryConfig={categoryConfig} />}
						>
							<Suspense>
								<RenderCategory
									category={category}
									categoryConfig={categoryConfig}
									renderdCategoriesCountRef={renderdCategoriesCountRef}
								/>
							</Suspense>
						</Show>
					);
				}}
			</For>
		</ul>
	);
}

function RenderCategory(props: {
	category: Categories;
	categoryConfig: CategoryConfig;
	renderdCategoriesCountRef: { current: number };
}) {
	const { category, categoryConfig, renderdCategoriesCountRef } = props;

	const isEmojiHidden = useIsEmojiHidden();
	const lazyLoadEmojis = useLazyLoadEmojisConfig();
	const emojiStyle = useEmojiStyleConfig();
	const isPastInitialLoad = useIsPastInitialLoad();
	const [activeSkinTone] = useActiveSkinToneState();
	const getEmojiUrl = useGetEmojiUrlConfig();
	const showVariations = !useSkinTonesDisabledConfig();

	// Get emojis for this category
	const getEmojis = () => {
		// Small trick to defer the rendering of all emoji categories until the first category is visible
		// This way the user gets to actually see something and not wait for the whole picker to render.
		const emojisToPush =
			!isPastInitialLoad && renderdCategoriesCountRef.current > 0
				? []
				: emojisByCategory(category);

		if (emojisToPush.length > 0) {
			renderdCategoriesCountRef.current++;
		}

		return emojisToPush;
	};

	const [hiddenCounter, setHiddenCounter] = createSignal(0);

	return (
		<EmojiCategory
			categoryConfig={categoryConfig}
			// Indicates that there are no visible emojis
			// Hence, the category should be hidden
			hidden={hiddenCounter() === getEmojis().length}
		>
			<For each={getEmojis()}>
				{(emoji) => {
					const unified = emojiUnified(emoji, activeSkinTone);
					const { failedToLoad, filteredOut, hidden } = isEmojiHidden(emoji);

					if (hidden) {
						setHiddenCounter((prev) => prev + 1);
					}

					return (
						<Show when={!failedToLoad}>
							<ClickableEmoji
								showVariations={showVariations}
								emoji={emoji}
								unified={unified}
								hidden={failedToLoad}
								hiddenOnSearch={filteredOut}
								emojiStyle={emojiStyle}
								lazyLoad={lazyLoadEmojis}
								getEmojiUrl={getEmojiUrl}
							/>
						</Show>
					);
				}}
			</For>
		</EmojiCategory>
	);
}

const styles = stylesheet.create({
	emojiList: {
		".": ClassNames.emojiList,
		listStyle: "none",
		margin: "0",
		padding: "0",
	},
});
