import ConectadoBaseScene from "../../conectadoBaseScene.js";

export default class ClassBackBase extends ConectadoBaseScene {
    /**
    * Escena base para la parte trasera de la clase. Coloca los elementos que se mantienen igual todos los dias
    * @extends ConectadoBaseScene
    * @param {String} name - id de la escena
    */
    constructor(name) {
        super(name, "classBack");
    }

    create(params) {
        super.create(params);

        this.createBg("classBackBg");


        // Primera fila de sillas y mesas
        this.row1Tables = this.add.image(0, 0, "backRow1Tables").setOrigin(0, 0).setScale(this.bgScale).setDepth(this.BG_DEPTH + 1);
        this.row1Chairs = this.add.image(0, 0, "backRow1Chairs").setOrigin(0, 0).setScale(this.bgScale).setDepth(this.row1Tables.depth + 1);

        // Segunda fila de sillas y mesas
        this.row2Tables = this.add.image(0, 0, "backRow2Tables").setOrigin(0, 0).setScale(this.bgScale).setDepth(this.row1Chairs.depth + 1);
        this.row2Chairs = this.add.image(0, 0, "backRow2Chairs").setOrigin(0, 0).setScale(this.bgScale).setDepth(this.row2Tables.depth + 1);

        // Tercera fila de sillas y mesas
        this.row3Tables = this.add.image(0, 0, "backRow3Tables").setOrigin(0, 0).setScale(this.bgScale).setDepth(this.row2Chairs.depth + 1);
        this.row3Chairs = this.add.image(0, 0, "backRow3Chairs").setOrigin(0, 0).setScale(this.bgScale).setDepth(this.row3Tables.depth + 1);

        // Cuarta fila de sillas y mesas
        this.row4Tables = this.add.image(0, 0, "backRow4Tables").setOrigin(0, 0).setScale(this.bgScale).setDepth(this.row3Chairs.depth + 1);
        this.row4Chairs = this.add.image(0, 0, "backRow4Chairs").setOrigin(0, 0).setScale(this.bgScale).setDepth(this.row4Tables.depth + 1);

        // Quinta fila de sillas y mesas
        this.row5Tables = this.add.image(0, 0, "backRow5Tables").setOrigin(0, 0).setScale(this.bgScale).setDepth(this.row4Chairs.depth + 1);
        this.row5Chairs = this.add.image(0, 0, "backRow5Chairs").setOrigin(0, 0).setScale(this.bgScale).setDepth(this.row5Tables.depth + 1);

        // Dibujos de la pizarra
        let blackboardPicsPos = {
            x: 735,
            y: 365,
            scale: this.bgScale * 1.8
        };
        this.blackboardPics = [
            this.add.image(blackboardPicsPos.x, blackboardPicsPos.y, this.atlasName, "blackboardPic1").setOrigin(0.5, 0.5).setScale(blackboardPicsPos.scale),
            this.add.image(blackboardPicsPos.x, blackboardPicsPos.y, this.atlasName, "blackboardPic2").setOrigin(0.5, 0.5).setScale(blackboardPicsPos.scale),
            this.add.image(blackboardPicsPos.x, blackboardPicsPos.y, this.atlasName, "blackboardPic3").setOrigin(0.5, 0.5).setScale(blackboardPicsPos.scale)
        ]
        for (let i = 0; i < this.blackboardPics.length; i++) {
            this.blackboardPics[i].setVisible(false);
        }


        // Puerta al pasillo
        this.doorNode = null;
        this.corridorSceneName = "";
        
        this.doorClosed = this.add.image(2224 * this.bgScale, 530 * this.bgScale, this.atlasName, "classDoorClosed").setOrigin(0, 0).setScale(this.bgScale);
        this.doorOpened = this.add.image(2224 * this.bgScale, 530 * this.bgScale, this.atlasName, "classDoorOpened").setOrigin(0, 0).setScale(this.bgScale);
        // Al hacer click, si hay algun dialogo que mostrar (para indicar que no se puede salir), se
        // mostrara. En caso contrario, se pasara a la escena del pasillo y se elimina esta escena
        this.createToggle(this.doorClosed, "corridorDoorClosed", this.doorOpened, "corridorDoorOpened", false, () => {
            if (this.doorNode) {
                this.localizationManager.setNode(this.doorNode);
            }
            else {
                let params = {
                    camPos: this.CAM_POS_LEFT,
                }
                this.gameManager.changeScene(this.corridorSceneName, params, false);
            }
        });
    }
}