import NightmareMinigame from '../baseScenarios/nightmareMinigame.js'

export default class NightmareDay1 extends NightmareMinigame {
    /**
     * Pesadilla que aparece el dia 1
     * El minijuego consiste en pasar el cursor por todas las sillas y hacer que desaparezcan
     */
    constructor() {
        super(1, true);
    }

    create(params) {
        super.create(params);

        // Guardar las sillas
        this.chairs = [];
        // Ultima silla tocada (para saber cual hay que hacer desaparecer)
        // Nota: solo se usa cuando la silla emite un dialogo
        this.lastTouchedChair = null;

        // Dialogo que emiten alguna de las sillas
        this.seatNode = this.readNodes('seat');
        // Numero de sillas que emiten el dialogo
        this.nChairsWithDialogs = 2;

        let upperRow = {
            y: 2.8 * this.CANVAS_HEIGHT / 4,
            nItems: 5,
            sideOffset: 120
        };
        let upperChairs = this.createCenteredChairs(upperRow.y, upperRow.nItems, upperRow.sideOffset);

        let lowerRow = {
            y: 3.3 * this.CANVAS_HEIGHT / 4,
            nItems: 5,
            sideOffset: 50
        }
        let lowerChairs = this.createCenteredChairs(lowerRow.y, lowerRow.nItems, lowerRow.sideOffset);

        this.chairs = upperChairs.concat(lowerChairs);

        // Saber cuantas sillas restantes quedan por tocar
        this.nChairs = this.chairs.length;

        // Evento para hacer desaparecer una silla que ha emitido un dialogo
        this.dispatcher.add('seatFadesOut', this, () => {
            if (this.lastTouchedChair) {
                this.chairFadesOut(this.lastTouchedChair)
            }
            this.lastTouchedChair = null;
        });
    }

    /**
     * Crear un numero de sillas centradas
     */
    createCenteredChairs(y, nItems, sideOffset) {
        // Objeto que sirve como modelo para el resto de objetos
        let chairAux = this.createChair();
        return this.createCenteredObjects(y, nItems, sideOffset, chairAux);
    }

    /**
     * Crear una silla
     * Nota: propiedades w (ancho de la silla) y clone (clonar silla) para poder crear una hilera de sillas
     */
    createChair() {
        let scale = 0.55;
        let chair = this.add.image(0, 0, this.atlasName, 'chair');
        chair.setScale(scale);
        chair.w = chair.displayWidth;
        chair.clone = () => {
            return this.createChair();
        }
        return chair;
    }

    onMinigameStarts() {
        // Se seleccionan dos silla aleatorias para que emitan dialogos
        for (let i = 0; i < this.nChairsWithDialogs; ++i) {
            let randIndex = Phaser.Math.Between(0, this.chairs.length - 1);
            let chair = this.chairs[randIndex];
            this.activateChairForMinigame(chair, this.seatNode);
            this.chairs.splice(randIndex, 1);
        }

        // El resto de sillas directamente se desvacenen
        this.chairs.forEach((chair) => {
            this.activateChairForMinigame(chair);
        });

        this.chairs = [];
    }

    /**
     * Logica del minijuego
     * Animar las sillas y hacer que al pasar el cursor por encima de ellas, desaparezcan.
     * Ademas, algunas de las sillas antes de desaparecer emitiran un dialogo.
     */
    activateChairForMinigame(chair, node) {
        chair.setInteractive({ useHandCursor: true });
        // Desaparece la silla
        chair.once('pointerover', () => {
            chair.removeInteractive();

            if (node) {
                this.lastTouchedChair = chair;
                this.dialogManager.setNode(node);
            }
            else {
                this.chairFadesOut(chair);
            }
        });
    }

    /**
     * Hacer desaparecer una silla
     */
    chairFadesOut(chair) {
        let fadeOutDuration = 90;

        let fadeOut = this.tweens.add({
            targets: chair,
            alpha: 0,
            duration: fadeOutDuration,
            repeat: 0,
        });

        fadeOut.on('complete', () => {
            chair.destroy();

            --this.nChairs;
            if (this.nChairs <= 0) {
                this.onMinigameFinishes();
            }
        })
    }
}