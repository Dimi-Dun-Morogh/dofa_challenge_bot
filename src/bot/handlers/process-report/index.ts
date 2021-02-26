import { Context } from 'telegraf';
import { getCurrentChallenge } from '../../../db/challenge_crud';
import challenge from '../../helpers/challenge';

const handleReport = async (ctx: Context) => {
  // @ts-ignore
  const { text, caption, message_id } = ctx.message;
  const msg: string | undefined = text || caption;

  if (msg && (msg?.includes('#отчет') || msg?.includes('#отчёт'))) {
    const isChallenge = await getCurrentChallenge(ctx.chat?.id!);
    const reportObj = {
      date: Number(new Date()),
      username: ctx.message?.from.username,
      message_id,
      user_id: ctx.from?.id!,
    };

    if (!isChallenge) return ctx.reply('слыш челленджа нет', { reply_to_message_id: message_id });
    const res = await challenge.addReport(isChallenge, reportObj);

    return ctx.reply(res!, { reply_to_message_id: message_id });
  }
};

export {
  handleReport,
};
