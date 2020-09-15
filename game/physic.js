class PhysicManager
{
    gameManager = null;

    constructor(gameManager)
    {
        this.gameManager = gameManager;
    }

    update(obj)
    {
        if (obj.type == "Player") {
            if (!this.checkMoveUp(obj, obj.pos_x, obj.pos_y) && ((obj.pos_y - obj.jumpSpeed) > 5)) {
                obj.pos_y -= obj.jumpSpeed;
            }
            if (obj.jumpSpeed > 0) {
                obj.jumpSpeed -= 0.50;
            }
        }

        if (!this.checkMoveDown(obj, obj.pos_x, obj.pos_y)) {
            obj.pos_y += 1;
        } else {
            obj.jumpSpeed = 0;
            obj.on_ground = true;
        }

        if (obj.type == "Enemy") {
            if (obj.on_ground) {
                obj.pos_x += obj.speed_x;
                obj.step = (obj.step + 1) % obj.step_count;
                if (obj.step === 0) {
                    obj.speed_x = -1 * obj.speed_x;
                    obj.right = !obj.right;
                }
            }
        }
    }

    checkMoveLeft(obj, x, y)
    {
        var sprite = this.gameManager.spriteManager.getSprite("Player");
        let tileset_up = this.gameManager.mapManager.getTilesetIdx(x - obj.speed, y);
        let tileset_middle = this.gameManager.mapManager.getTilesetIdx(x - obj.speed, y + sprite.h/2);
        let tileset_down = this.gameManager.mapManager.getTilesetIdx(x - obj.speed, y + sprite.h);
        return !this.gameManager.mapManager.getTile(tileset_up).img.src.includes("map") ||
            !this.gameManager.mapManager.getTile(tileset_middle).img.src.includes("map") ||
            !this.gameManager.mapManager.getTile(tileset_down).img.src.includes("map");
    }


    checkMoveRight(obj, x, y, name)
    {
        var sprite = this.gameManager.spriteManager.getSprite("Player");
        let tileset_up = this.gameManager.mapManager.getTilesetIdx(x + sprite.w + obj.speed, y);
        let tileset_middle = this.gameManager.mapManager.getTilesetIdx(x + sprite.w + obj.speed, y + sprite.h/2);
        let tileset_down = this.gameManager.mapManager.getTilesetIdx(x + sprite.w + obj.speed, y + sprite.h);
        return !this.gameManager.mapManager.getTile(tileset_up).img.src.includes(name) ||
            !this.gameManager.mapManager.getTile(tileset_middle).img.src.includes(name) ||
            !this.gameManager.mapManager.getTile(tileset_down).img.src.includes(name);
    }

    checkMoveDown(obj, x, y)
    {
        var sprite = this.gameManager.spriteManager.getSprite(obj.type);
        let tileset_middle = this.gameManager.mapManager.getTilesetIdx(x + sprite.w/2, y + (obj.speed) + sprite.h);
        let tileset_left = this.gameManager.mapManager.getTilesetIdx(x , y + (obj.speed) + sprite.h);
        let tileset_right = this.gameManager.mapManager.getTilesetIdx(x + sprite.w, y + (obj.speed) + sprite.h);
        return !this.gameManager.mapManager.getTile(tileset_right).img.src.includes("map") ||
            !this.gameManager.mapManager.getTile(tileset_middle).img.src.includes("map") ||
            !this.gameManager.mapManager.getTile(tileset_left).img.src.includes("map")
    }

    checkMoveUp(obj, x, y)
    {
        var sprite = this.gameManager.spriteManager.getSprite("Player");
        let tileset_middle = this.gameManager.mapManager.getTilesetIdx(x + sprite.w/2, y - (obj.speed));
        let tileset_left = this.gameManager.mapManager.getTilesetIdx(x , y - (obj.speed));
        let tileset_right = this.gameManager.mapManager.getTilesetIdx(x + sprite.w, y - (obj.speed));
        return !this.gameManager.mapManager.getTile(tileset_right).img.src.includes("map") ||
            !this.gameManager.mapManager.getTile(tileset_middle).img.src.includes("map") ||
            !this.gameManager.mapManager.getTile(tileset_left).img.src.includes("map")
    }
}