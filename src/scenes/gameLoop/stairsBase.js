
import BaseScene from './baseScene.js';

export default class StairsBase extends BaseScene {
    /**
     * Escena base para las escaleras. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super(name);
    }

    create(params) {
        super.create(params);

        this.playground = "";
        this.corridor = "";

        // Pone la imagen de fondo con las dimensiones del canvas
        this.bgImg = 'stairsBg'
        this.bg = this.add.image(0, 0, this.bgImg).setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / this.bg.height;
        this.bg.setScale(this.scale);
        this.rightBound = this.bg.displayWidth;

        // Puerta del despacho
        let nodes = this.cache.json.get('everydayDialog');
        this.doorNode = super.readNodes(nodes, "everydayDialog", "stairs.door", true);
        let doorPos = {
            x: 2490 * this.scale,
            y: 273 * this.scale
        };
        let doorClosed = this.add.image(doorPos.x, doorPos.y, 'stairsDoorClosed').setOrigin(0, 0).setScale(this.scale);
        let doorOpened = this.add.image(doorPos.x, doorPos.y, 'stairsDoorOpened').setOrigin(0, 0).setScale(this.scale);
        // Al hacer click en la puerta, se muestra un dialogo
        super.toggleDoor(doorClosed, doorOpened, () => {
            this.dialogManager.setNode(this.doorNode);
        }, false);


        // Escaleras al patio
        this.playgroundNode = null;
        let playgroundStairs = this.add.rectangle(379 * this.scale, 711 * this.scale, 980 * this.scale, 600 * this.scale, 0xfff, 0).setOrigin(0, 0);
        playgroundStairs.setInteractive({ useHandCursor: true });
        // Al hacer click sobre las escaleras de bajada, si hay algun dialogo que mostrar (para indicar que no se puede bajar), se
        // mostrara. En caso contrario, se pasara a la escena del patio con la camara a la derecha sin eliminar esta escena
        playgroundStairs.on('pointerdown', () => {
            if (this.playgroundNode) {
                this.dialogManager.setNode(this.playgroundNode);
            }
            else {
                let params = {
                    camPos: "right"
                };
                this.gameManager.changeScene(this.playground, params, true);
            }
        });

        // Escaleras al pasillo
        this.corridorNode = null;
        let corridorStairs = this.add.rectangle(1110 * this.scale, 60 * this.scale, 800 * this.scale, 770 * this.scale, 0xfff, 0).setOrigin(0, 0);
        corridorStairs.setInteractive({ useHandCursor: true });
        // Al hacer click sobre las escaleras de subida, si hay algun dialogo que mostrar (para indicar que no se puede subir), se
        // mostrara. En caso contrario, se pasara a la escena del pasillo sin eliminar esta escena
        corridorStairs.on('pointerdown', () => {
            if (this.corridorNode) {
                this.dialogManager.setNode(this.corridorNode);
            }
            else {
                let params = {
                    camPos: "left"
                };
                this.gameManager.changeScene(this.corridor, params, true);
            }
        });

    }

}