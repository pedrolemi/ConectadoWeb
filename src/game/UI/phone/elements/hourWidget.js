import TextArea from "../../../../framework/UI/textArea.js";
import ConectadoEventNames from "../../../eventNames.js";

export default class HourWidget {
    /**
    * Clase para el texto de la hora y el dia del movil
    * @param {BaseScene} scene - escena en la que esta el movil (idealmente la UI)
    * @param {BaseScreen} screen - pantalla del movil en la que esta la hora
    * @param {Number} x - posicion x del punto central del texto
    * @param {Number} y - posicion y del punto central del texto
    * @param {Number} maxWidth - ancho maximo del texto
    * @param {Number} maxHeight - alto maximo del texto
    * @param {Object} textConfig - configuracion del texto
    */
    constructor(scene, screen, x, y, maxWidth, maxHeight, textConfig) {
        let dispatcher = scene.dispatcher;
        let localizationManager = scene.localizationManager;

        const TEXT_OFFSET = 110;

        let hourText = new TextArea(scene, x, y, maxWidth, maxHeight, "hour", textConfig, 0.5, 0);
        hourText.setFontSize(100);
        hourText.adjustFontSize();

        let dayText = new TextArea(scene, x, y + TEXT_OFFSET, maxWidth, maxHeight, "day", textConfig, 0.5, 0);
        dayText.setFontSize(25);
        dayText.adjustFontSize();


        // Cuando llega el evento de empezar el dia
        dispatcher.add(ConectadoEventNames.startDay, this, () => {
            // Cambia el texto del dia al del dia actual
            let text = localizationManager.translate("clock.days", screen.namespace);
            dayText.setText(text[scene.gameManager.day - 1]);
            dayText.adjustFontSize();

            // Cambia el texto de la hora a la hora de la alarma
            text = localizationManager.translate("clock.alarmHour", screen.namespace);
            hourText.setText(text);
            hourText.adjustFontSize();
        });

        // Cuando llega el evento de cambiar la hora, cambia el texto de la hora por el de la id indicada
        dispatcher.add(ConectadoEventNames.changeHour, this, (hourId) => {
            let text = localizationManager.translate("clock." + hourId, screen.namespace);
            hourText.setText(text);
            hourText.adjustFontSize();
        });

        screen.add(hourText);
        screen.add(dayText);
    }
}