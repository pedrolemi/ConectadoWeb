import BaseScreen from "./baseScreen.js";
import { growAnimation } from "../../../framework/utils/graphics.js";
import HourWidget from "./elements/hourWidget.js";
import NotificationIcon from "./elements/notificationIcon.js";

export default class MainScreen extends BaseScreen {
    /**
    * Clase para la pantalla de "ajustes" del movil (para salir a la pantalla de inicio)
    * @extends BaseScreen 
    * @param {BaseScene} scene - escena en la que esta el movil (idealmente la UI)
    * @param {Phone} phone - movil
    * @param {BaseScreen} prevScreen - pantalla a la que se ira desde esta al pulsar el boton de volver
    */
    constructor(scene, phone, prevScreen) {
        super(scene, phone, "mainScreenBg", prevScreen);

        // Texto con la hora y el dia
        let textConfig = { ... this.DEFAULT_TEXT_CONFIG };
        textConfig.fontStyle = "bold";
        new HourWidget(scene, this, this.BG_X, this.BG_Y * 0.55, this.bg.displayWidth, this.bg.displayHeight, textConfig);

        // Configuracion de las posiciones y dimensiones
        this.ICON_SCALE = 0.45;
        this.ICON_Y = this.BG_Y * 1.1;

        // Se ponen las imagenes en la pantalla
        let statusButton = scene.add.image(this.BG_X - this.BG_X / 6, this.ICON_Y, "phoneElements", "statusIcon").setScale(this.ICON_SCALE);
        let chatButton = scene.add.image(this.BG_X, this.ICON_Y, "phoneElements", "chatIcon").setScale(this.ICON_SCALE);
        let settingsButton = scene.add.image(this.BG_X - this.BG_X / 6, this.ICON_Y * 1.25, "phoneElements", "settingsIcon").setScale(this.ICON_SCALE);

        growAnimation(statusButton, statusButton, () => {
            phone.toStatusScreen();
        }, true, false, 1.1, true, 50);

        growAnimation(chatButton, chatButton, () => {
            phone.toMsgListScreen();
        }, true, false, 1.1, true, 50);

        growAnimation(settingsButton, settingsButton, () => {
            phone.toSettingsScreen();
        }, true, false, 1.1, true, 50);

        this.notifications = new NotificationIcon(scene, chatButton.x + chatButton.displayWidth / 3, chatButton.y - chatButton.displayHeight / 3);
        
        this.add(statusButton);
        this.add(chatButton);
        this.add(settingsButton);
        this.add(this.notifications);
    }

}