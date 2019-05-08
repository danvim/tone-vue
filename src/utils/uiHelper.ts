import {FRAME_SAVE_DELAY} from '@/configs/Display';

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

export const frame = (() => {
  let fnArray: Array<(payload: {messages: any[]}) => void> = [];
  const messages: Array<{[k in string]: any}> = [];

  const updateAll = () => {
    // Calls all actions
    fnArray.forEach((action, i) => {
      action({messages: Object.keys(messages[i]).map((key) => messages[i][key])});
      messages[i] = {};
    });
    requestAnimationFrame(updateAll);
  };

  updateAll();

  return {
    setFnArray: (a: Array<(payload: {messages: any[]}) => void>) => {
      fnArray = a;
      messages.splice(0);
      a.forEach(() => messages.push({}));
    },
    update: (action: (payload: {messages: any[]}) => void, uidKey: string, message: any) => {
      if (!fnArray.includes(action)) {
        // Adds new action
        fnArray.push(action);
        messages.push({});
      }
      const i = fnArray.indexOf(action);
      const t = messages[i];
      t[message[uidKey]] = message;
    },
  };
})();

export const hash = (str: string) => {
  let h = 5381;
  let i = str.length;

  while (i) {
    // tslint:disable-next-line:no-bitwise
    h = (h * 33) ^ str.charCodeAt(--i);
  }

  // tslint:disable-next-line:no-bitwise
  return h >>> 0;
};
