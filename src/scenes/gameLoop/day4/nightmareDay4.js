import NightmareMinigame from '../nightmareMinigame.js';
import ReportablePhoto from '../../../gameObjects/reportablePhoto.js';

export default class NightmareDay4 extends NightmareMinigame {
    /**
     * Pesadilla que aparece el dia 3
     * El minijuego consiste en imagenes que aparecen y que hay que tratar de pasar el cursor por encima de ellas para que desaparezcan
     * Sin embargo, es imposible hacerlas desaparecer y solo van a terminar apareciendo mas
     * El minijuego termina despues de cierto tiempo
     */
    constructor() {
        super(4, false);
    }

    create(params) {
        super.create(params);

        // Array para guardar todas las fotos y pararlas cuando haya pasado el tiempo oportuno
        this.photos = [];
        // Duracion del minijuego (18 segundos)
        this.nightmareDuration = 18000;
        this.elapsedTime = 0;
        // Si el minijuego ha empezado o no (para que comience a correr el contador)
        this.activatedMinigame = false;

        // Parametros de las fotos
        this.photosParams = {
            scale: 0.54,
            speed: 5,
            minTouches: 5,
            maxTouches: 8
        }
        // Parametros del terremoto que ocurre cuando se duplica una foto
        this.shakeParams = {
            duration: 95,
            intensity: 0.075
        }

        // Imagenes que pueden aparecer
        this.sprites = ['photoDog', 'photoGum', 'photoGumWashed'];
        let userInfo = this.gameManager.getUserInfo();
        if (userInfo.gender == "male") {
            this.sprites.push('photoForeheadBoy', 'photoNumberBoy')
        }
        else if (userInfo.gender == "female") {
            this.sprites.push('photoForeheadGirl', 'photoNumberGirl')
        }

        // Saber si hay un terremoto ya ejecutandose para que no se ejecuten varios a la vez
        this.shakeCompleted = true;
        this.cameras.main.on('camerashakecomplete', () => {
            this.shakeCompleted = true;
        });
    }

    /**
     * Crear una foto y hacer que la funcion que se ejecuta al pulsarla un numero determinado de clics
     * sea crear una foto desde su misma posicion que se mueve (como si se duplicara)
     */
    createPhoto(photosParams, startMoving, pos) {
        // Se coge una imagen aleatoria
        let randomSprite = Phaser.Math.Between(0, this.sprites.length - 1);
        // Se crea la foto segun los parametros
        let photo = new ReportablePhoto(this, photosParams.scale, this.sprites[randomSprite], photosParams.speed,
            photosParams.minTouches, photosParams.maxTouches, () => {
                // Cuando se ha pulsado un numero determinado de clics...
                // Se produce un terremoto
                if (this.shakeCompleted) {
                    this.shakeCompleted = false;
                    this.cameras.main.shake(this.shakeParams.duration, this.shakeParams.intensity);
                }
                // Se crea una nueva foto desde su misma posicion
                this.createPhoto(photosParams, true, { x: photo.x, y: photo.y });
            }, pos, startMoving);
        this.photos.push(photo)
    }

    update(t, dt) {
        super.update(t, dt);

        // Tiemmpo que dura el minijuego
        if (this.activatedMinigame) {
            this.elapsedTime += dt;
            if (this.elapsedTime > this.nightmareDuration) {
                this.elapsedTime = 0;
                this.onMinigameFinishes();
            }
        }
    }

    onMinigameStarts() {
        // Se crea la foto inicial, que empieza todo el minijuego
        this.createPhoto(this.photosParams, false);
        this.activatedMinigame = true;
    }

    onMinigameFinishes() {
        super.onMinigameFinishes();
        // Se paran todas las fotos
        this.photos.forEach((photo) => {
            photo.stop();
        });
        this.activatedMinigame = false;
    }
}