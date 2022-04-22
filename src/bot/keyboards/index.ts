import { Markup } from 'telegraf';

const exitKey = Markup.inlineKeyboard([Markup.button.callback('выйти', 'exit')]);

const backAndExitKeyboard = Markup.inlineKeyboard([
  Markup.button.callback('выйти', 'exit'),
  Markup.button.callback('назад', 'back'),
]);

const timeRangeKeyboard = Markup.inlineKeyboard([
  Markup.button.callback('7 дней', '1week'),
  Markup.button.callback('14 дней', '2weeks'),
  Markup.button.callback('28 дней', '4weeks'),
]);

const noAndYesKeyboard = Markup.inlineKeyboard([
  Markup.button.callback('нет', 'exit'),
  Markup.button.callback('Да', 'yes'),
]);

const controlChalKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('выйти', 'exit')],
  [
    Markup.button.callback('сменить название', 'editname'),
    Markup.button.callback('сменить условия', 'editconds'),
  ],
  [
    Markup.button.callback('старт челленджа', 'startchel'),
    Markup.button.callback('удалить челлендж', 'delchel'),
  ],
  [Markup.button.callback('кикнуть участника', 'kickuser')],
]);

export { exitKey, backAndExitKeyboard, timeRangeKeyboard, controlChalKeyboard, noAndYesKeyboard };
