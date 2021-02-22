import { Markup } from 'telegraf';

const exitKey = Markup.inlineKeyboard([Markup.button.callback('выйти', 'exit')]);
const backAndExitKeyboard = Markup.inlineKeyboard([Markup.button.callback('выйти', 'exit'), Markup.button.callback('назад', 'back')]);
const timeRangeKeyboard = Markup.inlineKeyboard([Markup.button.callback('7 дней', '1week'), Markup.button.callback('14 дней', '2weeks'), Markup.button.callback('28 дней', '4weeks')]);

export {
  exitKey, backAndExitKeyboard, timeRangeKeyboard,
};
