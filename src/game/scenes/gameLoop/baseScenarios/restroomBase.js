import ConectadoBaseScene from "../../conectadoBaseScene.js";

export default class RestroomBase extends ConectadoBaseScene {
    /**
    * Escena para el bano. Coloca los elementos que se mantienen igual todos los dias
    * @extends ConectadoBaseScene
    */
    constructor(name = "RestroomBase") {
        super(name, "restroom");
    }

    create(params) {
        super.create(params);

        this.createBg("restroomBg");


        // Puerta al pasillo
        this.corridorSceneName = params.corridor;

        this.restroomDoorClosed = this.add.image(1003 * this.bgScale, 168 * this.bgScale, this.atlasName, "restroomDoorClosed").setOrigin(0, 0).setScale(this.bgScale);
        this.restroomDoorOpened = this.add.image(1003 * this.bgScale, 168 * this.bgScale, this.atlasName, "restroomDoorOpened").setOrigin(0, 0).setScale(this.bgScale);
        // Al hacer click, se pasara a la escena del pasillo sin eliminar esta escena
        this.createToggle(this.restroomDoorClosed, "restroomDoorClosed", this.restroomDoorOpened, "restroomDoorOpened", false, () => {
            let params = {
                camPos: this.CAM_POS_LEFT,
                corridor: this
            }
            this.gameManager.changeScene(this.corridorSceneName, params, false, true);
        });


        // Puerta del primer cubiculo
        this.stall1DoorClosed = this.add.image(1911 * this.bgScale, 296 * this.bgScale, this.atlasName, "restroomStall1Closed").setOrigin(0, 0).setScale(this.bgScale);
        this.stall1DoorOpened = this.add.image(1742 * this.bgScale, 276 * this.bgScale, this.atlasName, "restroomStall1Opened").setOrigin(0, 0).setScale(this.bgScale);
        this.createToggle(this.stall1DoorClosed, "restroomStall1DoorClosed", this.stall1DoorOpened, "restroomStall1DoorOpened", true);

        // Puerta del segundo cubiculo
        this.stall2 = this.add.image(2155 * this.bgScale, -6 * this.bgScale, this.atlasName, "stall2").setOrigin(0, 0).setScale(this.bgScale);
        this.stall2DoorClosed = this.add.image(2197 * this.bgScale, 244 * this.bgScale, this.atlasName, "restroomStall2Closed").setOrigin(0, 0).setScale(this.bgScale);
        this.stall2DoorOpened = this.add.image(1844 * this.bgScale, 240 * this.bgScale, this.atlasName, "restroomStall2Opened").setOrigin(0, 0).setScale(this.bgScale);
        this.createToggle(this.stall2DoorClosed, "restroomStall2DoorClosed", this.stall2DoorOpened, "restroomStall2DoorOpened", true);

        // Tercer cubiculo (puerta cerrada siempre)
        this.stall3 = this.add.image(2395 * this.bgScale, -6 * this.bgScale, this.atlasName, "stall3").setOrigin(0, 0).setScale(this.bgScale);
    }
}