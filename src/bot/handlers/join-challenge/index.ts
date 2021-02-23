import { Context } from 'telegraf';
import { getCurrentChallenge } from '../../../db/challenge_crud';
import challenge from '../../helpers/challenge';

const joinChallengeHandler = async (ctx: Context) => {
  const chatId = ctx.chat?.id;
  const message_id = ctx.message?.message_id;
  const currentChallenge = await getCurrentChallenge(chatId!);

  if (currentChallenge) {
    const { id, username } = ctx.message!.from!;
    const alreadyIn = challenge.isInChallenge(id!, currentChallenge);

    if (currentChallenge.hasStarted) return ctx.reply('сорян другалёк, челлендж то уже начался', { reply_to_message_id: message_id });

    if (alreadyIn) return ctx.reply('ты шо глэк? ты уже в челендже', { reply_to_message_id: message_id });

    await challenge.joinChallenge({ id, username: `@${username}` }, currentChallenge);
    ctx.reply('ок теперь ты в челлендже', { reply_to_message_id: message_id });
  }
};

export {
  joinChallengeHandler,
};
