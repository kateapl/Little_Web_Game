class EventsManager{
    bind = [];  //сопостовление клавиш действиям
    action = []; //действия
    gameManager = null;
    constructor(gameManager)
    {
        this.gameManager = gameManager;
        this.bind[87]='up';
        this.bind[65]='left';
        this.bind[68]='right';
// контроль событий клавиатуры
        let eventsManager = this;
        document.body.addEventListener("keydown", function(event) {
            eventsManager.onKeyDown(event);
        });
        document.body.addEventListener("keyup", function(event){
            eventsManager.onKeyUp(event);
    });
}
//При нажатии кнопки
    onKeyDown(event) {
        let eventsManager = this;
        var action = eventsManager.bind[event.keyCode];
        if (action)
        eventsManager.action[action] = true; // выполняем действие
    }
//При отпуске кнопки
    onKeyUp(event) {
        let eventsManager = this;
        var action = eventsManager.bind[event.keyCode];
        if (action)
            eventsManager.action[action] = false; //отменили действие
    }
}