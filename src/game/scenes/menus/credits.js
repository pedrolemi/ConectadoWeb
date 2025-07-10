import ConectadoBaseScene from "../conectadoBaseScene.js";
import Button from "../../../framework/UI/button.js";

export default class Credits extends ConectadoBaseScene {
    /**
    * Creditos del juego
    * @extends ConectadoBaseScene
    */
    constructor() {
        super("Credits");
    }

    create(params) {
        super.create(params);

        let rect = this.add.rectangle(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT, 0xffffff, 1).setOrigin(0, 0);

        let namespace = "menus\\credits"


        // Padings laterales e inferiores de los botones y el logo del juego
        let sidePadding = 100;
        let bottomPadding = 40;


        this.TEXT_CONFIG = {
            fontFamily: "kimberley",
            fontSize: 40,
            fontStyle: "normal",
            color: "#004E46",
            align: "center",
        };

        

        let BUTTON_X = sidePadding;
        let BUTTON_START_Y = this.CANVAS_HEIGHT - bottomPadding;
        

        // Boton de salir
        let exitButton = this.createCreditsButtons(BUTTON_X, BUTTON_START_Y, this.localizationManager.translate("exitButton", namespace), () => {
            this.gameManager.startLanguageMenu();
        })

        // Boton de volver (solo aparece si se accede desde el menu principal)
        if (!params.endgame) {
            let y = BUTTON_START_Y - exitButton.displayHeight - bottomPadding / 2;
            let returnButton = this.createCreditsButtons(BUTTON_X, y, this.localizationManager.translate("returnButton", namespace), () => {
                this.gameManager.startMainMenu();
            });
        }

        // Logo del juego
        let gameLogo = this.add.image(this.CANVAS_WIDTH - sidePadding, this.CANVAS_HEIGHT - bottomPadding, "logoWT");
        gameLogo.setScale(0.32);
    }



    createCreditsButtons(x, y, text, callback) {
        let BUTTON_W = 160;
        let BUTTON_H = 40;

        let button = new Button(this, x, y, BUTTON_W, BUTTON_H);

        button.createRectButton(text, this.TEXT_CONFIG, callback, "creditsButton", 15, 0xFFF0F0F0, 1, 1, 0x0, 1, 0, 0, 0, 2, 0.5, 0.5, 0.5, 0.5, 0xffffff, 0x408e86, 0xc8c8c8);
        button.textObj.maxHeight *= 2;
        button.textObj.adjustFontSize();

        return button
    }
}