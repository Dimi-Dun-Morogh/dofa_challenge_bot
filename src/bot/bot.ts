import { Telegraf, session, Scenes } from 'telegraf';

import config from '../config/telegram';
import {
  controlMainScene,
  renameScene,
  newConditionsScene,
  deleteChalScene,
  kickUserScene,
  challengeNameScene,
  describeChalScene,
  selectTimeScene,
  joinChallengeHandler,
  LeaveChallengeHandler,
  handleReport,
  UserConditionsHandler,
  allStatHandler,
  myStatHandler,
  helpHandler,
} from './handlers';

import { isAdmin } from './middlewares';

const { Stage } = Scenes;
const stage = new Stage<Scenes.SceneContext>([
  challengeNameScene,
  describeChalScene,
  selectTimeScene,
  controlMainScene,
  renameScene,
  newConditionsScene,
  deleteChalScene,
  kickUserScene,
]);

const bot = new Telegraf<Scenes.SceneContext>(config.botApiKey!);
// middlewares

// bot.use(isReport());

stage.hears('exit', (ctx) => ctx.scene.leave());

(() => {
  try {
    bot.use(session());

    bot.use(stage.middleware());
    // bot.use(isPrivateChat());

    bot.command('/challenge_state', async (ctx) => {
      const admin = await isAdmin(ctx);
      if (!admin) return ctx.reply('куда лезешь, это для админов');
      ctx.scene.enter('controlMainScene');
    });

    bot.command('/challenge_create', async (ctx) => {
      const admin = await isAdmin(ctx);
      if (!admin) return ctx.reply('куда лезешь, это для админов');
      ctx.scene.enter('challengeNameScene');
    });

    bot.command(['/help', '/start'], (ctx) => helpHandler(ctx));

    bot.command('/join', (ctx) => joinChallengeHandler(ctx));
    bot.command('/leave', (ctx) => LeaveChallengeHandler(ctx));
    bot.command('/conditions', (ctx) => UserConditionsHandler(ctx));

    bot.command('/my_stats', (ctx) => myStatHandler(ctx));
    bot.command('/all_stats', async (ctx) => {
      const admin = await isAdmin(ctx);
      if (!admin) return ctx.reply('куда лезешь, это для админов');
      allStatHandler(ctx);
    });

    bot.on('message', (ctx) => {
      handleReport(ctx);
    });
  } catch (error) {
    console.error(error);
  }
})();

export default bot;
