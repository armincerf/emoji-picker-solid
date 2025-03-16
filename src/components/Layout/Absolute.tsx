import type { JSX } from "solid-js/jsx-runtime";

type Props = Readonly<{
	children: JSX.Element;
	className?: string;
	style?: JSX.CSSProperties;
}>;

export default function Absolute({ children, className, style }: Props) {
	return (
		<div style={{ ...style, position: "absolute" }} class={className}>
			{children}
		</div>
	);
}
