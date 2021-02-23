import {
  Telegraf, session, Scenes,
} from 'telegraf';

import config from '../config/telegram';
import {
  controlMainScene, renameScene,
  newConditionsScene, deleteChalScene,
} from './handlers/controlChallenge/controlChallenge.scene';
import { challengeNameScene, describeChalScene, selectTimeScene } from './handlers/startChallenge/startChallenge.scene';

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

bot.on('message', async (ctx) => {
  const admins = await ctx.getChatAdministrators();
  // console.log(admins);
  console.log(ctx.message);
});

export default bot;
