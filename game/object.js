class Entity {
    pos_x = 0; pos_y = 0; // позиция объекта
    name = '';
    type = '';
    gameManager = null;
    constructor(type, name, pos_x, pos_y, gameManager)
    {
        this.gameManager = gameManager;
        this.type = type;
        this.name = name;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
    }
}
class Player extends Entity {
    lifetime = 0;
    move_x = 1;
    on_ground = true;
    speed = 1.3;
    jumpSpeed = 0;
    step = 0;
    isAlive = true;
    constructor(lifetime, type, name, pos_x, pos_y, gameManager)
    {
        super(type, name, pos_x, pos_y, gameManager);
        this.lifetime = lifetime;
    }

    draw() {   //функция для отображения
        if(this.move_x >= 0)
        {
            this.currentSpriteType = this.type;
            if (this.step === 1) {
                this.currentSpriteType += 'Run1';
            }
        }

        if(this.move_x < 0)
        {
            this.currentSpriteType = this.type;
            if (this.step === 1) {
                this.currentSpriteType += 'Run1';
            }
            this.currentSpriteType += 'Left';
        }

        if(!this.on_ground)
        {
            this.currentSpriteType = this.type;
            this.currentSpriteType += 'Jump';
        }

        if(!this.isAlive)
        {
            this.currentSpriteType = this.type;
            this.currentSpriteType += 'Run1';
        }

        this.gameManager.spriteManager.drawSprite(this.currentSpriteType, this.pos_x, this.pos_y);
    }

    update() { //функция для изменения состояния на каждом шаге
        this.gameManager.physicManager.update(this);
    }
}

class Spikes extends Entity{
    on_ground = false;
    speed = 1;

    constructor(type, name, pos_x, pos_y, gameManager)
    {
        super(type, name, pos_x, pos_y, gameManager);
    }

    draw() {
        this.gameManager.spriteManager.drawSprite(this.type, this.pos_x, this.pos_y);
    }

    update() {
        this.gameManager.physicManager.update(this);
    }
}
class Coin extends Entity{
    coins = 5;
    constructor(type, name, pos_x, pos_y, gameManager)
    {
        super(type, name, pos_x, pos_y, gameManager);
    }

    draw() {
        this.gameManager.spriteManager.drawSprite(this.type, this.pos_x, this.pos_y);
    }

    update() {

    }
}
class Enemy extends Entity {
    lifetime = 0;
    move_x = 0;
    move_y = 0;
    on_ground = false;
    speed = 1;
    right = false;
    speed_x = -1;
    jumpSpeed = 0;
    coins = 10;
    step = 0;
    step_count = 100;

    constructor(lifetime, type, name, pos_x, pos_y, gameManager)
    {
        super(type, name, pos_x, pos_y, gameManager);
        this.lifetime = lifetime;
    }

    draw() {
           if (this.right===true) {
                this.currentSpriteType = 'EnemyRight';
            }
       else  if (this.right===false) this.currentSpriteType = this.type;

        this.gameManager.spriteManager.drawSprite(this.currentSpriteType, this.pos_x, this.pos_y);
    }

    update() {
        this.gameManager.physicManager.update(this);
    }
}
class Finish extends Entity{
    coins = 5;

    constructor(type, name, pos_x, pos_y, gameManager)
    {
        super(type, name, pos_x, pos_y, gameManager);
    }

    draw() {
        this.gameManager.spriteManager.drawSprite(this.type, this.pos_x, this.pos_y);
    }

    update() {

    }
}