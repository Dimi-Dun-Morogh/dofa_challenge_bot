#dofa-challenge-bot
>телеграм бот для проведения челендж марафонов в чатах. Доступны промежутки в 7-14-28 дней. Пользователь с правами админа создает челлендж, участники присоеденяются к челленджу коммандой /join. Админ начинает челлендж. После старта челленджа участники делают отчет тегом #отчет или #отчёт. Бот запишет отчет в статистику. Каждый день в 23:00 по мск бот будет отсылать статистику за текущий день. Отчеты можно кидать до 23:00. В день окончания челленджа в 23:10 бот пришлет статистику за весь челлендж.

/challenge_create - создать заготовку под челлендж <br>
/challenge_state - управлять челленджем <br>
/join -  присоединиться к челленджу <br>
/my_stats - мои статы по челленджу на текущее время <br>
/all_stats - статы для всех по челленджу на текущее время  <br>

#### создание заготовки под челлендж
![Alt text](images/challengeCreate1.JPG?raw=true "challengeCreate")
![Alt text](images/challengeCreate2.JPG?raw=true "challengeCreate2")
#### управление состоянием челленджа
![Alt text](images/challengeState.JPG?raw=true "challengeState")
#### присоединиться к челленджу
![Alt text](images/joinChallenge.JPG?raw=true "challengeEnd")
![Alt text](images/joinChallenge2.JPG?raw=true "challengeEnd")
#### отчет за день
![Alt text](images/reportToday.JPG?raw=true "reportToday")
#### конец челленджа отчет
![Alt text](images/challengeEnd.JPG?raw=true "challengeEnd")

#### предварительные результаты отчет /my_stats
![Alt text](images/challengePreviRes.JPG?raw=true "challengePreviRes")
#### todo:

- [x] сделать нового бота, настроить взаимодействие со скриптом, создать и подключиться к бд (20.02.2021) ✅
- [x] придумать монго схему под челленж\ежедневный отчет\etc (21.02.2021) ✅
- [x] создать комманды для старта челленджа, присоеденения к челенджу (24.02.2021) ✅
- [x] реализовать логику подсчета отчетов, сбора отчетов, вывода ежедневной статистики (27.02.2021) ✅
- [x] cоздать  сцену под первоначальное формирование челленджа (22.02.2021) ✅
- [x] создать сцену под управление состоянием текущего челленджа (23.02.2021) ✅
- [x] создать необходимые круд методы (22.02.2021) ✅

- [ ] переделать массив с отчетами под  реф
- [ ] написать нормальный мидлвар под админские команды
- [x] сделать новый читабельный рендер сообщения с конечными результатами для всех и предварительными для всех (30.03.2021) ✅
- [x] сделать комманды для предварительной статистики по челленджу для всех участников и 1 участника(10.03.2021) ✅


