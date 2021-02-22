import {
  Telegraf, session, Scenes,
} from 'telegraf';

import config from '../config/telegram';
import {
  stage,
} from './handlers/startChallenge/startChallenge.scene';

const bot = new Telegraf<Scenes.SceneContext>(config.botApiKey!);
// middlewares
// const Stage = Scenes.Stage
// bot.use(isReport());

stage.hears('exit', (ctx) => ctx.scene.leave());

bot.use(session());
bot.use(stage.middleware());

bot.command('/challenge_state', (ctx) => ctx.reply('challenge state'));

bot.command('/challenge_start', (ctx) => ctx.scene.enter('challengeNameScene'));

bot.on('message', async (ctx) => {
  const admins = await ctx.getChatAdministrators();
  // console.log(admins);
  console.log(ctx.message);
});

export default bot;
