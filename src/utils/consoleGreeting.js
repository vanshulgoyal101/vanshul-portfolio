import { CONSOLE_GREETING } from '../constants/wit';

const TITLE_STYLE = 'font: 700 15px/1.6 system-ui, sans-serif; color: #1d4ed8;';

// A hello for visitors who open DevTools. Logged once, from the entry point.
export const greetConsole = (target = globalThis.console) => {
  if (typeof target?.log !== 'function') return;
  target.log(`%c${CONSOLE_GREETING.title}`, TITLE_STYLE);
  target.log(CONSOLE_GREETING.lines.join('\n'));
};
