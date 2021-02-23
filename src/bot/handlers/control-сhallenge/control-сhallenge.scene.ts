import { Scenes } from 'telegraf';
import { getCurrentChallenge, updateCurrentChallenge, deleteCurrentChallenge } from '../../../db/challenge_crud';
import challenge from '../../helpers/challenge';
import renderMsgs from '../../helpers/render-msgs';
import { controlChalKeyboard, exitKey, noAndYesKeyboard } from '../../keyboards';

const { BaseScene } = Scenes;

const controlMainScene = new BaseScene<Scenes.SceneContext>('controlMainScene');

controlMainScene.enter(async (ctx) => {
  const chatId = ctx.message?.chat.id;
  const currentChal = await getCurrentChallenge(chatId!);
  if (currentChal) {
    // рендер сообщения с текущим челенджем
    const msg = renderMsgs.controlChal(currentChal);
    ctx.reply(`Здесь можно изменить, удалить, стартануть челледж\n${msg}`, controlChalKeyboard);
  } else {
    ctx.reply('Похоже вы еще не создали челлендж или текущих челленджей нет', exitKey);
  }
});

controlMainScene.leave((ctx) => ctx.reply('выход из состояния челленджа'));

controlMainScene.action(['exit', 'delchel', 'editconds', 'editname', 'startchel'], async (ctx: Scenes.SceneContext) => {
  // @ts-ignore
  const command = ctx.callbackQuery.data;
  const chatId = ctx.chat?.id;

  switch (command) {
    case 'exit':
      return ctx.scene.leave();
    default:
      break;
    case 'editname':
      ctx.scene.enter('renameScene');
      break;
    case 'editconds':
      ctx.scene.enter('newConditionsScene');
      break;
    case 'delchel':
      ctx.scene.enter('deleteChalScene');
      break;
    case 'startchel': {
      const currChal = await getCurrentChallenge(chatId!);
      if (currChal && !currChal.hasStarted) {
        await challenge.startChallenge(currChal);
        ctx.reply('ну че народ ра погнали на');
      } else {
        ctx.reply('ты че тут жмешь куалегла, уже идет челлендж, идет');
      }
    }
  }
});

const renameScene = new BaseScene<Scenes.SceneContext>('renameScene');

renameScene.enter(async (ctx) => {
  ctx.reply('пришлите мне новое название челленджа', exitKey);
});

renameScene.on('text', async (ctx) => {
  const { text } = ctx.message;
  const chatId = ctx.message?.chat!.id;

  await updateCurrentChallenge(chatId!, { nameOfChallenge: text });
  ctx.reply('название обновлено');
  ctx.scene.leave();
  ctx.scene.enter('controlMainScene');
});

const newConditionsScene = new BaseScene<Scenes.SceneContext>('newConditionsScene');

newConditionsScene.enter(async (ctx) => {
  ctx.reply('пришлите мне новые условия челленджа', exitKey);
});

newConditionsScene.on('text', async (ctx) => {
  const { text } = ctx.message;
  const chatId = ctx.message?.chat!.id;

  await updateCurrentChallenge(chatId, { conditions: text });
  ctx.reply('условия обновлены');
  ctx.scene.leave();
  ctx.scene.enter('controlMainScene');
});

const deleteChalScene = new BaseScene<Scenes.SceneContext>('deleteChalScene');

deleteChalScene.enter(async (ctx) => {
  ctx.reply('Уверен что хочешь удалить челлендж?', noAndYesKeyboard);
});

deleteChalScene.action(['exit', 'yes'], async (ctx: Scenes.SceneContext) => {
  // @ts-ignore
  const command = ctx.callbackQuery.data;
  if (command === 'yes') {
    const chatId = ctx.chat?.id;
    const res = await deleteCurrentChallenge(chatId!);
    console.log(res, 'delete', ctx.chat?.id);
    ctx.reply('удаление завершено, другалёк');
    ctx.scene.leave();
  } else {
    ctx.reply('ну нет так нет');
    ctx.scene.leave();
  }
});

export {
  controlMainScene, renameScene,
  newConditionsScene, deleteChalScene,
};
