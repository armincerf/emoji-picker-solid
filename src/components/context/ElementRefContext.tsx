import {
	createContext,
	useContext,
	type JSX,
	children as solidChildren,
} from "solid-js";
import { focusElement } from "../../DomUtils/focusElement";
import type { NullableElement } from "../../DomUtils/selectors";

export type ElementRef<E extends HTMLElement = HTMLElement> = {
	current: E | null;
};

type ElementRefs = {
	PickerMainRef: ElementRef;
	AnchoredEmojiRef: ElementRef;
	SkinTonePickerRef: ElementRef<HTMLDivElement>;
	SearchInputRef: ElementRef<HTMLInputElement>;
	BodyRef: ElementRef<HTMLDivElement>;
	CategoryNavigationRef: ElementRef<HTMLDivElement>;
	VariationPickerRef: ElementRef<HTMLDivElement>;
	ReactionsRef: ElementRef<HTMLUListElement>;
};

// Create context with default values
const ElementRefContext = createContext<ElementRefs>({
	AnchoredEmojiRef: { current: null },
	BodyRef: { current: null },
	CategoryNavigationRef: { current: null },
	PickerMainRef: { current: null },
	SearchInputRef: { current: null },
	SkinTonePickerRef: { current: null },
	VariationPickerRef: { current: null },
	ReactionsRef: { current: null },
});

export function ElementRefContextProvider(props: { children: JSX.Element }) {
	// Create refs
	const PickerMainRef: ElementRef = { current: null };
	const AnchoredEmojiRef: ElementRef = { current: null };
	const BodyRef: ElementRef<HTMLDivElement> = { current: null };
	const SearchInputRef: ElementRef<HTMLInputElement> = { current: null };
	const SkinTonePickerRef: ElementRef<HTMLDivElement> = { current: null };
	const CategoryNavigationRef: ElementRef<HTMLDivElement> = { current: null };
	const VariationPickerRef: ElementRef<HTMLDivElement> = { current: null };
	const ReactionsRef: ElementRef<HTMLUListElement> = { current: null };

	const resolved = solidChildren(() => props.children);

	return (
		<ElementRefContext.Provider
			value={{
				AnchoredEmojiRef,
				BodyRef,
				CategoryNavigationRef,
				PickerMainRef,
				SearchInputRef,
				SkinTonePickerRef,
				VariationPickerRef,
				ReactionsRef,
			}}
		>
			{resolved()}
		</ElementRefContext.Provider>
	);
}

// Helper function to use the context
function useElementRef() {
	return useContext(ElementRefContext);
}

export function usePickerMainRef() {
	return useElementRef().PickerMainRef;
}

export function useAnchoredEmojiRef() {
	return useElementRef().AnchoredEmojiRef;
}

export function useSetAnchoredEmojiRef(): (target: NullableElement) => void {
	const AnchoredEmojiRef = useAnchoredEmojiRef();
	return (target: NullableElement) => {
		if (target === null && AnchoredEmojiRef.current !== null) {
			focusElement(AnchoredEmojiRef.current);
		}

		AnchoredEmojiRef.current = target;
	};
}

export function useBodyRef() {
	return useElementRef().BodyRef;
}

export function useReactionsRef() {
	return useElementRef().ReactionsRef;
}

export function useSearchInputRef() {
	return useElementRef().SearchInputRef;
}

export function useSkinTonePickerRef() {
	return useElementRef().SkinTonePickerRef;
}

export function useCategoryNavigationRef() {
	return useElementRef().CategoryNavigationRef;
}

export function useVariationPickerRef() {
	return useElementRef().VariationPickerRef;
}
