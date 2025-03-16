import { cx } from "flairup";
import { createEffect, For, Show } from "solid-js";

import { ClassNames } from "../../DomUtils/classNames";
import { focusFirstVisibleEmoji } from "../../DomUtils/keyboardNavigation";
import {
	buttonFromTarget,
	elementHeight,
	emojiTrueOffsetTop,
	emojiTruOffsetLeft,
} from "../../DomUtils/selectors";
import { darkMode, stylesheet } from "../../Stylesheet/stylesheet";
import {
	useEmojiStyleConfig,
	useGetEmojiUrlConfig,
} from "../../config/useConfig";
import {
	emojiHasVariations,
	emojiUnified,
	emojiVariations,
} from "../../dataUtils/emojiSelectors";
import {
	type ElementRef,
	useAnchoredEmojiRef,
	useBodyRef,
	useSetAnchoredEmojiRef,
	useVariationPickerRef,
} from "../context/ElementRefContext";
import { useEmojiVariationPickerState } from "../context/PickerContext";
import { ClickableEmoji } from "../emoji/Emoji";

import SVGTriangle from "./svg/triangle.svg";
import type { DataEmoji } from "../../dataUtils/DataTypes";

enum Direction {
	Up = 0,
	Down = 1,
}

export function EmojiVariationPicker() {
	const AnchoredEmojiRef = useAnchoredEmojiRef();
	const VariationPickerRef = useVariationPickerRef();
	const [emoji] = useEmojiVariationPickerState();
	const emojiStyle = useEmojiStyleConfig();

	const { getTop, getMenuDirection } =
		useVariationPickerTop(VariationPickerRef);
	const setAnchoredEmojiRef = useSetAnchoredEmojiRef();
	const getPointerStyle = usePointerStyle(VariationPickerRef);
	const getEmojiUrl = useGetEmojiUrlConfig();

	// Computed values
	const visible = () => {
		const button = buttonFromTarget(AnchoredEmojiRef.current);
		return Boolean(
			emoji &&
				button &&
				emojiHasVariations(emoji) &&
				button.classList.contains(ClassNames.emojiHasVariations),
		);
	};

	const top = () => (visible() ? getTop() : undefined);
	const pointerStyle = () => (visible() ? getPointerStyle() : undefined);

	// Get variations array
	const getVariations = () => {
		if (!visible() || !emoji) return [];

		return [emojiUnified(emoji)].concat(emojiVariations(emoji)).slice(0, 6);
	};

	// Effect to focus first emoji when visible
	createEffect(() => {
		if (!visible()) {
			return;
		}

		focusFirstVisibleEmoji(VariationPickerRef.current);
	});

	// Effect to clear anchored emoji ref when not visible
	createEffect(() => {
		if (!visible() && AnchoredEmojiRef.current) {
			setAnchoredEmojiRef(null);
		}
	});

	return (
		<div
			ref={(el) => (VariationPickerRef.current = el)}
			class={cx(
				styles.variationPicker,
				getMenuDirection() === Direction.Down && styles.pointingUp,
				visible() && styles.visible,
			)}
			// @ts-ignore
			style={{ top: top() }}
		>
			<For each={getVariations()}>
				{(unified) => (
					<Show when={emoji}>
						<ClickableEmoji
							emoji={emoji as DataEmoji}
							unified={unified}
							emojiStyle={emojiStyle}
							showVariations={false}
							getEmojiUrl={getEmojiUrl}
						/>
					</Show>
				)}
			</For>
			<div class={cx(styles.pointer)} style={pointerStyle()} />
		</div>
	);
}

function usePointerStyle(VariationPickerRef: ElementRef) {
	const AnchoredEmojiRef = useAnchoredEmojiRef();

	return function getPointerStyle() {
		const style = {};
		if (!VariationPickerRef.current) {
			return style;
		}

		if (AnchoredEmojiRef.current) {
			const button = buttonFromTarget(AnchoredEmojiRef.current);

			if (!button) {
				return style;
			}

			const offsetLeft = emojiTruOffsetLeft(button);

			// half of the button
			// @ts-ignore
			style.left = offsetLeft + button.clientWidth / 2;
		}

		return style;
	};
}

function useVariationPickerTop(VariationPickerRef: ElementRef) {
	const AnchoredEmojiRef = useAnchoredEmojiRef();
	const BodyRef = useBodyRef();
	let direction = Direction.Up;

	return {
		getMenuDirection,
		getTop,
	};

	function getMenuDirection() {
		return direction;
	}

	function getTop() {
		direction = Direction.Up;
		let emojiOffsetTop = 0;

		if (!VariationPickerRef.current) {
			return 0;
		}

		const height = elementHeight(VariationPickerRef.current);

		if (AnchoredEmojiRef.current) {
			const bodyRef = BodyRef.current;
			const button = buttonFromTarget(AnchoredEmojiRef.current);

			if (!button) {
				return 0;
			}

			const buttonHeight = elementHeight(button);

			emojiOffsetTop = emojiTrueOffsetTop(button);

			const scrollTop = bodyRef?.scrollTop ?? 0;

			if (scrollTop > emojiOffsetTop - height) {
				direction = Direction.Down;
				emojiOffsetTop += buttonHeight + height;
			}
		}

		return emojiOffsetTop - height;
	}
}

const styles = stylesheet.create({
	variationPicker: {
		".": ClassNames.variationPicker,
		position: "absolute",
		right: "15px",
		left: "15px",
		padding: "5px",
		boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
		borderRadius: "3px",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-around",
		opacity: "0",
		visibility: "hidden",
		pointerEvents: "none",
		top: "-100%",
		border: "1px solid var(--epr-picker-border-color)",
		height: "var(--epr-emoji-variation-picker-height)",
		zIndex: "var(--epr-skin-variation-picker-z-index)",
		background: "var(--epr-emoji-variation-picker-bg-color)",
		transform: "scale(0.9)",
		transition: "transform 0.1s ease-out, opacity 0.2s ease-out",
	},
	visible: {
		opacity: "1",
		visibility: "visible",
		pointerEvents: "all",
		transform: "scale(1)",
	},
	pointingUp: {
		".": "pointing-up",
		transformOrigin: "center 0%",
		transform: "scale(0.9)",
	},
	".pointing-up": {
		pointer: {
			top: "0",
			transform: "rotate(180deg) translateY(100%) translateX(18px)",
		},
	},
	pointer: {
		".": "epr-emoji-pointer",
		content: "",
		position: "absolute",
		width: "25px",
		height: "15px",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "0 0",
		backgroundSize: "50px 15px",
		top: "100%",
		transform: "translateX(-18px)",
		backgroundImage: `url(${SVGTriangle})`,
	},
	...darkMode("pointer", {
		backgroundPosition: "-25px 0",
	}),
});
