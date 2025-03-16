import { cx } from "flairup";
import { type JSX, splitProps } from "solid-js";

import { stylesheet } from "../../Stylesheet/stylesheet";

// Define the Props type using Solid.js's JSX namespace
type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
	class?: string;
};

export function Button(props: ButtonProps) {
	// Use splitProps to separate children and className from other props
	const [local, others] = splitProps(props, ["children", "class"]);

	return (
		<button
			type="button"
			{...others}
			class={cx(styles.button, local.class)}
		>
			{local.children}
		</button>
	);
}

const styles = stylesheet.create({
	button: {
		".": "epr-btn",
		cursor: "pointer",
		border: "0",
		background: "none",
		outline: "none",
	},
});
