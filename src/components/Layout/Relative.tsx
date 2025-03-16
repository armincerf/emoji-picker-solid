import type { JSX } from "solid-js/jsx-runtime";

type Props = Readonly<{
	children: JSX.Element;
	class?: string;
	style?: JSX.CSSProperties;
}>;

export default function Relative({ children, class: className, style }: Props) {
  return (
		<div style={{ ...style, position: "relative" }} class={className}>
			{children}
		</div>
	);
}
