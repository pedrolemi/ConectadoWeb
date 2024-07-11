import BaseScreen from "./baseScreen.js";

export default class MainScreen extends BaseScreen {
    constructor(scene, phone, bgImage, prevScreen) {
        super(scene, phone, bgImage, prevScreen);

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
        super.animateButton(statusButton,() => { phone.toStatusScreen(); });
        super.animateButton(chatButton, () => { phone.toMsgScreen(); });
        super.animateButton(settingsButton, () => { phone.toSettingsScreen(); });


        // Configuracion de texto para el reloj
        let hourTextConfig = { ...scene.textConfig };
        hourTextConfig.fontFamily = 'gidole-regular';
        hourTextConfig.fontSize = 100 + 'px';
        hourTextConfig.strokeThickness = 0;

        let dayTextConfig  = { ...scene.textConfig };
        dayTextConfig.fontFamily = 'gidole-regular';
        dayTextConfig.strokeThickness = 0;

        // Crea el texto y lo anade a la escena
        this.hourText = scene.createText(this.BG_X, this.BG_Y * 0.65, "", hourTextConfig).setOrigin(0.5, 0.5);
        this.dayText = scene.createText(this.BG_X, this.BG_Y * 0.8, "", dayTextConfig).setOrigin(0.5, 0.5);

        this.add(this.hourText);
        this.add(this.dayText);
    }

    
    /**
     * Cambia el texto del dia y la hora
     * @param {String} hour - Hora
     * @param {String} dayText - Informacion del dia
     */
    setDayInfo(hour, dayText) {
        this.hourText.setText(hour);
        this.dayText.setText(dayText);
    }

    
}