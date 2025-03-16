import { cx } from "flairup";
import type { JSX } from "solid-js";

import { ClassNames } from "../../DomUtils/classNames";
import {
	commonInteractionStyles,
	commonStyles,
	stylesheet,
} from "../../Stylesheet/stylesheet";
import { Button } from "../atoms/Button";

type ClickableEmojiButtonProps = Readonly<{
	hidden?: boolean;
	showVariations?: boolean;
	hiddenOnSearch?: boolean;
	emojiNames: string[];
	children: JSX.Element;
	hasVariations: boolean;
	unified?: string;
	noBackground?: boolean;
	className?: string;
}>;

export function ClickableEmojiButton(props: ClickableEmojiButtonProps) {
	// Access props directly without destructuring
	return (
		<Button
			class={cx(
				styles.emoji,
				props.hidden && commonStyles.hidden,
				props.hiddenOnSearch && commonInteractionStyles.hiddenOnSearch,
				{
					[ClassNames.visible]: !props.hidden && !props.hiddenOnSearch,
				},
				!!(props.hasVariations && (props.showVariations ?? true)) &&
					styles.hasVariations,
				props.noBackground && styles.noBackground,
				props.className,
			)}
			data-unified={props.unified}
			aria-label={getAriaLabel(props.emojiNames)}
			data-full-name={props.emojiNames}
		>
			{props.children}
		</Button>
	);
}

function getAriaLabel(emojiNames: string[]) {
	return emojiNames[0].match("flag-")
		? (emojiNames[1] ?? emojiNames[0])
		: emojiNames[0];
}

const styles = stylesheet.create({
	emoji: {
		".": ClassNames.emoji,
		position: "relative",
		width: "var(--epr-emoji-fullsize)",
		height: "var(--epr-emoji-fullsize)",
		boxSizing: "border-box",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		maxWidth: "var(--epr-emoji-fullsize)",
		maxHeight: "var(--epr-emoji-fullsize)",
		borderRadius: "8px",
		overflow: "hidden",
		transition: "background-color 0.2s",
		":hover": {
			backgroundColor: "var(--epr-emoji-hover-color)",
		},
		":focus": {
			backgroundColor: "var(--epr-focus-bg-color)",
		},
	},
	noBackground: {
		background: "none",
		":hover": {
			backgroundColor: "transparent",
			background: "none",
		},
		":focus": {
			backgroundColor: "transparent",
			background: "none",
		},
	},
	hasVariations: {
		".": ClassNames.emojiHasVariations,
		":after": {
			content: "",
			display: "block",
			width: "0",
			height: "0",
			right: "0px",
			bottom: "1px",
			position: "absolute",
			borderLeft: "4px solid transparent",
			borderRight: "4px solid transparent",
			transform: "rotate(135deg)",
			borderBottom: "4px solid var(--epr-emoji-variation-indicator-color)",
			zIndex: "var(--epr-emoji-variations-indictator-z-index)",
		},
		":hover:after": {
			borderBottom:
				"4px solid var(--epr-emoji-variation-indicator-color-hover)",
		},
	},
});
