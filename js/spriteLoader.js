class SpriteLoader {

    constructor(){

        this.sprites = {};

    }

    async load(name, path){

        return new Promise((resolve,reject)=>{

            const img = new Image();

            img.src = path;

            img.onload = ()=>{

                this.sprites[name] = img;

                resolve(img);

            };

            img.onerror = reject;

        });

    }

    get(name){

        return this.sprites[name];

    }

}

window.SpriteLoader =
SpriteLoader;

