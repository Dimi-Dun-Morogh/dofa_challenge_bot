import { Context } from 'telegraf';
import { getCurrentChallenge } from '../../../db/challenge_crud';
import challenge from '../../helpers/challenge';

const handleReport = async (ctx: Context) => {
  // @ts-ignore
  const { text, caption, message_id, from } = ctx.message;
  const { username, first_name, last_name } = from;

  const msg: string | undefined = text || caption;

  if (msg && (msg?.includes('#отчет') || msg?.includes('#отчёт'))) {
    const isChallenge = await getCurrentChallenge(ctx.chat?.id!);
    const defineUsername = username ? `@${username}` : `${first_name} ${last_name || ''}`;
    const reportObj = {
      date: Number(new Date()),
      username: defineUsername,
      message_id,
      user_id: ctx.from?.id!,
      reported: true,
    };

    if (!isChallenge || !isChallenge.hasStarted) {
      return ctx.reply('слыш челленджа нет или одмен его не стартанул', {
        reply_to_message_id: message_id,
      });
    }
    if (!isChallenge.participants.some((user) => user.id === ctx.from?.id!)) {
      return ctx.reply('слыш ты вобще не в челлендже', { reply_to_message_id: message_id });
    }
    const res = await challenge.addReport(isChallenge, reportObj);

    return ctx.reply(res!, { reply_to_message_id: message_id });
  }
};

export { handleReport };
