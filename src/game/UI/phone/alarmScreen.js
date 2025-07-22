import TextArea from "../../../framework/UI/textArea.js";
import BaseScreen from "./baseScreen.js";
import { setInteractive } from "../../../framework/utils/misc.js";
import { growAnimation } from "../../../framework/utils/graphics.js";
import ConectadoEventNames from "../../eventNames.js";

export default class AlarmScreen extends BaseScreen {
    /**
    * Clase para la pantalla de la alarma
    * @extends BaseScreen 
    * @param {BaseScene} scene - escena en la que esta el movil (idealmente la UI)
    * @param {Phone} phone - movil
    * @param {BaseScreen} prevScreen - pantalla a la que se ira desde esta al pulsar el boton de volver
    */
    constructor(scene, phone, prevScreen) {
        super(scene, phone, "alarmBg", prevScreen);

        // Crea los textos
        let alarmText = new TextArea(scene, this.BG_X, this.BG_Y * 0.4, this.bg.displayWidth, this.bg.displayHeight,
            this.localizationManager.translate("alarm.title", this.namespace), this.DEFAULT_TEXT_CONFIG, 0.5, 0);
        alarmText.adjustFontSize();

        this.hourText = new TextArea(scene, this.BG_X, this.BG_Y * 0.55, this.bg.displayWidth, this.bg.displayHeight, "hour", this.DEFAULT_TEXT_CONFIG, 0.5, 0);
        this.hourText.setFontSize(100);
        this.hourText.adjustFontSize();

        this.dayText = new TextArea(scene, this.BG_X, this.BG_Y * 0.8, this.bg.displayWidth, this.bg.displayHeight, "day", this.DEFAULT_TEXT_CONFIG, 0.5, 0);
        this.dayText.setFontSize(25);
        this.dayText.adjustFontSize();


        // Se crea la imagen del deslizable
        let scrollable = scene.add.image(this.BG_X, this.BG_Y + 78, "phoneElements", "homeButton");
        setInteractive(scrollable, { draggable: true });
        scrollable.setInteractive();

        // Limites de hasta donde se puede deslizar el icono
        let leftBound = this.BG_X - this.bg.displayWidth / 2 + scrollable.displayWidth / 2 + 5;
        let rightBound = this.BG_X + this.bg.displayWidth / 2 - scrollable.displayWidth / 2 - 10;

        // Bloquea el deslizamiento para que solo se pueda mover horizontalmente hasta los limites
        scrollable.on("drag", (pointer, dragX, dragY) => {
            dragX = Phaser.Math.Clamp(dragX, leftBound, rightBound);
            scrollable.x = dragX
        });

        // Cuando se deja de deslizar,
        scrollable.on("dragend", () => {
            // Si se ha deslizado hasta la izquierda, envia el evento de retrasar la alarma 
            if (scrollable.x === leftBound) {
                this.dispatcher.dispatch(ConectadoEventNames.tryDelayingAlarm, null);
            }
            // Si se ha deslizado hasta la derecha, envia el evento de despertarse
            else if (scrollable.x === rightBound) {
                this.dispatcher.dispatch(ConectadoEventNames.wakeUp, null);
            }

            // Se pone el icono de nuevo en su posicion original
            scrollable.x = this.BG_X;
        });

        let ALARM_ICONS_SCALE = 0.2;
        let ICON_OFFSET_X = this.bg.displayWidth / 4 + 25;
        let ICON_POS_Y = this.BG_Y + 78;

        let sleepIcon = scene.add.image(this.BG_X - ICON_OFFSET_X, ICON_POS_Y, "phoneElements", "sleepIcon").setScale(ALARM_ICONS_SCALE);
        let wakeUpIcon = scene.add.image(this.BG_X + ICON_OFFSET_X, ICON_POS_Y, "phoneElements", "wakeUpIcon").setScale(ALARM_ICONS_SCALE);

        growAnimation(sleepIcon, sleepIcon, () => {
            this.dispatcher.dispatch(ConectadoEventNames.tryDelayingAlarm, null);
        }, true, false, 1.1, true, 50);
        growAnimation(wakeUpIcon, wakeUpIcon, () => {
            this.dispatcher.dispatch(ConectadoEventNames.wakeUp, null);
        }, true, false, 1.1, true, 50);

        this.configureEvents();

        this.add(alarmText);
        this.add(this.hourText)
        this.add(this.dayText);
        this.add(scrollable);
        this.add(sleepIcon);
        this.add(wakeUpIcon);

        this.bringToTop(scrollable);
    }

    setVisible(visible) {
        super.setVisible(visible);

        // Se ocultan los botones inferiores
        if (visible) {
            this.phone.buttons.setVisible(false);
        }
    }


    configureEvents() {
        // Cuando llega el evento de empezar el dia
        this.dispatcher.add(ConectadoEventNames.startDay, this, () => {
            // Cambia el texto del dia al del dia actual
            let text = this.localizationManager.translate("clock.days", this.namespace);
            this.dayText.setText(text[this.scene.gameManager.day - 1]);
            this.dayText.adjustFontSize();

            // Cambia el texto de la hora a la hora de la alarma
            text = this.localizationManager.translate("clock.alarmHour", this.namespace);
            this.hourText.setText(text);
            this.hourText.adjustFontSize();
        });

        // Cuando llega el evento de cambiar la hora, cambia el texto de la hora por el de
        // quedarse dormido (en esta pantalla no puede haber otros cambios de hora, por lo
        // que se usa directamente la hora de quedarse dormido sin tener que coger la id)
        this.dispatcher.add(ConectadoEventNames.changeHour, this, (hourId) => {
            let text = this.localizationManager.translate("clock.alarmLateHour", this.namespace);
            this.hourText.setText(text);
            this.hourText.adjustFontSize();
        });
    }
}