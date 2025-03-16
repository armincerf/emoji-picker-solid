import { cx } from "flairup";
import { splitProps } from "solid-js";
import { stylesheet } from "../../Stylesheet/stylesheet";
import type { JSX } from "solid-js/jsx-runtime";

export enum FlexDirection {
	ROW = "FlexRow",
	COLUMN = "FlexColumn",
}

type Props = Readonly<{
	children: JSX.Element;
	class?: string;
	style?: JSX.CSSProperties;
	direction?: FlexDirection;
}>;

export default function Flex(props: Props): JSX.Element {
	const [local, others] = splitProps(props, [
		"children",
		"class",
		"style",
		"direction",
	]);
	return (
		<div
			{...others}
			class={cx(styles.flex, local.class, styles[local.direction ?? ""])}
		>
			{local.children}
		</div>
	);
}

const styles = stylesheet.create({
	flex: {
		display: "flex",
	},
	[FlexDirection.ROW]: {
		flexDirection: "row",
	},
	[FlexDirection.COLUMN]: {
		flexDirection: "column",
	},
});
