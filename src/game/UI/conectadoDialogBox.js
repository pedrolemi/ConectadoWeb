import DialogBox from "../../framework/UI/dialogBox.js";

export default class ConectadoDialogBox extends DialogBox {
    constructor(scene) {
        let PADDING = 10;

        let textboxConfig = {
            imgAtlas: "dialogs",
            img: "textbox",
            imgX: scene.CANVAS_WIDTH / 2,
            imgY: scene.CANVAS_HEIGHT - PADDING,
            imgOriginY: 1,

            textX: 110,
            textY: 660,
            
            realWidth: (scene.CANVAS_WIDTH - PADDING) / 1.3,
            realHeight: 135,
        }
        let nameBoxConfig = {
            imgAtlas: "dialogs",
            img: "textboxName",
            imgX: scene.CANVAS_WIDTH / 2,
            imgY: scene.CANVAS_HEIGHT - PADDING,
            imgOriginY: 1,
            
            textX: 290,
            textY: 622,

            realWidth: 220,
            realHeight: 50,
        }
        let textConfig = {
            fontFamily: "Arial",
            fontSize: 25,
            fontStyle: "bold",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 5,
            align: "left",
        }
        let nameTextConfig = { ...textConfig };
        
        super(scene, textboxConfig, nameBoxConfig, textConfig, nameTextConfig);

        let horizontalScale = (this.CANVAS_WIDTH - PADDING * 2) / this.box.displayWidth;
        this.box.setScale(horizontalScale, 1);
        this.nameBox.setScale(horizontalScale, 1)

        this.calculateRectangleSize();
    }
}