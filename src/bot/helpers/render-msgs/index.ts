import {
  dailyStatObj, IendObj, INewChallenge, previewChalObj,
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
  finalMsg(chalObj: INewChallenge, stats: IendObj) {
    const statsRendered = Object.entries(stats).reduce((acc, [day, stat]) => {
      let res = acc;
      const userStat = Object.entries(stat!).reduce((acc, [userName, bool]) => acc += `${userName} - ${bool ? emojis.green_ok : emojis.red_cross},  `, '');

      res += `${day.split(',')[0]} [ ${userStat} ]\n`;
      return res;
    }, '');
    return `Челлендж ${chalObj.nameOfChallenge} окончен.
${statsRendered}`;
  },
};

export default renderMsgs;
