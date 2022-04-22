import { Context } from 'telegraf';
import { getCurrentChallenge } from '../../../db/challenge_crud';
import challenge from '../../helpers/challenge';

const LeaveChallengeHandler = async (ctx: Context) => {
  const chatId = ctx.chat?.id;
  const message_id = ctx.message?.message_id;
  const currentChallenge = await getCurrentChallenge(chatId!);

  if (currentChallenge) {
    const { id } = ctx.message!.from!;
    const alreadyIn = challenge.isInChallenge(id!, currentChallenge);

    if (!alreadyIn)
      return ctx.reply('ты шо глэк? ты ещё не в челендже', { reply_to_message_id: message_id });

    await challenge.leaveChallenge(id, currentChallenge);

    ctx.reply('ок теперь ты не в челлендже', { reply_to_message_id: message_id });
  } else {
    ctx.reply('ща поход челенджа нет', { reply_to_message_id: message_id });
  }
};

export { LeaveChallengeHandler };
