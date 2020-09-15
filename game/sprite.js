class SpriteManager {
    image = new Image(); //рисунок с объектами
    sprites = [];  //массив объектов для отображения
    imgLoaded = false;
    jsonLoaded = false;
    gameManager = null;

    constructor(atlasJSON, atlasImg, gameManager) //принимает путь к файлу атласа и путь к изображению
    {
        this.gameManager = gameManager;
        let request = new XMLHttpRequest();
        let spriteManager = this;
        request.onreadystatechange = function()
        {
            if(request.readyState === 4 && request.status === 200)
            {
                spriteManager.parseAtlas(request.responseText);
            }
        };
        request.open("GET", atlasJSON, true);
        request.send();
        this.loadImg(atlasImg);
    }

    loadImg(imgName) {
        let spriteManager = this;
        this.image.onload = function () {
            spriteManager.imgLoaded = true;
        };
        this.image.src = imgName;
    }

    parseAtlas(atlasJSON) {
        var atlas = JSON.parse(atlasJSON);
        for (var name in atlas.frames) { // проход по всем именам в frames
            var frame = atlas.frames[name].frame; // получение спрайта и сохранение в frame
            this.sprites.push({
                name: name, x: frame.x,
                y: frame.y, w: frame.w, h: frame.h
            }); // сохранение характеристик frame в виде объекта
        }
        this.jsonLoaded = true; // атлас разобран
    }
    drawSprite(name, x, y) {
// если изображение не загружено, то повторить запрос через 100 мс
        let spriteManager = this;
        if (!this.imgLoaded || !this.jsonLoaded)
            setTimeout(function () {
                spriteManager.drawSprite(name, x, y);}, 100);
        else {
            var sprite = this.getSprite(name); //получить спрайт по имени
            spriteManager.gameManager.ctx.drawImage(spriteManager.image, sprite.x, sprite.y, sprite.w, sprite.h, x, y, sprite.w, sprite.h)
        }
    }
// получить спрайт по имени
    getSprite(name) {
        for (var i = 0; i < this.sprites.length; i++) {
            var s = this.sprites[i];
            if (s.name === name)
                return s;
        }
        return null; // не нашли спрайт
    }
}