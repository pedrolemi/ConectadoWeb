import BaseScreen from "./baseScreen.js";
import TextArea from "../../../framework/UI/textArea.js";
import StatusBar from "./elements/statusbar.js";

export default class StatusScreen extends BaseScreen {
    /**
    * Clase para la pantalla de "ajustes" del movil (para salir a la pantalla de inicio)
    * @extends BaseScreen 
    * @param {BaseScene} scene - escena en la que esta el movil (idealmente la UI)
    * @param {Phone} phone - movil
    * @param {BaseScreen} prevScreen - pantalla a la que se ira desde esta al pulsar el boton de volver
    */
    constructor(scene, phone, prevScreen) {
        super(scene, phone, "statusBg", prevScreen);

        let textConfig = { ... this.DEFAULT_TEXT_CONFIG };
        textConfig.fontFamily = "gidolinya-regular";
        textConfig.fontSize = 30;

        let title = new TextArea(scene, this.BG_X, this.BG_Y * 0.37, this.bg.displayWidth, this.bg.displayHeight / 3,
            this.localizationManager.translate("statusScreen.title", this.namespace), textConfig);
        title.adjustFontSize();

        let subtitle = new TextArea(scene, this.BG_X, this.BG_Y * 0.61, this.bg.displayWidth, this.bg.displayHeight / 3,
            this.localizationManager.translate("statusScreen.subtitle", this.namespace), textConfig);
        subtitle.adjustFontSize();

        this.add(title);
        this.add(subtitle)

        // Barra con la media de todas las barras
        const AVERAGE_BAR_NAME = "Average";
        this.averageBar = new StatusBar(scene, this, this.BG_X, this.BG_Y / 2.05, 170, 30, AVERAGE_BAR_NAME, "averageStatusBar");

        // Mapa que asocia la barra de cada personaje con su nombre
        this.bars = new Map([
            ["Alison", null],
            ["Alex", null],
            ["Guille", null],
            ["Ana", null],
            ["Maria", null],
            ["Jose", null],
            ["Parents", null],
            ["Teacher", null],
        ]);

        const BAR_W = 140;
        const BAR_H = 15;
        const START_X = this.BG_X;
        const START_Y = this.BG_Y * 0.74;
        const BAR_OFFSET_X = 75;
        const BAR_OFFSET_Y_1 = 45;
        const BAR_OFFSET_Y_2 = 50;

        // Se crean las barras de cada personaje
        let i = 0;
        let yOffset = 0;
        this.bars.forEach((value, key) => {
            let x = (i % 2 == 0) ? START_X : START_X + BAR_OFFSET_X;
            this.bars.set(key, new StatusBar(scene, this, x, START_Y + yOffset, BAR_W, BAR_H, key));
            yOffset += (i % 2 == 0) ? BAR_OFFSET_Y_1 : BAR_OFFSET_Y_2;
            i++;
        });


        // Cuando llega el evento de actualizar la amistad
        this.dispatcher.add("changeFriendship", this, (obj) => {
            let bar = this.bars.get(obj.character);

            // Si el personaje esta en el mapa de barras
            if (bar != null) {
                // Se actualiza el valor de la barra
                bar.updateValue(obj.value);

                // Se calcula el valor medio de todas las barras y se actualiza el color de la barra de medias
                let total = 0;
                this.bars.forEach((value, key) => {
                    total += scene.gameManager.blackboard.get(key + "FS");
                });
                total /= this.bars.size;
                scene.gameManager.blackboard.set(AVERAGE_BAR_NAME + "FS", total);
                this.averageBar.updateBarColor();
            }
        });
    }
}