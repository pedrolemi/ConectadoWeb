import BaseScreen from "./baseScreen.js";
import TextArea from "../../../framework/UI/textArea.js";
import RectTextButton from "../../../framework/UI/rectTextButton.js";
import { tintAnimation } from "../../../framework/utils/graphics.js";

export default class SettingsScreen extends BaseScreen {
    /**
    * Clase para la pantalla de "ajustes" del movil (para salir a la pantalla de inicio)
    * @extends BaseScreen 
    * @param {BaseScene} scene - escena en la que esta el movil (idealmente la UI)
    * @param {Phone} phone - movil
    * @param {BaseScreen} prevScreen - pantalla a la que se ira desde esta al pulsar el boton de volver
    */
    constructor(scene, phone, prevScreen) {
        super(scene, phone, "settingsBg", prevScreen);

        let textConfig = { ... this.DEFAULT_TEXT_CONFIG };
        textConfig.fontSize = 45;
        textConfig.stroke = "#000000";
        textConfig.strokeThickness = 7;
        textConfig.fontStyle = "bold";
        textConfig.wordWrap = {
            width: this.bg.displayWidth,
            useAdvancedWrap: true
        }
        // Texto del mensaje
        let text = new TextArea(scene, this.BG_X, this.BG_Y - this.bg.displayWidth / 2, this.bg.displayWidth, this.bg.displayHeight / 3,
            this.localizationManager.translate("settings.text", this.namespace), textConfig);
        text.adjustFontSize();


        // Botones
        let buttonTextConfig = { ...textConfig };
        buttonTextConfig.color = "#000000";
        buttonTextConfig.strokeThickness = 0;
        buttonTextConfig.wordWrap = null;

        const BUTTON_X = this.BG_X;
        const BUTTON_W = 300;
        const BUTTON_H = 75;

        let y = this.BG_Y * 1.1;
        let yesButton = new RectTextButton(scene, BUTTON_X, y, BUTTON_W, BUTTON_H, this.localizationManager.translate("settings.yes", this.namespace), buttonTextConfig,
            () => { }, "menuButton", 0.5, 0.5, 15, 0xffffff, 1, 1, 0x0, 1);
        tintAnimation(yesButton, yesButton.list, () => {
            scene.gameManager.startLanguageMenu();
        }, true, false, 0xffffff, 0x408e86, 0xc8c8c8);

        y += yesButton.displayHeight * 1.5;
        let noButton = new RectTextButton(scene, BUTTON_X, y, BUTTON_W, BUTTON_H, this.localizationManager.translate("settings.no", this.namespace), buttonTextConfig,
            () => { }, "menuButton", 0.5, 0.5, 15, 0xffffff, 1, 1, 0x0, 1);
        tintAnimation(noButton, noButton.list, () => {
            phone.toPrevScreen();
        }, true, false, 0xffffff, 0x408e86, 0xc8c8c8);

        this.add(text);
        this.add(yesButton);
        this.add(noButton);
    }
}