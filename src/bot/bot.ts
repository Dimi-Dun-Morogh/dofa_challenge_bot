import {
  Telegraf, session, Scenes,
} from 'telegraf';

import config from '../config/telegram';
import {
  controlMainScene, renameScene,
  newConditionsScene, deleteChalScene,
} from './handlers/control-сhallenge/control-сhallenge.scene';
import { joinChallengeHandler } from './handlers/join-challenge';
import { handleReport } from './handlers/process-report';

import { challengeNameScene, describeChalScene, selectTimeScene } from './handlers/start-сhallenge/start-сhallenge.scene';
import { isAdmin, isPrivateChat } from './middlewares';

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
bot.use(isPrivateChat());

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

bot.command('/join', (ctx) => joinChallengeHandler(ctx));

// bot.on('text', (ctx) => {
//   console.log(ctx.message);
//   console.log(ctx.message.text);
// });

bot.on('message', (ctx) => {
  handleReport(ctx);
});

// bot.hears(['#отчёт', '#отчет'], (ctx) => ctx.reply('[fq'));

export default bot;
