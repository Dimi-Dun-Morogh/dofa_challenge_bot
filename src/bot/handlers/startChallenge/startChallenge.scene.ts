import { Scenes } from 'telegraf';
import { previewChalObj } from '../../../types';
import renderMsgs from '../../helpers/renderMsgs';
import { backAndExitKeyboard, exitKey, timeRangeKeyboard } from '../../keyboards';

const { BaseScene, Stage } = Scenes;

// name of challenge
//
const challengeNameScene = new BaseScene<Scenes.SceneContext>('challengeNameScene');

challengeNameScene.enter((ctx) => ctx.reply('Отправьте мне название челленджа', exitKey));

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
  console.log(ctx.scene.state, 'state');
  const { state } = ctx.scene;
  const chal = { ...state, conditions: ctx.message.text };
  console.log(chal);
  return ctx.scene.enter('selectTimeScene', chal);
});

describeChalScene.action('exit', (ctx) => ctx.scene.leave());
describeChalScene.action('back', (ctx) => ctx.scene.enter('challengeNameScene'));

describeChalScene.leave((ctx) => ctx.reply('выход из сцены условий'));

// select time range scene
//
const selectTimeScene = new BaseScene<Scenes.SceneContext>('selectTimeScene');

selectTimeScene.enter((ctx) => ctx.reply('Выберите временной диапозон в течении которого будет длиться челлендж', timeRangeKeyboard));

selectTimeScene.action(['1week', '2weeks', '4weeks'], (ctx) => {
  const { state } = ctx.scene;
  // @ts-ignore
  const chalObj: previewChalObj = { ...state, durationOfChallenge: ctx.callbackQuery.data };

  const previewString = renderMsgs.previewChal(chalObj);
  console.log('here', previewString);

  ctx.reply(previewString);
});

const stage = new Stage<Scenes.SceneContext>([challengeNameScene, describeChalScene,
  selectTimeScene]);

export {
  stage,
};
