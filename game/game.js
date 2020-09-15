class GameManager{
    playerName = "Sauron";
    count = 0;
    entities = [];
    levels = [];
    player = null;   //указатель на объект игрока
    spriteManager = null;
    eventManager = null;
    physicManager = null;
    soundsManager = null;
    dataParsed = false;
    currentLevel = 0;
    startTime = new Date();

    canvas = null;
    ctx = null;

    constructor(canvas,  levelPaths, spritePath, spritesheetPath, playerName) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.playerName = playerName;

        for(let i = 0; i<levelPaths.length; i++)
        {
            this.levels.push(levelPaths[i]);
        }

        this.spriteManager = new SpriteManager(spritePath, spritesheetPath, this);
        this.eventManager = new EventsManager(this);
        this.mapManager = new MapManager(this.levels[0], canvas, this);
        this.physicManager = new PhysicManager(this);
        this.soundsManager = new SoundsManager(this);
        this.mapManager.draw(this.ctx);
        this.mapManager.parseEntities();
        this.drawEntities();
    }


    entityFactory(type, name, x, y)
    {
        let resultEntity = null;
        switch(type)
        {
            case "Player":
                resultEntity = new Player(5, type, name, x, y, this);
                break;
            case "Coin":
                resultEntity = new Coin(type, name, x, y, this);
                break;
            case "Enemy":
                resultEntity = new Enemy(1, type, name, x, y, this);
                break;
            case "Finish":
                resultEntity = new Finish(type, name, x, y, this);
                break;
            case "Spikes":
                resultEntity = new Spikes(type, name, x, y, this);
                break;
            default:
                resultEntity = new Entity(type, name, x, y, this);
        }
        return resultEntity;
    }

    initPlayer(obj)
{
    this.player = obj;
}
play() {
    let self = this;
    let tryStart = setInterval(
        function()
        {
            if(self.mapManager.jsonLoaded &&
                self.mapManager.imgLoaded &&
                self.spriteManager.jsonLoaded &&
                self.spriteManager.imgLoaded)
            {
                self.playInterval = setInterval(function()
                {
                    self.update();

                },10);
                clearInterval(tryStart);
            }
        }, 100);
}

update()
{
    if(this.player === null)
    {
        console.log("player wasn't loaded");
        return;
    }

    var date = new Date();
    document.getElementById("date").innerHTML =(Math.floor((date - this.startTime)/100)/10).toString();

    if (localStorage.getItem(this.playerName) == null || parseInt(localStorage.getItem(this.playerName)) < this.count) {
        localStorage.setItem(this.playerName, this.count.toString());
    }

    document.getElementById("status").innerHTML = this.count;

    this.player.move_x = 0;
    this.player.move_y = 0;

    if(this.eventManager.action["up"] && this.player.on_ground)
    {
        this.player.move_y = 1;
        this.player.jumpSpeed = 10;
        this.player.on_ground = false;
        this.soundsManager.jump();
    }

    if(this.eventManager.action["left"] &&
        !this.physicManager.checkMoveLeft(this.player, this.player.pos_x, this.player.pos_y) &&
        (this.player.pos_x > 10)) {
        this.player.move_x = -1;
        this.player.step = (this.player.step + 1) % 2;
        this.player.pos_x -= this.player.speed;

    }

    if(this.eventManager.action["right"] &&
        !this.physicManager.checkMoveRight(this.player, this.player.pos_x, this.player.pos_y, "map")){
        this.player.move_x = 1;
        this.player.step = (this.player.step + 1) % 2;
        this.player.pos_x += this.player.speed;

    }

    this.player.update();

    var sprite = this.spriteManager.getSprite("Player");
    var spriteCoin = this.spriteManager.getSprite("Coin");
    var spriteFinish = this.spriteManager.getSprite("Finish");
    var spriteEnemy = this.spriteManager.getSprite("Enemy");
    var spriteSpikes = this.spriteManager.getSprite("Spikes");
    for (let i = 0; i< this.entities.length; ++i) {
        if (this.entities[i].update) {
            this.entities[i].update();
            if (this.entities[i].type == "Coin") {
                if ((Math.abs((this.player.pos_x + sprite.w / 2) - (this.entities[i].pos_x + spriteCoin.w / 2)) <= sprite.w / 2) &&
                    (Math.abs((this.player.pos_y + sprite.h / 2) - (this.entities[i].pos_y + spriteCoin.h / 2)) <= sprite.h / 2)) {
                    this.count += this.entities[i].coins;
                    this.entities.splice(i, 1);
                    i -= 1;
                }
            } else if (this.entities[i].type == "Finish") {

                if ((Math.abs(this.player.pos_x - this.entities[i].pos_x) <= 1) &&
                    (Math.abs((this.player.pos_y + sprite.h / 2) - (this.entities[i].pos_y + spriteFinish.h / 2)) <= sprite.h / 2)) {
                    this.count += 15;
                    this.goNextLevel();
                }
            } else if (this.entities[i].type == "Spikes") {
                if ((Math.abs((this.player.pos_x + sprite.w ) - (this.entities[i].pos_x + spriteSpikes.w )) <= spriteSpikes.w) &&
                    (Math.abs((this.player.pos_y + sprite.h) - (this.entities[i].pos_y + spriteSpikes.h )) < spriteSpikes.h )) {
                    this.soundsManager.stop();
                    document.getElementById("global_status").innerHTML = "GameOver";
                    this.player.isAlive = false;
                    this.count = 0;
                    clearInterval(this.playInterval);
                    this.playInterval = null;
                    this.mapManager.draw(this.ctx);
                    this.drawEntities();
                }
            } else if (this.entities[i].type == "Enemy") {
                if ((Math.abs((this.player.pos_x + sprite.w / 2) - (this.entities[i].pos_x + spriteEnemy.w / 2)) <= spriteEnemy.w / 2) &&
                    (Math.abs(Math.abs((this.player.pos_y + sprite.h / 2) - (this.entities[i].pos_y + spriteEnemy.h / 2)) - sprite.h)) <= 10) {
                    this.count += this.entities[i].coins;
                    this.entities.splice(i, 1);
                    i -= 1;
                } else {
                    if ((Math.abs((this.player.pos_x + sprite.w / 2) - (this.entities[i].pos_x + spriteEnemy.w / 2)) <= spriteEnemy.w / 2) &&
                        (Math.abs((this.player.pos_y + sprite.h / 2) - (this.entities[i].pos_y + spriteCoin.h / 2)) <= sprite.h / 2)) {
                        this.soundsManager.stop();
                        document.getElementById("global_status").innerHTML = "Game Over";
                        this.player.isAlive = false;
                        clearInterval(this.playInterval);
                        this.playInterval = null;
                        this.mapManager.draw(this.ctx);
                        this.drawEntities();
                    }
                }
            }
        }
    }

    if(this.player.isAlive) {
        this.mapManager.draw(this.ctx);
        this.drawEntities();
    }
}
    goNextLevel() {
        if (this.currentLevel < (this.levels.length - 1)) {
            this.dataParsed = false;
            clearInterval(this.playInterval);
            this.playInterval = null;
            document.getElementById("global_status").innerHTML = "Level: " + (this.currentLevel + 2);
            this.entities = [];
            this.currentLevel += 1;
            this.mapManager = new MapManager(this.levels[this.currentLevel], canvas, this);
            this.mapManager.draw(this.ctx);
            this.mapManager.parseEntities();
            this.drawEntities();
            this.play();
        } else {
            clearInterval(this.playInterval);
            this.playInterval = null;
            this.drawEntities();
            this.mapManager.draw(this.ctx);

            document.getElementById("global_status").innerHTML = "You Win!";
            this.soundsManager.stop();
        }
    }
    drawEntities()
    {
        let gameManager = this;
        if(!this.dataParsed)
        {
            setTimeout(function(){gameManager.drawEntities();},100);
        }
        else {
            for (let entityNum = 0; entityNum < this.entities.length; entityNum++) {
                if (gameManager.entities[entityNum].draw){
                    gameManager.entities[entityNum].draw();
                }
            }
        }
    }
}