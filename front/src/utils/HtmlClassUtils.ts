import {RefObject} from 'react';
import scssExport from 'styles/exports.module.scss';

// TODO: refactor / extract common logic

export const removeClass = (htmlElement: RefObject<HTMLElement>, className: string | string[]): void => {
  if (Array.isArray(className)) {
    className.forEach(_class => removeClass(htmlElement, _class));
  } else {
    const elem = htmlElement.current;
    if (elem && elem.classList.contains(className)) {
      // tLog('Removing Class', className);
      elem.classList.remove(className);
    }
  }
};

export const addClass = (htmlElement: RefObject<HTMLElement>, className: string | string[]): void => {
  if (Array.isArray(className)) {
    className.forEach(_class => addClass(htmlElement, _class));
  } else {
    const elem = htmlElement.current;
    if (elem && !elem.classList.contains(className)) {
      // tLog('Adding Class', className);
      elem.classList.add(className);
    }
  }
};

/**
 * Converts pixels to rem using **`$base-font-size`** specified in **`styles/partials/_variables.scss`**
 * @param px
 */
export const pxToRem = (px: number) => px / parseFloat(scssExport.baseFontSize) + 'rem';
