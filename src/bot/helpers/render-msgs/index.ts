import { INewChallenge, previewChalObj } from '../../../types';
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
      dateOfEnd, dateOfStart, hasStarted, isCompleted, participants,
    } = chalObj;
    let participantsStr = '';
    if (participants?.length) {
      participants.forEach(({ username }) => participantsStr += `${username}, `);
    }
    return `Текущий челлендж:
    название: ${nameOfChallenge}
    условия: ${conditions}
    длительность: ${durationOfChallenge} дней
    дата начала: ${new Date(dateOfStart).toLocaleString()}
    дата конца: ${new Date(dateOfEnd).toLocaleString()}
    Челлендж начался?: ${hasStarted ? 'да' : 'нет'}
    Участники: [${participantsStr}]
    `;
  },
};

export default renderMsgs;
