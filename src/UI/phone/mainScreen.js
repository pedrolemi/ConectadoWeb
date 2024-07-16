import BaseScreen from "./baseScreen.js";

export default class MainScreen extends BaseScreen {
    constructor(scene, phone, prevScreen) {
        super(scene, phone, 'mainScreenBg', prevScreen);

        // Configuracion de las posiciones y dimensiones
        this.ICON_SCALE = 0.45;
        this.ICON_Y = this.BG_Y * 1.1;

        // Se ponen las imagenes en la pantalla
        let statusButton = scene.add.image(this.BG_X - this.BG_X / 6, this.ICON_Y, 'statusIcon').setScale(this.ICON_SCALE);
        let chatButton = scene.add.image(this.BG_X, this.ICON_Y, 'chatIcon').setScale(this.ICON_SCALE);
        let settingsButton = scene.add.image(this.BG_X - this.BG_X / 6, this.ICON_Y * 1.25, 'settingsIcon').setScale(this.ICON_SCALE);

        // Se anaden las imagenes a la escena
        this.add(statusButton);
        this.add(chatButton);
        this.add(settingsButton);

        // Se anima y se da funcionalidad a los botones
        super.animateButton(statusButton, () => { phone.toStatusScreen(); });
        super.animateButton(chatButton, () => { phone.toMsgScreen(); });
        super.animateButton(settingsButton, () => { phone.toSettingsScreen(); });


        // Configuracion de texto para el reloj
        let hourTextConfig = { ...scene.textConfig };
        hourTextConfig.fontFamily = 'gidole-regular';
        hourTextConfig.fontSize = 100 + 'px';
        hourTextConfig.strokeThickness = 0;

        let dayTextConfig = { ...scene.textConfig };
        dayTextConfig.fontFamily = 'gidole-regular';
        dayTextConfig.strokeThickness = 0;

        // Crea el texto y lo anade a la escena
        this.hourText = scene.createText(this.BG_X, this.BG_Y * 0.65, "", hourTextConfig).setOrigin(0.5, 0.5);
        this.dayText = scene.createText(this.BG_X, this.BG_Y * 0.8, "", dayTextConfig).setOrigin(0.5, 0.5);


        // Crea el icono de las notificaciones
        let notifObj = phone.phoneManager.createNotification(chatButton.x + chatButton.displayWidth / 3, chatButton.y - chatButton.displayHeight / 3);
        this.notifications = notifObj.container;
        this.notificationText = notifObj.text;

        this.add(this.hourText);
        this.add(this.dayText);
        this.add(this.notifications);
    }


    /**
     * Cambia el texto del dia y la hora
     * @param {String} hour - hora
     * @param {String} dayText - informacion del dia
     */
    setDayInfo(hour, dayText) {
        if (hour !== "") {
            this.hourText.setText(hour);
        }
        if (dayText !== "") {
            this.dayText.setText(dayText);
        }
    }

    /**
     * Establece las notificaciones que hay
     * @param {Number} amount - numero de notificaciones a poner
     */
    setNotifications(amount) {
        // Si son mas de 0, activa las notificaciones y cambia el texto
        if (amount > 0) {
            this.notifications.visible = true;
            this.notificationText.setText(amount);
        }
        // Si no, las desactiva
        else {
            this.notifications.visible = false;
            this.notificationText.setText("");
        }
    }
}