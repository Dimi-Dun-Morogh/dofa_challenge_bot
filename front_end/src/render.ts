import { IChallenge, statsRepObj, userStats } from './types';

class Render {
  initAppEntry() {
    const app = document.createElement('div');
    app.classList.add('App', 'container-md', 'p-0', 'bg-info', 'bg-opacity-10');
    document.body.appendChild(app);
    document.body.classList.add('bg-success', 'bg-opacity-10');
    document.title = 'dofa-bot';
    const content = document.createElement('div');
    content.classList.add('content', 'p-2');
    this.header();
    app.appendChild(content);

    this.footer();
  }
  entryPoint() {
    return document.querySelector('.App');
  }
  mainTable(challenges: IChallenge[]) {
    const tableContent = challenges.reduce((acc, challenge, index) => {
      let prevData = acc;
      const {
        nameOfChallenge,
        durationOfChallenge,
        conditions,
        participants,
        dateOfEnd,
        _id,
      } = challenge;
      prevData += `
      <tr>
      <th scope="row">${index + 1}</th>
      <td><a href='#/id${_id}'>${nameOfChallenge}</a></td>
      <td>${durationOfChallenge}</td>
      <td>${conditions}</td>
      <td>${participants.length}</td>
      <td>${dateOfEnd === 1488 ? 'еще не начат' : new Date(dateOfEnd).toLocaleDateString()}</td>
    </tr>
      `;
      return prevData;
    }, '');
    const table = `
    <table class="table table-hover table-bordered table-success table-striped">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Название</th>
        <th scope="col">Длительность</th>
        <th scope="col">Условия</th>
        <th scope="col">Участников</th>
        <th scope="col">Дата завершения</th>
      </tr>
    </thead>
    <tbody>
      ${tableContent}
    </tbody>
  </table>
    `;
    const element = document.createElement('div');
    element.classList.add('table-responsive');
    element.innerHTML = table;
    return element;
  }
  mainPage(challenges: IChallenge[]) {
    const content = document.querySelector('.content');
    content.innerHTML = '';
    content.appendChild(this.mainTable(challenges));
  }
  idPage(challenge: IChallenge) {
    const content = document.querySelector('.content');
    content.innerHTML = '';
    if (!challenge) return;

    const { nameOfChallenge, durationOfChallenge, conditions, participants, dateOfEnd } = challenge;
    const tableContent = `<tr>
    <td>${nameOfChallenge}</td>
    <td>${durationOfChallenge}</td>
    <td>${conditions}</td>
    <td>${participants.length}</td>
    <td>${dateOfEnd === 1488 ? 'еще не начат' : new Date(dateOfEnd).toLocaleDateString()}</td>
  </tr>
    `;
    const table = `
    <div class='table-responsive'>
    <table class="table table-hover table-bordered table-success table-striped">
    <thead>
      <tr>
        <th scope="col">Название</th>
        <th scope="col">Длительность</th>
        <th scope="col">Условия</th>
        <th scope="col">Участников</th>
        <th scope="col">Дата завершения</th>
      </tr>
    </thead>
    <tbody>
      ${tableContent}
    </tbody>
  </table>
  </div>
    `;
    content.innerHTML = table;
    content.innerHTML+= `<h3 class="text-center">Участники:</h3>`;

    const listOfParticipants = `<div><ul class="list-group list-group-horizontal flex-wrap">
    ${participants.reduce(
      (acc, participant) => (acc += `<li class="list-group-item">${participant.username}</li>`),
      ''
    )}
  </ul>
  </div>
  `;

    content.innerHTML += listOfParticipants;
    content.appendChild(this.allUserProgress(challenge));
  }
  allUserProgress(challenge: IChallenge) {
    const reportsByUser = challenge.reports.reduce((acc, report) => {
      if (acc[report.user_id]) {
        acc[report.user_id].positiveReports += report.reported ? 1 : 0;
      } else {
        acc[report.user_id] = {
          username: report.username,
          positiveReports: report.reported ? 1 : 0,
        };
      }

      return acc;
    }, {} as statsRepObj);

    const container = document.createElement('div');
    container.insertAdjacentHTML('afterbegin', `<h3 class="text-center">Статистика:</h3>`)

    Object.values(reportsByUser)
      .sort((a, b) => b.positiveReports - a.positiveReports)
      .forEach((reportObj) => {
        const element = this.userProgress(+challenge.durationOfChallenge, reportObj);
        container.appendChild(element);
      });
    return container;
  }
  userProgress(chalDur: number, statsRepObj: userStats) {
    const { username, positiveReports } = statsRepObj;
    const element = document.createElement('div');
    element.classList.add('user-progress');
    const positiveWidth = (positiveReports / chalDur) * 100;

    const html = `
    <h6 class="text-center">${username}</h6>
    <div class="progress" style="height:25px">
    <div class="progress-bar bg-info" role="progressbar" style="width: ${positiveWidth}%;" aria-valuenow="${positiveReports}" aria-valuemin="0" aria-valuemax="100">${positiveReports}</div>

    <div class="progress-bar bg-danger" role="progressbar" style="width: ${
      100 - positiveWidth
    }%;" aria-valuenow="${chalDur - positiveReports}" aria-valuemin="0" aria-valuemax="100">${
      chalDur - positiveReports
    }</div>

    </div>
`;
    element.innerHTML = html;
    return element;
  }
  header() {
    const container = document.createElement('div');
    container.classList.add('header-app');
    const pageHeader = document.createElement('h1');
    pageHeader.classList.add('text-center', 'display-3');
    pageHeader.innerHTML = 'Dofa-challenge bot';
    container.appendChild(pageHeader);
    document.querySelector('.App').insertAdjacentElement('afterbegin', container);
  }
  footer() {
    const container = document.createElement('div');
    container.classList.add('footer-app', 'bg-success', 'bg-opacity-30', 'p-2');
    const html = `
    <ul>
    <li><a href="#" class="text-white"><i class="bi bi-house-heart-fill"></i>На главную </a></li>
     <li><a href="https://t.me/dimibro" class="text-white"><i class="bi bi-telegram footer-icon"></i>связаться с разработчиком</a></li>
     <li><a href="https://github.com/Dimi-Dun-Morogh/dofa_challenge_bot" class="text-white"><i class="bi bi-github footer-icon"></i> github </a></li>

    </ul>
    `;
    container.insertAdjacentHTML('afterbegin', html);
    document.querySelector('.App').insertAdjacentElement('beforeend', container);
  }
}

export default new Render();
