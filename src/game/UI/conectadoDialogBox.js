import DialogBox from "../../framework/UI/dialogBox.js";

export default class ConectadoDialogBox extends DialogBox {
    constructor(scene) {
        const PADDING = 10;

        let TEXTBOX_CONFIG = {
            imgAtlas: "dialogs",
            img: "textbox",
            imgX: scene.CANVAS_WIDTH / 2,
            imgY: scene.CANVAS_HEIGHT - PADDING,
            imgOriginY: 1,

            textX: 110,
            textY: 660,
            
            realWidth: (scene.CANVAS_WIDTH - PADDING) / 1.3,
            realHeight: 120,
        }
        let NAMEBOX_CONFIG = {
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
        let TEXT_CONFIG = {
            fontFamily: "Arial",
            fontSize: 25,
            fontStyle: "bold",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 5,
            align: "left",
        }
        let nameTextConfig = { ...TEXT_CONFIG };
        
        super(scene, TEXTBOX_CONFIG, NAMEBOX_CONFIG, TEXT_CONFIG, nameTextConfig);

        let horizontalScale = (this.CANVAS_WIDTH - PADDING * 2) / this.box.displayWidth;
        this.box.setScale(horizontalScale, 1);
        this.nameBox.setScale(horizontalScale, 1)

        // this.calculateRectangleSize();

        this.createMask();
        this.portraitsIds = new Set();

        this.PORTRAIT_TEXT_X = 220;
        this.PORTRAIT_TEXT_WIDTH = this.textboxConfig.realWidth - (this.PORTRAIT_TEXT_X - this.textboxConfig.textX);
    }

    createMask() {
        // Mascara para los retratos de los personajes (para que no se pinten fuera de la caja de texto)
        let mask = this.scene.add.image(this.box.x, this.box.y, "textboxMask");
        mask.setOrigin(this.box.originX, this.box.originY);
        mask.setScale(this.box.scaleX, this.box.scaleY);
        mask.setCrop(0, 0, 160, mask.displayHeight);
        mask.visible = false;

        return mask.createBitmapMask();
    }
    
    /**
    * Anade la id de un personaje con retrato
    * @param {string} id - id del personaje con retrato 
    */
    addPortrait(id) {
        this.portraitsIds.add(id);
    }
    /**
    * Elimina la id de un personaje del set de personajes con retratos
    * @param {string} id - id del personaje 
    */
    removePortrait(id) {
        this.portraitsIds.delete(id);
    }
    
    setDialog(name, character, text, centered, animate = true) {
        super.setDialog(name, character, text, centered, animate);

        // Si el texto no esta centrado
        if (!centered) {
            // Si el personaje que habla tiene retrato, se mueve el texto a la derecha y se ajusta su ancho
            if (this.portraitsIds.has(this.lastCharacter)) {
                this.textObj.setPosition(this.PORTRAIT_TEXT_X, this.textboxConfig.textY);
                
                if (this.textboxConfig.useAdvancedWrap) {
                    this.textObj.style.wordWrapWidth = this.PORTRAIT_TEXT_WIDTH;
                }
            }
            // En caso contrario, se restaura el ancho original y el setDialog base se encarga de colocar el texto en la posicion correspondiente 
            else {
                this.textObj.style.wordWrapWidth = this.textboxConfig.realWidth
            }
        }
    }
}