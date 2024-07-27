import NightmareMinigame from '../nightmareMinigame.js'

export default class NightmareDay1 extends NightmareMinigame {
    /**
     * Pesadilla que aparece el dia 1
     * El minijuego consiste en pasar el cursor por todas las sillas y hacer que desaparezcan
     */
    constructor() {
        super(1, false);
    }

    create(params) {
        super.create(params);

        // Guardar las sillas
        this.chairs = new Set();

        let upperRow = {
            y: 2.8 * this.CANVAS_HEIGHT / 4,
            nItems: 5,
            sideOffset: 120
        };
        this.createCenteredChairs(upperRow.y, upperRow.nItems, upperRow.sideOffset);

        let lowerRow = {
            y: 3.3 * this.CANVAS_HEIGHT / 4,
            nItems: 5,
            sideOffset: 50
        }
        this.createCenteredChairs(lowerRow.y, lowerRow.nItems, lowerRow.sideOffset);
    }

    /**
     * Crea sillas centradas respecto a un offset a los lados
     * @param {Number} y - posicion y donde se crean las sillas 
     * @param {Number} nItems - numero de sillas que se crean
     * @param {Number} sideOffset - distancia que se deja a cada lado respecto al ancho del canvas
     */
    createCenteredChairs(y, nItems, sideOffset) {
        if (nItems > 0) {
            let scale = 0.55;
            let frameName = 'chair';

            // Se crea una silla de prueba para poder obtener el ancho
            let aux = this.add.image(0, 0, this.atlasName, frameName);
            aux.setScale(scale);
            // El area de trabajo es el ancho del canvas menos el offset a cada y la mitad de la silla a cada lado para que no se salgan de los bordes
            let areaWidth = this.CANVAS_WIDTH - sideOffset * 2 - aux.displayWidth;
            // Se calcula donde se va a colocar cada silla
            let posX = areaWidth / (nItems - 1);
            aux.destroy();

            // Se colocan las sillas
            for (let i = 0; i < nItems; ++i) {
                let x = posX * i + sideOffset + aux.displayWidth / 2;
                let chair = this.add.image(x, y, this.atlasName, frameName);
                chair.setScale(scale);
                this.chairs.add(chair);
            }
        }
    }

    onMinigameStarts() {
        this.animateChairs();
    }

    /**
     * Logica del minijuego
     * Animar las sillas y hacer que cuando se palse el cursor sobre ellas desaparezcan
     */
    animateChairs() {
        let fadeOutDuration = 100;

        this.chairs.forEach((chair) => {
            chair.setInteractive();
            // Desaparece la silla
            chair.once('pointerover', () => {
                let fadeOut = this.tweens.add({
                    targets: chair,
                    alpha: 0,
                    duration: fadeOutDuration,
                    repeat: 0,
                });

                fadeOut.on('complete', () => {
                    // Se elimina de la estructura de datos y se comprueba si ya no quedan mas sillas
                    // En ese caso, el minijuego ha terminado
                    if (this.chairs.has(chair)) {
                        this.chairs.delete(chair);
                        chair.destroy();

                        if (this.chairs.size <= 0) {
                            this.onMinigameFinishes();
                        }
                    }
                })
            });
        });
    }
}