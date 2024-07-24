
import BaseScene from './baseScene.js';

export default class CorridorBase extends BaseScene {
    /**
     * Escena base para el pasillo. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super(name, 'corridor');
    }

    create(params) {
        super.create(params);

        this.stairs = "";
        this.boysBathroom = "";
        this.girlsBathroom = "";
        this.class = "";

        this.nextHour = "";

        // Pone la imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'corridorBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);

        this.rightBound = bg.displayWidth;


        // Puerta a las escaleras
        this.stairsNode = null;
        let stairsDoor = this.add.rectangle(844 * this.scale, 687 * this.scale, 286 * this.scale, 290 * this.scale, 0xfff, 0).setOrigin(0, 0);
        stairsDoor.setInteractive({ useHandCursor: true });
        // Al hacer click, si hay algun dialogo que mostrar (para indicar que no se puede salir), se
        // mostrara. En caso contrario, se pasara a la escena de las escaleras sin eliminar esta escena
        stairsDoor.on('pointerdown', () => {
            if (this.stairsNode) {
                this.dialogManager.setNode(this.stairsNode);
            }
            else {
                this.gameManager.changeScene(this.stairs, {}, true);

                // Al ir a las escaleras, se cambiara la hora. Si la 
                // siguiente hora es un string vacio, no tendra efecto
                this.phoneManager.phone.setDayInfo(this.nextHour, "");
            }
        });

        // Puerta del bano de los chicos
        let doorPos = {
            x: 1485 * this.scale,
            y: 596 * this.scale
        };
        this.boysBathroomNode = null;
        let boysBathroomdoorClosed = this.add.image(doorPos.x, doorPos.y, this.atlasName, 'boysDoorClosed').setOrigin(0, 0).setScale(this.scale);
        let boysBathroomDoorOpened = this.add.image(doorPos.x, doorPos.y, this.atlasName, 'boysDoorOpened').setOrigin(0, 0).setScale(this.scale);
        // Al hacer click, si hay algun dialogo que mostrar (para indicar que no se puede entrar), se
        // mostrara. En caso contrario, se pasara a la escena del bano sin eliminar esta escena
        super.toggleDoor(boysBathroomdoorClosed, boysBathroomDoorOpened, () => {
            if (this.boysBathroomNode) {
                this.dialogManager.setNode(this.boysBathroomNode);
            }
            else {
                let params = {
                    camPos: "left",
                    corridor: this
                }
                this.gameManager.changeScene(this.boysBathroom, params, true);
            }
        }, false);

        // Puerta del bano de las chicas
        doorPos = {
            x: 1361 * this.scale,
            y: 636 * this.scale
        };
        this.girlsBathroomNode = null;
        let girlsBathroomDoorClosed = this.add.image(doorPos.x, doorPos.y, this.atlasName, 'girlsDoorClosed').setOrigin(0, 0).setScale(this.scale);
        let girlsBathroomDoorOpened = this.add.image(doorPos.x, doorPos.y, this.atlasName, 'girlsDoorOpened').setOrigin(0, 0).setScale(this.scale);
        // Al hacer click, si hay algun dialogo que mostrar (para indicar que no se puede entrar), se
        // mostrara. En caso contrario, se pasara a la escena del bano sin eliminar esta escena
        super.toggleDoor(girlsBathroomDoorClosed, girlsBathroomDoorOpened, () => {
            if (this.girlsBathroomNode) {
                this.dialogManager.setNode(this.girlsBathroomNode);
            }
            else {
                let params = {
                    camPos: "left",
                    corridor: this
                }
                this.gameManager.changeScene(this.girlsBathroom, params, true);
            }
        }, false);


        // Puerta de la clase
        doorPos = {
            x: 109 * this.scale,
            y: 341 * this.scale
        };
        this.classNode = null;
        let classDoorClosed = this.add.image(doorPos.x, doorPos.y, this.atlasName, 'classDoorClosed').setOrigin(0, 0).setScale(this.scale);
        let classDoorOpened = this.add.image(doorPos.x, doorPos.y, this.atlasName, 'classDoorOpened').setOrigin(0, 0).setScale(this.scale);
        // Al hacer click, si hay algun dialogo que mostrar, se mostrara. 
        // En caso contrario, se pasara a la escena de la clase y se borrara esta escena
        super.toggleDoor(classDoorClosed, classDoorOpened, () => {
            if (this.classNode) {
                this.dialogManager.setNode(this.classNode);
            }
            else {
                let params = {
                    camPos: "left",
                }
                this.gameManager.changeScene(this.class, params);
            }
        }, false);


        // Establece por defecto el nodo del bano contrario segun el genero del jugador
        let nodes = this.cache.json.get('everydayDialog');
        if (this.gameManager.getUserInfo().gender === "male") {
            this.girlsBathroomNode = super.readNodes("root", nodes, "everydayDialog", "corridor.bathroom", true);
        }
        else {
            this.boysBathroomNode = super.readNodes("root", nodes, "everydayDialog", "corridor.bathroom", true);
        }

    }
}