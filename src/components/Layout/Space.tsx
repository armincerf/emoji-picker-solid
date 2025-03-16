import type { JSX } from "solid-js/jsx-runtime";

type Props = Readonly<{
	className?: string;
	style?: JSX.CSSProperties;
}>;

export default function Space({ className, style = {} }: Props) {
	return <div style={{ flex: 1, ...style }} class={className} />;
}
