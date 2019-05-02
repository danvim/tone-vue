export const gamePopperOptions = {
  placement: 'top',
  modifiers: {
    flip: {
      behavior: ['left', 'top', 'bottom', 'right'],
    },
    preventOverflow: {
      boundariesElement: 'viewport',
    },
  },
};
