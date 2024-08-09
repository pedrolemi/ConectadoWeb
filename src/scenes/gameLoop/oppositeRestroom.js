
import BaseScene from './baseScene.js';

export default class OppositeRestroom extends BaseScene {
    /**
     * Escena para el bano del genero opuesto al del jugador
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor() {
        super('OppositeRestroom', 'restroom');
    }

    create(params) {
        super.create(params);

        this.corridor = "";

        // Pone la imagen de fondo con las dimensiones del canvas y dado la vuelta
        let bg = this.add.image(0, 0, 'restroomBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);
        bg.flipX = true;

        this.rightBound = bg.displayWidth;


        // Puerta al pasillo
        let doorPos = {
            x: 1353 * this.scale,
            y: 168 * this.scale
        };
        let doorClosed = this.add.image(doorPos.x, doorPos.y, this.atlasName, 'restroomDoorClosed').setOrigin(0, 0).setScale(this.scale);
        let doorOpened = this.add.image(doorPos.x, doorPos.y, this.atlasName, 'restroomDoorOpened').setOrigin(0, 0).setScale(this.scale);
        // Al hacer click, se pasara a la escena del pasillo sin eliminar esta escena
        super.toggleDoor(doorClosed, doorOpened, () => {
            let params = {
                camPos: "left"
            }
            this.gameManager.changeScene(this.corridor, params, true);
        }, false);


        // Puerta del segundo cubiculo
        let stall2DoorClosed = this.add.image(593 * this.scale, 244 * this.scale, this.atlasName, 'restroomStall2Closed').setOrigin(0.5, 0).setScale(this.scale);
        let stall2DoorOpened = this.add.image(861 * this.scale, 240 * this.scale, this.atlasName, 'restroomStall2Opened').setOrigin(0.5, 0).setScale(this.scale);
        super.toggleDoor(stall2DoorClosed, stall2DoorOpened);
        stall2DoorClosed.flipX = true;
        stall2DoorOpened.flipX = true;


        // Telefono del jugador
        let phone = this.add.image(2100 * this.scale, 1280 * this.scale, this.atlasName, 'stolenPhone').setOrigin(0, 0).setScale(this.scale * 1.7);
        phone.setInteractive({ useHandCursor: true });
        phone.on('pointerdown', () => {
            this.dialogManager.setNode(phoneNode);
        })

        let nodes = this.cache.json.get('restroomBreakDay4');
        let phoneNode = super.readNodes(nodes, "day4\\restroomBreakDay4", "phone", true);
        
        this.dispatcher.addOnce("pickPhone", this, (obj) => {
            phone.disableInteractive();
            this.tweens.add({
                targets: [phone],
                alpha: { from: 1, to: 0 },
                duration: 500,
                repeat: 0,
            });
        })


        // El unico sitio al que se puede volver es la escena de la que se 
        // viene, por lo que si esta guardada en los parametros, se establece
        if (params) {
            if (params.corridor) {
                this.corridor = params.corridor;
            }
        }
    }
}