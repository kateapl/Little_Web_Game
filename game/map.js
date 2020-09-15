class MapManager
{
    map = [];
    mapData = null;
    tLayer = null;
    xCount = 0;
    yCount = 0;
    tSize = {x:16, y:16};
    mapSize = {x:16, y:16};
    tilesets = [];
    imgLoadCount = 0;
    imgLoaded = false;
    jsonLoaded = false;
    gameManager = null;

    constructor(path, canvas, gameManager)
    { //загрузка карты

        this.gameManager = gameManager;
        let self = this;
        let request = new XMLHttpRequest();
        request.onreadystatechange = function()
        {
            if(request.readyState === 4 && request.status === 200)
            {
                self.parseMap(request.responseText);
            }
        };
        request.open("GET", path, true);
        request.send();
    }

    parseMap(tilesJSON) //разобрать карту
    {
        this.mapData = JSON.parse(tilesJSON);
        this.map.push(this.mapData);
        this.xCount = this.mapData.width;
        this.yCount = this.mapData.height;
        this.tSize.x = this.mapData.tilewidth;
        this.tSize.y = this.mapData.tileheight;
        this.mapSize.x = this.xCount * this.tSize.x;
        this.mapSize.y = this.yCount * this.tSize.y;

        self = this;
        for(let i =0; i < this.mapData.tilesets.length; i++)
        {
            let img = new Image();
            img.onload = function()
            {
                self.imgLoadCount++;
                if(self.imgLoadCount === self.mapData.tilesets.length)
                {
                    self.imgLoaded = true;
                }
            };

            let path = this.mapData.tilesets[i].image;
            path = path.replace('..\/', '');
            path = path.replace('\/', '/');
            path = `${path}`;
            img.src = path;
            let tileset = this.mapData.tilesets[i];

            let myTileset =
                {
                    firstgid: tileset.firstgid,
                    image: img,
                    name: tileset.name,
                    xCount: Math.floor(tileset.imagewidth/self.tSize.x),
                    yCount: Math.floor(tileset.imageheight/self.tSize.y)
                };
            this.tilesets.push(myTileset);
        }
        this.jsonLoaded = true;
    }

    draw(ctx) //отображение карты
    {
        let self = this;
        if(!self.imgLoaded || !self.jsonLoaded)
        {
            setTimeout(function()
            {
                self.draw(ctx);
            }, 100); //try again by 100ms timeout
        }
        else
        {
            if(this.tLayer === null)
            {
                for(let id = 0; id<this.mapData.layers.length; id++)
                {
                    let layer = this.mapData.layers[id];
                    if(layer.type === 'tilelayer')
                    {
                        this.tLayer = layer;
                        break;
                    }
                }
            }
            for(let i = 0; i<this.tLayer.data.length; i++)
            {
                if(this.tLayer.data[i] !== 0)
                {
                    let tile = this.getTile(this.tLayer.data[i]);
                    let pX = (i%this.xCount)*this.tSize.x ;
                    let pY = Math.floor(i/this.xCount)*this.tSize.y;

                    ctx.drawImage(tile.img, tile.px, tile.py,
                        this.tSize.x, this.tSize.y, pX , pY, this.tSize.x, this.tSize.y);

                }
            }
        }
    }


    getTileset(tileIndex) //нахождение блока по индексу
    {
        let self = this;
        for(let i = self.tilesets.length-1; i>=0; i--)
        {
            if(self.tilesets[i].firstgid <= tileIndex)
            {
                return self.tilesets[i];
            }
        }
        return null;
    }

    parseEntities() //разбор слоя типа objectgroup
    {
        let self = this;
        if(!self.imgLoaded || !self.jsonLoaded)
        {
            setTimeout(function(){self.parseEntities();},100);
        }
        else
        {
            for(let j = 0; j<this.mapData.layers.length; j++) //просмотр всех слоев
            {
                if(this.mapData.layers[j].type === 'objectgroup')
                {
                    let entities = this.mapData.layers[j]; //слой с объектами
                    for(let i = 0; i<entities.objects.length; i++) //проход по массиву objects для слоя
                    {
                        let e = entities.objects[i]; //объект слоя
                        let obj = this.gameManager.entityFactory(e.type, e.name, e.x, e.y);

                        this.gameManager.entities.push(obj);
                        if (obj.name === "Player") //инициализавция параметров игрока
                        {
                            this.gameManager.initPlayer(obj);
                        }
                    }
                }
            }
            this.gameManager.dataParsed = true;
        }
    }

    getTilesetIdx(x,y) //получить блок по координатам на карте
    {
        var wX = x;
        var wY = y;
        var idx = Math.floor(wY/this.tSize.y) * this.xCount + Math.floor(wX / this.tSize.x);
        return this.tLayer.data[idx];
    }

    getTile(tileIndex)  //получение блока по индексу
    {
        let self = this;
        let tile =
            {
                img: null,
                px: 0, py: 0
            };
        let tileset = this.getTileset(tileIndex);
        tile.img = tileset.image;
        let id = tileIndex - tileset.firstgid;
        let x = id%tileset.xCount;
        let y = Math.floor(id/tileset.xCount);
        tile.px = x * self.tSize.x;
        tile.py = y * self.tSize.y;
        return tile;
    }

}