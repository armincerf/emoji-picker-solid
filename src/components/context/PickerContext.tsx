import { createContext, useContext, createSignal, type JSX } from "solid-js";

import {
	useDefaultSkinToneConfig,
	useReactionsOpenConfig,
} from "../../config/useConfig";
import type { DataEmoji } from "../../dataUtils/DataTypes";
import { alphaNumericEmojiIndex } from "../../dataUtils/alphaNumericEmojiIndex";
import { useDebouncedState } from "../../hooks/useDebouncedState";
import type { FilterDict } from "../../hooks/useFilter";
import { useMarkInitialLoad } from "../../hooks/useInitialLoad";
import { SkinTones } from "../../types/exposedTypes";

type Props = Readonly<{
	children: JSX.Element;
}>;

export type FilterState = Record<string, FilterDict>;
type ActiveCategoryState = null | string;

// Define the context shape
const PickerContext = createContext({
	searchTerm: ["", async () => ""] as [
		string,
		(term: string) => Promise<string>,
	],
	suggestedUpdateState: [Date.now(), () => {}] as [
		number,
		(term: number) => void,
	],
	activeCategoryState: [null, () => {}] as [
		ActiveCategoryState,
		(state: ActiveCategoryState) => void,
	],
	activeSkinTone: [SkinTones.NEUTRAL, () => {}] as [
		SkinTones,
		(tone: SkinTones) => void,
	],
	emojisThatFailedToLoadState: [new Set<string>(), () => {}] as [
		Set<string>,
		(set: Set<string>) => void,
	],
	isPastInitialLoad: true,
	emojiVariationPickerState: [null, () => {}] as [
		DataEmoji | null,
		(emoji: DataEmoji | null) => void,
	],
	skinToneFanOpenState: [false, () => {}] as [boolean, (open: boolean) => void],
	filterRef: { current: {} as FilterState },
	disallowClickRef: { current: false },
	disallowMouseRef: { current: false },
	reactionsModeState: [false, () => {}] as [boolean, (mode: boolean) => void],
});

export function PickerContextProvider(props: Props) {
	const defaultSkinTone = useDefaultSkinToneConfig();
	const reactionsDefaultOpen = useReactionsOpenConfig();

	// Initialize refs
	const filterRef = { current: alphaNumericEmojiIndex as FilterState };
	const disallowClickRef = { current: false };
	const disallowMouseRef = { current: false };

	// Create signals
	const suggestedUpdateState = useDebouncedState(Date.now(), 200);
	const searchTerm = useDebouncedState("", 100);
	const [skinToneFanOpen, setSkinToneFanOpen] = createSignal(false);
	const [activeSkinTone, setActiveSkinTone] =
		createSignal<SkinTones>(defaultSkinTone);
	const [activeCategory, setActiveCategory] =
		createSignal<ActiveCategoryState>(null);
	const [emojisThatFailedToLoad, setEmojisThatFailedToLoad] = createSignal<
		Set<string>
	>(new Set());
	const [emojiVariationPicker, setEmojiVariationPicker] =
		createSignal<DataEmoji | null>(null);
	const [reactionsMode, setReactionsMode] = createSignal(reactionsDefaultOpen);
	const [isPastInitialLoad, setIsPastInitialLoad] = createSignal(false);

	useMarkInitialLoad(setIsPastInitialLoad);

	return (
		<PickerContext.Provider
			value={{
				activeCategoryState: [activeCategory(), setActiveCategory],
				activeSkinTone: [activeSkinTone(), setActiveSkinTone],
				disallowClickRef,
				disallowMouseRef,
				emojiVariationPickerState: [
					emojiVariationPicker(),
					setEmojiVariationPicker,
				],
				emojisThatFailedToLoadState: [
					emojisThatFailedToLoad(),
					setEmojisThatFailedToLoad,
				],
				filterRef,
				isPastInitialLoad: isPastInitialLoad(),
				searchTerm,
				skinToneFanOpenState: [skinToneFanOpen(), setSkinToneFanOpen],
				suggestedUpdateState,
				reactionsModeState: [reactionsMode(), setReactionsMode],
			}}
		>
			{props.children}
		</PickerContext.Provider>
	);
}

// Helper hooks to access context values
export function useFilterRef() {
	const context = useContext(PickerContext);
	if (!context)
		throw new Error("useFilterRef must be used within a PickerContextProvider");
	return context.filterRef;
}

export function useDisallowClickRef() {
	const context = useContext(PickerContext);
	if (!context)
		throw new Error(
			"useDisallowClickRef must be used within a PickerContextProvider",
		);
	return context.disallowClickRef;
}

export function useDisallowMouseRef() {
	const context = useContext(PickerContext);
	if (!context)
		throw new Error(
			"useDisallowMouseRef must be used within a PickerContextProvider",
		);
	return context.disallowMouseRef;
}

export function useReactionsModeState(): [
	boolean,
	(mode: boolean) => void,
] {
	const context = useContext(PickerContext);
	if (!context)
		throw new Error(
			"useReactionsModeState must be used within a PickerContextProvider",
		);
	return context.reactionsModeState;
}

export function useSearchTermState() {
	const context = useContext(PickerContext);
	if (!context)
		throw new Error(
			"useSearchTermState must be used within a PickerContextProvider",
		);
	return context.searchTerm;
}

export function useActiveSkinToneState(): [
	SkinTones,
	(skinTone: SkinTones) => void,
] {
	const context = useContext(PickerContext);
	if (!context)
		throw new Error(
			"useActiveSkinToneState must be used within a PickerContextProvider",
		);
	return context.activeSkinTone;
}

export function useEmojisThatFailedToLoadState() {
	const context = useContext(PickerContext);
	if (!context)
		throw new Error(
			"useEmojisThatFailedToLoadState must be used within a PickerContextProvider",
		);
	return context.emojisThatFailedToLoadState;
}

export function useIsPastInitialLoad(): boolean {
	const context = useContext(PickerContext);
	if (!context)
		throw new Error(
			"useIsPastInitialLoad must be used within a PickerContextProvider",
		);
	return context.isPastInitialLoad;
}

export function useEmojiVariationPickerState() {
	const context = useContext(PickerContext);
	if (!context)
		throw new Error(
			"useEmojiVariationPickerState must be used within a PickerContextProvider",
		);
	return context.emojiVariationPickerState;
}

export function useSkinToneFanOpenState() {
	const context = useContext(PickerContext);
	if (!context)
		throw new Error(
			"useSkinToneFanOpenState must be used within a PickerContextProvider",
		);
	return context.skinToneFanOpenState;
}

export function useUpdateSuggested(): [number, () => void] {
	const context = useContext(PickerContext);
	if (!context)
		throw new Error(
			"useUpdateSuggested must be used within a PickerContextProvider",
		);

	const [suggestedUpdated, setSuggestedUpdate] = context.suggestedUpdateState;
	return [
		suggestedUpdated,
		function updateSuggested() {
			setSuggestedUpdate(Date.now());
		},
	];
}
