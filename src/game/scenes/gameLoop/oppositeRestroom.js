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
        this.bg.flipX = true;


        // Puerta al pasillo
        this.corridorSceneName = params.corridor;

        this.oppositeRestroomDorClosed = this.add.image(1353 * this.bgScale, 168 * this.bgScale, this.atlasName, "restroomDoorClosed").setOrigin(0, 0).setScale(this.bgScale);
        this.oppositeRestroomDorOpened = this.add.image(1353 * this.bgScale, 168 * this.bgScale, this.atlasName, "restroomDoorOpened").setOrigin(0, 0).setScale(this.bgScale);
        // Al hacer click, se pasara a la escena del pasillo sin eliminar esta escena
        this.createToggle(this.oppositeRestroomDorClosed, "oppositeRestroomDorClosed", this.oppositeRestroomDorOpened, "oppositeRestroomDorOpened", false, () => {
            let params = {
                camPos: ConectadoBaseScene.CAM_POS_LEFT,
                corridor: this
            }
            this.gameManager.changeScene(this.corridorSceneName, params, false, true);
        });


        // Puerta del segundo cubiculo
        this.stall2DoorClosed = this.add.image(593 * this.bgScale, 244 * this.bgScale, this.atlasName, "restroomStall2Closed").setOrigin(0.5, 0).setScale(this.bgScale);
        this.stall2DoorOpened = this.add.image(861 * this.bgScale, 240 * this.bgScale, this.atlasName, "restroomStall2Opened").setOrigin(0.5, 0).setScale(this.bgScale);
        this.createToggle(this.stall2DoorClosed, "stall2DoorClosed", this.stall2DoorOpened, "stall2DoorOpened", true);
        this.stall2DoorClosed.flipX = true;
        this.stall2DoorOpened.flipX = true;
        

        // Telefono del jugador
        let nodes = this.cache.json.get("restroomBreakDay4");
        let phoneNode = this.dialogManager.readNodes(this, nodes, "day4\\restroomBreakDay4", "phone");

        this.phone = this.add.image(2100 * this.bgScale, 1280 * this.bgScale, this.atlasName, "stolenPhone").setOrigin(0, 0).setScale(this.bgScale * 1.7);
        this.setInteractive("stolenPhone", this.phone, () => {
            this.dialogManager.setNode(phoneNode);
        });

        
        this.dispatcher.addOnce("pickPhone", this, (obj) => {
            this.phone.disableInteractive();
            this.tweens.add({
                targets: this.phone,
                alpha: { from: 1, to: 0 },
                duration: 200,
                repeat: 0,
            });
        })
    }
}