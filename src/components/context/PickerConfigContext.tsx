import {
	createContext,
	useContext,
	createSignal,
	createEffect,
	type JSX,
} from "solid-js";

import { compareConfig } from "../../config/compareConfig";
import {
	basePickerConfig,
	mergeConfig,
	type PickerConfig,
	type PickerConfigInternal,
} from "../../config/config";

type Props = PickerConfig &
	Readonly<{
		children: JSX.Element;
	}>;

const ConfigContext = createContext<PickerConfigInternal>(basePickerConfig());

export function PickerConfigProvider(props: Props) {
	const { children, ...config } = props;
	const mergedConfig = useSetConfig(config);

	return (
		<ConfigContext.Provider value={mergedConfig}>
			{children}
		</ConfigContext.Provider>
	);
}

export function useSetConfig(config: PickerConfig) {
	const [mergedConfig, setMergedConfig] = createSignal(mergeConfig(config));

	createEffect(() => {
		// Check if any of the config properties have changed
		if (compareConfig(mergedConfig(), config)) {
			return;
		}
		setMergedConfig(mergeConfig(config));
	});

	// We need to create dependencies for all the config properties
	// This is similar to the dependency array in React's useEffect
	createEffect(() => {
		// Access all the properties to create reactive dependencies
		config.customEmojis?.length;
		config.open;
		config.emojiVersion;
		config.reactionsDefaultOpen;
		config.searchPlaceHolder;
		config.searchPlaceholder;
		config.defaultSkinTone;
		config.skinTonesDisabled;
		config.autoFocusSearch;
		config.emojiStyle;
		config.theme;
		config.suggestedEmojisMode;
		config.lazyLoadEmojis;
		config.className;
		config.height;
		config.width;
		config.searchDisabled;
		config.skinTonePickerLocation;
		config.allowExpandReactions;
	});

	return mergedConfig();
}

export function usePickerConfig() {
	const context = useContext(ConfigContext);

	if (!context) {
		throw new Error("usePickerConfig: cannot find a ConfigContext");
	}

	return context;
}
