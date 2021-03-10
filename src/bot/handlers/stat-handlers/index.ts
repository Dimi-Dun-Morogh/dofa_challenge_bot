import { Context } from 'telegraf';
import { getCurrentChallenge } from '../../../db/challenge_crud';
import challenge from '../../helpers/challenge';

const myStatHandler = async (ctx:Context) => {
  const chatId = ctx.chat?.id;
  const { message_id: replyId, from: { username } } = ctx.message!;
  const challengeDoc = await getCurrentChallenge(chatId!);

  if (!challengeDoc || !challengeDoc.hasStarted) return ctx.reply('челленджа еще нет или не начался', { reply_to_message_id: replyId });

  const msg = challenge.userStats(challengeDoc, `@${username!}`);
  ctx.reply(msg, { reply_to_message_id: replyId });
};

const allStatHandler = async (ctx: Context) => {
  const chatId = ctx.chat?.id;
  const replyId = ctx.message?.message_id;
  const challengeDoc = await getCurrentChallenge(chatId!);

  if (!challengeDoc || !challengeDoc.hasStarted) return ctx.reply('челленджа еще нет или не начался', { reply_to_message_id: replyId });

  const statMsg = challenge.endChallenge(challengeDoc, true);
  if (statMsg) ctx.reply(statMsg, { reply_to_message_id: replyId });
};

export {
  myStatHandler,
  allStatHandler,
};
