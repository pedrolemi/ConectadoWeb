import ConectadoBaseScene from "../conectadoBaseScene.js";
import Button from "../../../framework/UI/button.js"

export default class MainMenu extends ConectadoBaseScene {
    /**
    * Menu principal
    * @extends BaseScene
    */
    constructor() {
        super("MainMenu");
    }

    create() {
        super.create();

        // Fondo escalado en cuanto al canvas
        let bg = this.add.image(0, 0, "basePC").setOrigin(0, 0);
        let scale = this.CANVAS_WIDTH / bg.width;
        bg.setScale(scale);

        this.add.rectangle(this.CANVAS_WIDTH / 2, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT / 1.2, 0xFFFFFF).setOrigin(0.5, 0);

        // Pantalla del ordenador con el tam del canvas
        let screen = this.add.image(0, 0, "PCscreen").setOrigin(0, 0);
        screen.setDisplaySize(this.CANVAS_WIDTH, this.CANVAS_HEIGHT);


        this.TEXT_CONFIG = {
            fontFamily: "kimberley",
            fontSize: 57,
            fontStyle: "normal",
            color: "#004E46",
            align: "center",
        };
        let BUTTON_X = this.CANVAS_WIDTH / 2;
        let BUTTON_START_Y = 2 * this.CANVAS_HEIGHT / 3;
        let BUTTON_W = 300;
        let BUTTON_H = 75;

        let namespace = "menus\\titleMenu";


        // Boton de jugar
        let offset = 50;
        let playButton = new Button(this, BUTTON_X, BUTTON_START_Y - offset - 10, BUTTON_W, BUTTON_H);
        playButton.createRectButton(this.localizationManager.translate("playButton", namespace), this.TEXT_CONFIG, () => {
            this.gameManager.startLoginMenu();
        }, "menuButton", 15, 0xFFFFFF, 1, 1, 0x0, 1, 10, 10, 0, 0, 0.5, 0.5, 0.5, 0.5, 0xffffff, 0x408e86, 0xc8c8c8);

        // Boton de creditos
        let creditsButton = new Button(this, BUTTON_X, BUTTON_START_Y + offset, BUTTON_W, BUTTON_H);
        creditsButton.createRectButton(this.localizationManager.translate("creditsButton", namespace), this.TEXT_CONFIG, () => {
            this.gameManager.startCredits();
        }, "menuButton", 15, 0xFFFFFF, 1, 1, 0x0, 1, 10, 10, 0, 0, 0.5, 0.5, 0.5, 0.5, 0xffffff, 0x408e86, 0xc8c8c8);

        // Boton de salir
        let exitTextConfig = { ...this.TEXT_CONFIG };
        exitTextConfig.fontSize = '40px';
        exitTextConfig.color = '#004E46';
        let exitButton = new Button(this, 100, 3 * this.CANVAS_HEIGHT / 4 + 10, 220, 64);
        exitButton.createImgButton(this.localizationManager.translate("exitText", namespace), exitTextConfig, () => {
            this.gameManager.startLanguageMenu();
        }, "powerOff", 0.5, 0.5, 0.5, 0.5, 1, 0, 0, 160, 35, 0, 0.5, 0, 0, 0x408e86, 0x00685d, 0xc8c8c8);
        exitButton.image.setTint(0x00685d);

        // Logo
        offset = -20;
        let logo = this.add.image(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 3 + offset, "logoWT");
        logo.setScale(1.1);
    }
}