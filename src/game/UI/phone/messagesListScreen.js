import TextArea from "../../../framework/UI/textArea.js";
import BaseScreen from "./baseScreen.js";

export default class MessagesListScreen extends BaseScreen {
    /**
    * Clase para la pantalla de "ajustes" del movil (para salir a la pantalla de inicio)
    * @extends BaseScreen 
    * @param {BaseScene} scene - escena en la que esta el movil (idealmente la UI)
    * @param {Phone} phone - movil
    * @param {BaseScreen} prevScreen - pantalla a la que se ira desde esta al pulsar el boton de volver
    */
    constructor(scene, phone, prevScreen) {
        super(scene, phone, "messagesBg", prevScreen);

        let textConfig = { ... this.DEFAULT_TEXT_CONFIG };
        textConfig.fontFamily = "Arial";
        textConfig.fontStyle = 'bold';
        textConfig.color = "#0";

        // Texto del titulo de la pantalla
        let title = new TextArea(scene, this.BG_X, this.BG_Y * 0.365, this.bg.displayWidth, this.bg.displayHeight,
            this.localizationManager.translate("textMessages.title", this.namespace), textConfig);
        title.adjustFontSize();

        this.add(title);
    }

}