import { Context } from 'telegraf';
import { getCurrentChallenge } from '../../../db/challenge_crud';
import challenge from '../../helpers/challenge';

const UserConditionsHandler = async (ctx: Context) => {
  const chatId = ctx.chat?.id;
  const message_id = ctx.message?.message_id;
  const currentChallenge = await getCurrentChallenge(chatId!);

  if (currentChallenge) {
    const { id } = ctx.message!.from!;

    if (currentChallenge.hasStarted)
      return ctx.reply('сорян другалёк, челлендж то уже начался', {
        reply_to_message_id: message_id,
      });
    // @ts-ignore
    const { text } = ctx.message!;
    const conditions = text.split(' ').slice(1).join(' ');

    const alreadyIn = challenge.isInChallenge(id!, currentChallenge);
    if (!alreadyIn)
      return ctx.reply('сначала присоеденись к челленджу', { reply_to_message_id: message_id });

    await challenge.setUserConditions(currentChallenge, id, conditions);
    ctx.reply('ок персональные условия добавлены', { reply_to_message_id: message_id });
  } else {
    ctx.reply('ща поход челенджа нет', { reply_to_message_id: message_id });
  }
};

export { UserConditionsHandler };
