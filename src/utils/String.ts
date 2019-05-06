export const snakeToTitle = (str: string) => str.split('_')
  .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase()).join(' ');
