import { type Styles, createSheet } from 'flairup';


import { ClassNames } from '../DomUtils/classNames';

export const stylesheet = createSheet('epr', null);

const hidden = {
  display: 'none',
  opacity: '0',
  pointerEvents: 'none',
  visibility: 'hidden',
  overflow: 'hidden'
};

export const commonStyles = stylesheet.create({
  hidden: {
    '.': ClassNames.hidden,
    ...hidden
  }
});

export function PickerStyleTag() {
  return (
    <style innerHTML={stylesheet.getStyle()} />
  );
}

export const commonInteractionStyles = stylesheet.create({
  '.epr-main': {
    ':has(input:not(:placeholder-shown))': {
      categoryBtn: {
        ':hover': {
          opacity: '1',
          backgroundPositionY: 'var(--epr-category-navigation-button-size)'
        }
      },
      hiddenOnSearch: {
        '.': ClassNames.hiddenOnSearch,
        ...hidden
      }
    },
    ':has(input(:placeholder-shown))': {
      visibleOnSearchOnly: hidden
    }
  },
  hiddenOnReactions: {
    transition: 'all 0.5s ease-in-out'
  },
  '.epr-reactions': {
    hiddenOnReactions: {
      height: '0px',
      width: '0px',
      opacity: '0',
      pointerEvents: 'none',
      overflow: 'hidden'
    }
  },
  '.EmojiPickerReact:not(.epr-search-active)': {
    categoryBtn: {
      ':hover': {
        opacity: '1',
        backgroundPositionY: 'var(--epr-category-navigation-button-size)'
      },
      '&.epr-active': {
        opacity: '1',
        backgroundPositionY: 'var(--epr-category-navigation-button-size)'
      }
    },
    visibleOnSearchOnly: {
      '.': 'epr-visible-on-search-only',
      ...hidden
    }
  }
});

type DarkModeStyles = {
  [selector: string]: {
    [key: string]: Styles | {
      '@media (prefers-color-scheme: dark)': Styles
    }
  }
};

export function darkMode(key: string, value: Styles): DarkModeStyles {
  return {
    '.epr-dark-theme': {
      [key]: value
    },
    '.epr-auto-theme': {
      [key]: {
        '@media (prefers-color-scheme: dark)': value
      }
    }
  };
}
