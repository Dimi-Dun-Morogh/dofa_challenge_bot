import {
  dailyStatObj, IFinalObj, INewChallenge, previewChalObj,
} from '../../../types';
import emojis from './emojis';

const renderMsgs = {

  previewChal(prevChalObj: previewChalObj):string {
    const { conditions, nameOfChallenge, durationOfChallenge } = prevChalObj;
    const { saintsRow, pin } = emojis;
    return `${saintsRow}Челлендж создан${saintsRow}.\nДанные:\nНазвание челленджа: ${nameOfChallenge}\nусловия челленджа:\n${conditions}\n\nдлительность челленджа:\n${durationOfChallenge} дней\n ${pin}управлять состоянием челленджа${pin} - /challenge_state`;
  },

  controlChal(chalObj: INewChallenge):string {
    const {
      conditions, nameOfChallenge, durationOfChallenge,
      dateOfEnd, dateOfStart, hasStarted, participants,
    } = chalObj;
    let participantsStr = '';
    if (participants?.length) {
      participants.forEach(({ username }) => participantsStr += `${username}, `);
    }
    return `Текущий челлендж:
    название: ${nameOfChallenge}
    условия: ${conditions}
    длительность: ${durationOfChallenge} дней
    дата начала: ${new Date(dateOfStart).toLocaleString('en-GB', { hour12: false })}
    дата конца: ${new Date(dateOfEnd).toLocaleString('en-GB', { hour12: false })}
    Челлендж начался?: ${hasStarted ? 'да' : 'нет'}
    Участники: [${participantsStr}]
    `;
  },
  dailyMsg(stats: dailyStatObj) {
    const statStr = Object.entries(stats).reduce((acc, [key, value]) => acc += `${key} : ${value ? emojis.green_ok : emojis.red_cross}\n`, '');
    return `Отчет по челленджу за сегодня ${new Date().toLocaleString('en-GB', { hour12: false })}
${statStr}
    `;
  },
  layziesDailyMsg(stats: dailyStatObj) {
    const statStr = Object.entries(stats).reduce((acc, [key, value]) => acc += `${key} : ${value ? emojis.green_ok : emojis.red_cross}\n`, '');
    return `Сегодня ещё не отметились:
${statStr}
после 22:00 отчеты не принимаются!
    `;
  },
  finalMsg(chalObj: INewChallenge, stats: IFinalObj, isNotEnd?: boolean | undefined) {
    const statsRendered = Object.entries(stats).reduce((acc, [name, stat]) => {
      let res = acc;
      const statStr = stat.reduce((accM, dayRes) => accM += `${dayRes ? emojis.green_ok : emojis.red_cross}`, '');
      res += `${name} : [${statStr}]\n\n`;
      return res;
    }, '');
    return `Челлендж ${chalObj.nameOfChallenge} ${isNotEnd ? 'предварительные резы' : 'окончен'}.
${statsRendered}`;
  },
  messageSplitter(messageString: string) {
    const max_size = 4096;

    const amount_sliced = messageString.length / max_size;
    let start = 0;
    let end = max_size;
    let message;
    const messages:Array<string> = [];
    for (let i = 0; i < amount_sliced; i += 1) {
      message = messageString.slice(start, end);
      messages.push(message);
      start += max_size;
      end += max_size;
    }
    return messages;
  },
};

export default renderMsgs;
