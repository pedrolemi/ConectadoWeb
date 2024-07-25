
import BaseScene from './baseScene.js';

export default class PlaygroundBase extends BaseScene {
    /**
     * Escena base para el patio. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super(name);
    }
    
    create(params) {
        super.create(params);

        this.home = "";
        this.stairs = "";

        this.nextHour = "";
        
        // Pone la imagen de fondo con las dimensiones del canvas
        this.bgImg = 'playgroundClosed'
        this.bg = this.add.image(0, 0, this.bgImg).setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / this.bg.height;
        this.bg.setScale(this.scale);
        this.rightBound = this.bg.displayWidth;


        this.homeNode = null;
        let exit = this.add.rectangle(0, 913 * this.scale, 1140 * this.scale, 490 * this.scale, 0xfff, 0).setOrigin(0, 0);
        exit.setInteractive({ useHandCursor: true });
        // Al hacer click sobre la zona de salida si hay algun dialogo que mostrar (para indicar que no se puede salir), se
        // mostrara. En caso contrario, se pasara a la escena del salon con la camara a la izquierda y se eliminara esta escena
        exit.on('pointerdown', () => {
            if (this.homeNode) {
                this.dialogManager.setNode(this.homeNode);
            }
            else {
                let params = {
                    camPos: "left"
                }
                this.gameManager.changeScene(this.home, params);
            }
        });

        // Puertas del edificio
        let nodes = this.cache.json.get('everydayDialog');
        this.doorNode = super.readNodes(nodes, "everydayDialog", "playground.door", true);;
        let doors = this.add.rectangle(2640 * this.scale, 1060 * this.scale, 262, 186, 0xfff, 0).setOrigin(0, 0);
        doors.setInteractive({ useHandCursor: true });
        // Al hacer click sobre la zona de la peurta, si las puertas estan abiertas, se pasara a la escena de las escaleras
        // sin eliminar esta escena. En caso contrario, se mostrara un dialogo indicando que no se puede entrar
        doors.on('pointerdown', () => {
            // Si las puertas estan abiertas, pasa a la escena de las escaleras
            if (this.bgImg === 'playgroundOpened') {
                this.gameManager.changeScene(this.stairs, { } , true);
            }
            // Si no, se muestra el dialogo correspondiente
            else {
                this.dialogManager.setNode(this.doorNode);
            }
        });

    }

    openDoors() {
        let bgDepth = this.bg.depth;
        this.bgImg = 'playgroundOpened'
        this.bg.destroy();
        this.bg = this.add.image(0, 0, this.bgImg).setOrigin(0, 0).setScale(this.scale).setDepth(bgDepth);
    }
}