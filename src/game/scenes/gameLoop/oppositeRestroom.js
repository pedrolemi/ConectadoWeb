import { fadeAnimation } from "../../../framework/utils/graphics.js";
import ConectadoBaseScene from "../conectadoBaseScene.js";

export default class OppositeRestroom extends ConectadoBaseScene {
    /**
    * Escena para el bano del genero opuesto al del jugador
    * @extends ConectadoBaseScene
    */
    constructor() {
        super("OppositeRestroom", "restroom");
    }

    create(params) {
        super.create(params);

        this.createBg("restroomBg");
        this.bg.setFlipX(true);


        // Puerta al pasillo
        this.corridorSceneName = params.corridor;

        this.oppositeRestroomDoorClosed = this.add.image(1353 * this.bgScale, 168 * this.bgScale, this.atlasName, "restroomDoorClosed").setOrigin(0, 0).setScale(this.bgScale);
        this.oppositeRestroomDoorOpened = this.add.image(1353 * this.bgScale, 168 * this.bgScale, this.atlasName, "restroomDoorOpened").setOrigin(0, 0).setScale(this.bgScale);
        // Al hacer click, se pasara a la escena del pasillo sin eliminar esta escena
        this.createToggle(this.oppositeRestroomDoorClosed, "oppositeRestroomDoorClosed", this.oppositeRestroomDoorOpened, "oppositeRestroomDoorOpened", false, () => {
            let params = {
                camPos: ConectadoBaseScene.CAM_POS_LEFT,
            }
            this.gameManager.changeScene(this.corridorSceneName, params, false, true);
        });


        // Puerta del segundo cubiculo
        this.stall2DoorClosed = this.add.image(593 * this.bgScale, 244 * this.bgScale, this.atlasName, "restroomStall2Closed").setOrigin(0.5, 0).setScale(this.bgScale);
        this.stall2DoorOpened = this.add.image(861 * this.bgScale, 240 * this.bgScale, this.atlasName, "restroomStall2Opened").setOrigin(0.5, 0).setScale(this.bgScale);
        this.createToggle(this.stall2DoorClosed, "oppositeRestroomStall2DoorClosed", this.stall2DoorOpened, "oppositeRestroomStall2DoorOpened", true);
        this.stall2DoorClosed.setFlipX(true);
        this.stall2DoorOpened.setFlipX(true);
        

        // Telefono del jugador
        let nodes = this.cache.json.get("restroomBreakDay4");
        let phoneNode = this.localizationManager.readNodes(this, nodes, "day4\\restroomBreakDay4", "phone");

        this.phone = this.add.image(2100 * this.bgScale, 1280 * this.bgScale, this.atlasName, "stolenPhone").setOrigin(0, 0).setScale(this.bgScale * 1.7);
        this.setInteractive("stolenPhone", this.phone, () => {
            this.localizationManager.setNode(phoneNode);
        });

        
        this.dispatcher.addOnce("pickPhone", this, (obj) => {
            this.phone.disableInteractive();
            fadeAnimation(this.phone, false, 200);
        })
    }
}