import { Context } from 'telegraf';
import logger from '../../helpers/logger';

const NAMESPACE = 'BOT-MIDDLEWARE';

const isReport = () => (ctx: any, next:any) => {
  try {
    if (!ctx.message) return null;

    const { text, caption } = ctx.message;

    if (!text && !caption) return null;

    const msg = text || caption;
    const allowed: { [key:string]: boolean } = {
      '#отчет': true,
      '#отчёт': true,
      '/start': true,
      '/info': true,
      exit: true,
    };
    const [command]:[string] = msg.split(' ');

    if (allowed[command]) return next();
  } catch (error) {
    logger.error(NAMESPACE, error.mesage, error);
  }
};

const isAdmin = async (ctx: Context) => {
  try {
    const userId = ctx.message?.from.id;
    const admins = await ctx.getChatAdministrators();
    const Admin = admins.some((user) => user.user.id === userId);
    console.log(ctx);

    logger.info(NAMESPACE, `${userId} is admin - ${Admin}`);
    return Admin;
  } catch (error) {
    logger.error(NAMESPACE, 'error isAdmin', error);
  }
};

export {
  isReport,
  isAdmin,
};
