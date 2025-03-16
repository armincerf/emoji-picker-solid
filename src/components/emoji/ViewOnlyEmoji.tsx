import type { JSX } from "solid-js/jsx-runtime";
import { emojiByUnified, emojiName } from "../../dataUtils/emojiSelectors";
import { isCustomEmoji } from "../../typeRefinements/typeRefinements";
import { EmojiStyle } from "../../types/exposedTypes";
import { useEmojisThatFailedToLoadState } from "../context/PickerContext";

import type { BaseEmojiProps } from "./BaseEmojiProps";
import { EmojiImg } from "./EmojiImg";
import { NativeEmoji } from "./NativeEmoji";

export function ViewOnlyEmoji(props: BaseEmojiProps) {
	const [, setEmojisThatFailedToLoad] = useEmojisThatFailedToLoadState();

	const style = {} as JSX.CSSProperties;
	if (props.size) {
		style.width = style.height = style["font-size"] = `${props.size}px`;
	}

	const emojiToRender = props.emoji
		? props.emoji
		: emojiByUnified(props.unified);

	if (!emojiToRender) {
		return null;
	}

	if (isCustomEmoji(emojiToRender)) {
		return (
			<EmojiImg
				style={style}
				emojiName={props.unified}
				emojiStyle={EmojiStyle.NATIVE}
				lazyLoad={props.lazyLoad ?? false}
				imgUrl={emojiToRender.imgUrl}
				onError={onError}
				class={props.class}
			/>
		);
	}

	return (
		<>
			{props.emojiStyle === EmojiStyle.NATIVE ? (
				<NativeEmoji
					unified={props.unified}
					style={style}
					class={props.class}
				/>
			) : (
				<EmojiImg
					style={style}
					emojiName={emojiName(emojiToRender)}
					emojiStyle={props.emojiStyle}
					lazyLoad={props.lazyLoad ?? false}
					imgUrl={props.getEmojiUrl?.(props.unified, props.emojiStyle) ?? ""}
					onError={onError}
					class={props.class}
				/>
			)}
		</>
	);

	function onError() {
		//@ts-ignore
		setEmojisThatFailedToLoad((prev) => new Set(prev).add(props.unified));
	}
}
