import { Scenes } from 'telegraf';
import { previewChalObj } from '../../../types';
import { getCurrentChallenge } from '../../../db/challenge_crud';
import challenge from '../../helpers/challenge';
import renderMsgs from '../../helpers/render-msgs';
import { backAndExitKeyboard, exitKey, timeRangeKeyboard } from '../../keyboards';

const { BaseScene } = Scenes;

// name of challenge
//
const challengeNameScene = new BaseScene<Scenes.SceneContext>('challengeNameScene');

challengeNameScene.enter(async (ctx) => {
  const chatId = ctx.chat?.id;
  const currentChal = await getCurrentChallenge(chatId!);
  console.log(currentChal, 'nameScene currenCHal');
  if (currentChal) {
    ctx.scene.leave();
    return ctx.reply('А у тебя уже есть один незаконченный челлендж, ебош\n  комманду challenge_state');
  }
  ctx.reply('Отправьте мне название челленджа', exitKey);
});

challengeNameScene.on('text', (ctx) => {
  ctx.reply('название принято');
  return ctx.scene.enter('describeChalScene', { nameOfChallenge: ctx.message.text }); //* chain, 2nd param - state
});

challengeNameScene.action('exit', (ctx) => ctx.scene.leave());

// challengeNameScene.leave((ctx) => ctx.reply('выход из сцены названия'));

// describe challenge scene
//
const describeChalScene = new BaseScene<Scenes.SceneContext>('describeChalScene');

describeChalScene.enter((ctx) => ctx.reply('Опишите условия челленджа', backAndExitKeyboard));

describeChalScene.on('text', (ctx) => {
  ctx.reply('условия приняты');
  const chatId = ctx.message?.chat!.id;

  const { state } = ctx.scene;
  const chal = { ...state, conditions: ctx.message.text, chat_id: chatId };
  console.log(chal, state);
  return ctx.scene.enter('selectTimeScene', chal);
});

describeChalScene.action('exit', (ctx) => ctx.scene.leave());
describeChalScene.action('back', (ctx) => ctx.scene.enter('challengeNameScene'));

describeChalScene.leave((ctx) => ctx.reply('выход из сцены условий'));

// select time range scene
//
const selectTimeScene = new BaseScene<Scenes.SceneContext>('selectTimeScene');

selectTimeScene.enter((ctx) => ctx.reply('Выберите временной диапозон в течении которого будет длиться челлендж', timeRangeKeyboard));

selectTimeScene.action(['1week', '2weeks', '4weeks'], (ctx: Scenes.SceneContext) => {
  const dictionary = {
    '1week': '7',
    '2weeks': '14',
    '4weeks': '28',
  } as { [key: string]: string };

  const { state } = ctx.scene;
  // @ts-ignore
  const chalObj: previewChalObj = {
    ...state,
    // @ts-ignore
    durationOfChallenge: dictionary[ctx.callbackQuery.data],
  };

  const previewString = renderMsgs.previewChal(chalObj);

  ctx.reply(previewString);
  challenge.createChallenge(chalObj);
});

export {
  challengeNameScene, describeChalScene,
  selectTimeScene,
};
