import type { DataEmoji } from "../../dataUtils/DataTypes";
import { emojiHasVariations, emojiNames } from "../../dataUtils/emojiSelectors";

import type { BaseEmojiProps } from "./BaseEmojiProps";
import { ClickableEmojiButton } from "./ClickableEmojiButton";
import { ViewOnlyEmoji } from "./ViewOnlyEmoji";

type ClickableEmojiProps = Readonly<
	BaseEmojiProps & {
		hidden?: boolean;
		showVariations?: boolean;
		hiddenOnSearch?: boolean;
		emoji: DataEmoji;
		class?: string;
		noBackground?: boolean;
	}
>;

export function ClickableEmoji(props: ClickableEmojiProps) {
	const hasVariations = emojiHasVariations(props.emoji);

	return (
		<ClickableEmojiButton
			hasVariations={hasVariations}
			showVariations={props.showVariations}
			hidden={props.hidden}
			hiddenOnSearch={props.hiddenOnSearch}
			emojiNames={emojiNames(props.emoji)}
			unified={props.unified}
			noBackground={props.noBackground}
		>
			<ViewOnlyEmoji {...props} />
		</ClickableEmojiButton>
	);
}
