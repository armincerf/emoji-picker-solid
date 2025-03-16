import { cx } from "flairup";
import { stylesheet } from "../../Stylesheet/stylesheet";

import { emojiStyles } from "./emojiStyles";
import type { JSX } from "solid-js/jsx-runtime";
import type { EmojiStyle } from "../../types/exposedTypes";
type EmojiImgProps = {
	imgUrl: string;
	lazyLoad: boolean;
	emojiName: string;
	onError: () => void;
	style: JSX.CSSProperties;
	class?: string;
	emojiStyle: EmojiStyle;
};

export function EmojiImg(props: EmojiImgProps) {
	return (
		<img
			src={props.imgUrl}
			alt={props.emojiName}
			class={cx(
				styles.emojiImag,
				emojiStyles.external,
				emojiStyles.common,
				props.class,
			)}
			loading={props.lazyLoad ? "lazy" : "eager"}
			onError={props.onError}
			style={props.style}
		/>
	);
}

const styles = stylesheet.create({
	emojiImag: {
		".": "epr-emoji-img",
		maxWidth: "var(--epr-emoji-fullsize)",
		maxHeight: "var(--epr-emoji-fullsize)",
		minWidth: "var(--epr-emoji-fullsize)",
		minHeight: "var(--epr-emoji-fullsize)",
		padding: "var(--epr-emoji-padding)",
	},
});
