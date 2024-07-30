
import BaseScene from '../baseScene.js';

export default class ClassBackBase extends BaseScene {
    /**
     * Escena base para el fondo de la clase. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super(name, 'classBack');
    }
    
    create(params) {
        super.create(params);

        this.corridor = "";

        // Pone la imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'classBackBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);

        this.rightBound = bg.displayWidth;


        // Puerta al pasillo
        let doorPos = {
            x: 2224 * this.scale,
            y: 530 * this.scale
        };
        this.doorNode = null;
        let doorClosed = this.add.image(doorPos.x, doorPos.y, this.atlasName, 'classDoorClosed').setOrigin(0, 0).setScale(this.scale);
        let doorOpened = this.add.image(doorPos.x, doorPos.y, this.atlasName, 'classDoorOpened').setOrigin(0, 0).setScale(this.scale);
        // Al hacer click, si hay algun dialogo que mostrar (para indicar que no se puede salir), se
        // mostrara. En caso contrario, se pasara a la escena del pasillo y se elimina esta escena
        super.toggleDoor(doorClosed, doorOpened, () => {
            if (this.doorNode) {
                this.dialogManager.setNode(this.doorNode);
            }
            else {
                let params = {
                    camPos: "left"
                }
                this.gameManager.changeScene(this.corridor, params);
            }
        }, false);


        // Primera fila de sillas y mesas
        this.row1Chairs = this.add.image(0, 0, 'backRow1Chairs').setOrigin(0, 0).setScale(this.scale);
        this.row1Tables = this.add.image(0, 0, 'backRow1Tables').setOrigin(0, 0).setScale(this.scale);

        // Segunda fila de sillas y mesas
        this.row2Chairs = this.add.image(0, 0, 'backRow2Chairs').setOrigin(0, 0).setScale(this.scale);
        this.row2Tables = this.add.image(0, 0, 'backRow2Tables').setOrigin(0, 0).setScale(this.scale);

        // Tercera fila de sillas y mesas
        this.row3Chairs = this.add.image(0, 0, 'backRow3Chairs').setOrigin(0, 0).setScale(this.scale);
        this.row3Tables = this.add.image(0, 0, 'backRow3Tables').setOrigin(0, 0).setScale(this.scale);

        // Cuarta fila de sillas y mesas
        this.row4Chairs = this.add.image(0, 0, 'backRow4Chairs').setOrigin(0, 0).setScale(this.scale);
        this.row4Tables = this.add.image(0, 0, 'backRow4Tables').setOrigin(0, 0).setScale(this.scale);

        // Quinta fila de sillas y mesas
        this.row5Chairs = this.add.image(0, 0, 'backRow5Chairs').setOrigin(0, 0).setScale(this.scale);
        this.row5Tables = this.add.image(0, 0, 'backRow5Tables').setOrigin(0, 0).setScale(this.scale);


        // Se recolocan las filas para que las mesas esten por debajo de las 
        // sillas y las filas del fondo esten por debajo de las filas del frente
        this.row1Tables.setDepth(1);
        this.row1Chairs.setDepth(this.row1Tables.depth + 1);

        this.row2Tables.setDepth(this.row1Chairs.depth + 1);
        this.row2Chairs.setDepth(this.row2Tables.depth + 1);

        this.row3Tables.setDepth(this.row2Chairs.depth + 1);
        this.row3Chairs.setDepth(this.row3Tables.depth + 1);

        this.row4Tables.setDepth(this.row3Chairs.depth + 1);
        this.row4Chairs.setDepth(this.row4Tables.depth + 1);

        this.row5Tables.setDepth(this.row4Chairs.depth + 1);
        this.row5Chairs.setDepth(this.row5Tables.depth + 1);

        let picPos = {
            x: 735,
            y: 365,
            scale: this.scale * 1.8
        };
        this.blackboardPics = [
            this.add.image(picPos.x, picPos.y, this.atlasName, 'blackboardPic1').setOrigin(0.5, 0.5).setScale(picPos.scale),
            this.add.image(picPos.x, picPos.y, this.atlasName, 'blackboardPic2').setOrigin(0.5, 0.5).setScale(picPos.scale),
            this.add.image(picPos.x, picPos.y, this.atlasName, 'blackboardPic3').setOrigin(0.5, 0.5).setScale(picPos.scale)
        ]
        for (let i = 0; i < this.blackboardPics.length; i++) {
            this.blackboardPics[i].visible = false;
        }
    }
}