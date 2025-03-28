import { createMemo, Index } from "solid-js";
import type { CategoryConfig } from "../../config/categoryConfig";
import {
	useEmojiStyleConfig,
	useGetEmojiUrlConfig,
	useSuggestedEmojisModeConfig,
} from "../../config/useConfig";
import { emojiByUnified } from "../../dataUtils/emojiSelectors";
import { getSuggested } from "../../dataUtils/suggested";
import { useIsEverMounted } from "../../hooks/useIsEverMounted";
import { useUpdateSuggested } from "../context/PickerContext";
import { ClickableEmoji } from "../emoji/Emoji";

import { EmojiCategory } from "./EmojiCategory";

type Props = Readonly<{
	categoryConfig: CategoryConfig;
}>;

export function Suggested({ categoryConfig }: Props) {
	const [suggestedUpdated] = useUpdateSuggested();
	const isMounted = useIsEverMounted();
	const suggestedEmojisModeConfig = useSuggestedEmojisModeConfig();
	const getEmojiUrl = useGetEmojiUrlConfig();
	const suggested = createMemo(
		() => getSuggested(suggestedEmojisModeConfig) ?? [],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[suggestedUpdated, suggestedEmojisModeConfig],
	);
	const emojiStyle = useEmojiStyleConfig();

	if (!isMounted) {
		return null;
	}

	return (
		<EmojiCategory
			categoryConfig={categoryConfig}
			hiddenOnSearch
			hidden={suggested().length === 0}
		>
			<Index each={suggested()}>
				{(suggestedItem) => {
					const emoji = emojiByUnified(suggestedItem().original);

					if (!emoji) {
						return null;
					}

					return (
						<ClickableEmoji
							showVariations={false}
							unified={suggestedItem().unified}
							emojiStyle={emojiStyle}
							emoji={emoji}
							getEmojiUrl={getEmojiUrl}
						/>
					);
				}}
			</Index>
		</EmojiCategory>
	);
}
