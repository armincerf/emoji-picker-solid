import { createEffect } from 'solid-js';

import { categoryNameFromDom } from '../DomUtils/categoryNameFromDom';
import { asSelectors, ClassNames } from '../DomUtils/classNames';
import { useBodyRef } from '../components/context/ElementRefContext';

export function useActiveCategoryScrollDetection(
  setActiveCategory: (category: string) => void
) {
  const BodyRef = useBodyRef();

  createEffect(() => {
    const visibleCategories = new Map();
    const bodyRef = BodyRef.current;
    const observer = new IntersectionObserver(
      entries => {
        if (!bodyRef) {
          return;
        }

        for (const entry of entries) {
          const id = categoryNameFromDom(entry.target);
          visibleCategories.set(id, entry.intersectionRatio);
        }

        const ratios = Array.from(visibleCategories);
        const lastCategory = ratios[ratios.length - 1];

        if (lastCategory[1] === 1) {
          return setActiveCategory(lastCategory[0]);
        }

        for (const [id, ratio] of ratios) {
          if (ratio) {
            setActiveCategory(id);
            break;
          }
        }
      },
      {
        threshold: [0, 1]
      }
    );
    
    if (bodyRef) {
      const elements = Array.from(bodyRef.querySelectorAll(asSelectors(ClassNames.category)));
      for (const el of elements) {
        observer.observe(el);
      }
    }

    // Cleanup function
    return () => {
      observer.disconnect();
    };
  });
}
