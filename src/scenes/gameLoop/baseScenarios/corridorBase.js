
import BaseScene from '../baseScene.js';

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
        this.class = "";

        // Establece la escena de bano y el nodo por defecto del bano opuesto segun el genero del jugador
        let nodes = this.cache.json.get('everydayDialog');
        if (this.gameManager.getUserInfo().gender === "male") {
            this.boysRestroom = "RestroomBase";
            this.girlsRestroom = "OppositeRestroom";
            this.girlsRestroomNode = super.readNodes(nodes, "everydayDialog", "corridor.restroom", true);
        }
        else {
            this.girlsRestroom = "RestroomBase";
            this.boysRestroom = "OppositeRestroom";
            this.boysRestroomNode = super.readNodes(nodes, "everydayDialog", "corridor.restroom", true);
        }
        


        // Pone la imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'corridorBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);

        this.rightBound = bg.displayWidth;


        // Puerta a las escaleras
        this.stairsNode = null;
        this.stairsDoor = this.add.rectangle(844 * this.scale, 687 * this.scale, 286 * this.scale, 290 * this.scale, 0xfff, 0).setOrigin(0, 0);
        this.stairsDoor.setInteractive({ useHandCursor: true });
        // Al hacer click, si hay algun dialogo que mostrar (para indicar que no se puede salir), se
        // mostrara. En caso contrario, se pasara a la escena de las escaleras sin eliminar esta escena
        this.stairsDoor.on('pointerdown', () => {
            if (this.stairsNode) {
                this.dialogManager.setNode(this.stairsNode);
            }
            else {
                this.gameManager.changeScene(this.stairs, {}, true);
            }
        });

        // Puerta del bano de los chicos
        let doorPos = {
            x: 1485 * this.scale,
            y: 596 * this.scale
        };
        let boysRestroomdoorClosed = this.add.image(doorPos.x, doorPos.y, this.atlasName, 'boysDoorClosed').setOrigin(0, 0).setScale(this.scale);
        let boysRestroomDoorOpened = this.add.image(doorPos.x, doorPos.y, this.atlasName, 'boysDoorOpened').setOrigin(0, 0).setScale(this.scale);
        // Al hacer click, si hay algun dialogo que mostrar (para indicar que no se puede entrar), se
        // mostrara. En caso contrario, se pasara a la escena del bano sin eliminar esta escena
        super.toggleDoor(boysRestroomdoorClosed, boysRestroomDoorOpened, () => {
            if (this.boysRestroomNode) {
                this.dialogManager.setNode(this.boysRestroomNode);
            }
            else {
                let params = {
                    camPos: "left",
                    corridor: this
                }
                this.gameManager.changeScene(this.boysRestroom, params, true);
            }
        }, false);

        // Puerta del bano de las chicas
        doorPos = {
            x: 1361 * this.scale,
            y: 636 * this.scale
        };
        let girlsRestroomDoorClosed = this.add.image(doorPos.x, doorPos.y, this.atlasName, 'girlsDoorClosed').setOrigin(0, 0).setScale(this.scale);
        let girlsRestroomDoorOpened = this.add.image(doorPos.x, doorPos.y, this.atlasName, 'girlsDoorOpened').setOrigin(0, 0).setScale(this.scale);
        // Al hacer click, si hay algun dialogo que mostrar (para indicar que no se puede entrar), se
        // mostrara. En caso contrario, se pasara a la escena del bano sin eliminar esta escena
        super.toggleDoor(girlsRestroomDoorClosed, girlsRestroomDoorOpened, () => {
            if (this.girlsRestroomNode) {
                this.dialogManager.setNode(this.girlsRestroomNode);
            }
            else {
                let params = {
                    camPos: "left",
                    corridor: this
                }
                this.gameManager.changeScene(this.girlsRestroom, params, true);
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


        // Evento llamado cuando se elige volver a entrar en clase
        this.dispatcher.addOnce("endBreak", this, (obj) => {
            let sceneName = 'TextOnlyScene';
            let textID = "day" + this.gameManager.day + ".endBreak";
            // Se obtiene el texto de la escena de transicion del archivo de traducciones 
            let text = this.i18next.t(textID, { ns: "transitionScenes", returnObjects: true });

            let params = {
                text: text,
                onComplete: () => {
                    this.gameManager.changeScene(this.class, this.classChangeParams);
                },
                onCompleteDelay: 500
            };
            
            // Se cambia a la escena de transicion
            this.gameManager.changeScene(sceneName, params);
        });
        

    }
}