interface previewChalObj {
  nameOfChallenge: string,
  conditions: string,
  durationOfChallenge: string | number,
  chat_id: number
}

interface participant {
  id: number
  username: string
  user_conditions?: string
}

type dailyStatObj = {
  [key:string]: boolean
};

interface Ireport {
  date: number
  username: string | undefined
  message_id: number
  user_id: number
  reported: boolean
}

interface IChallenge extends previewChalObj{
  _id: string
  dateOfStart: number
  dateOfEnd: number
  isCompleted: boolean
  hasStarted: boolean
  chat_id: number
  reports?: Array<Ireport>
  participants: Array<participant>
}


export {
  IChallenge
}