import {
  Telegraf, session, Scenes,
} from 'telegraf';

import config from '../config/telegram';
import {
  controlMainScene, renameScene,
  newConditionsScene, deleteChalScene,
} from './handlers/control-сhallenge/control-сhallenge.scene';
import { joinChallengeHandler } from './handlers/join-challenge';
import { challengeNameScene, describeChalScene, selectTimeScene } from './handlers/start-сhallenge/start-сhallenge.scene';

const { Stage } = Scenes;
const stage = new Stage<Scenes.SceneContext>([
  challengeNameScene, describeChalScene, selectTimeScene, controlMainScene, renameScene,
  newConditionsScene, deleteChalScene]);

const bot = new Telegraf<Scenes.SceneContext>(config.botApiKey!);
// middlewares

// bot.use(isReport());

stage.hears('exit', (ctx) => ctx.scene.leave());

bot.use(session());

bot.use(stage.middleware());

bot.command('/challenge_state', (ctx) => ctx.scene.enter('controlMainScene'));

bot.command('/challenge_create', (ctx) => ctx.scene.enter('challengeNameScene'));

bot.command('/join', (ctx) => joinChallengeHandler(ctx));

bot.on('message', async (ctx) => {
  // const admins = await ctx.getChatAdministrators();
  // console.log(admins);
  console.log(ctx.message);
});

export default bot;
