import TextArea from "../../../framework/UI/textArea.js";
import BaseScreen from "./baseScreen.js";

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

        // Texto de la pantalla
        let alarmText = new TextArea(scene, this.BG_X, this.BG_Y - this.bg.displayWidth / 2, this.bg.displayWidth, this.bg.displayHeight / 3,
            this.localizationManager.translate("settings.text", this.namespace), this.DEFAULT_TEXT_CONFIG);
        alarmText.adjustFontSize();

        console.log("aaa")
        console.log(this.localizationManager.translate("settings.text", this.namespace))
    }
}