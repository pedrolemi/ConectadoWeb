import BaseScreen from "./baseScreen.js";
import Button from "../button.js"

export default class SettingsScreen extends BaseScreen {
    constructor(scene, phone, prevScreen) {
        super(scene, phone, 'settingsBg', prevScreen);

        // Configuracion de texto para la advertencia
        let textConfig = { ...scene.textConfig };
        textConfig.fontFamily = 'gidole-regular';
        textConfig.fontSize = 40 + 'px';
        textConfig.align = 'center';
        textConfig.wordWrap = {
            width: this.bg.displayWidth,
            useAdvancedWrap: true
        }

        // Se coge el texto del archivo de traducciones y se pone en pantalla 
        let text = this.i18next.t("settings.text", { ns: "phone", context: this.gameManager.getUserInfo().gender })
        let warningText = scene.createText(this.BG_X, this.BG_Y * 0.65, text, textConfig).setOrigin(0.5, 0.5);

        // Configuracion de texto y colores del boton
        let buttonTextConfig = { font: 'gidole-regular', size: 45, style: 'bold', color: '#000' }
        let normalColor = { R: 255, G: 255, B: 255 };
        let hoverColor = { R: 64, G: 142, B: 134 };
        let pressedColor = { R: 200, G: 200, B: 200 }

        // Se coge el texto de los botones del archivo de traducciones y crea los botones
        let yesText = this.i18next.t("settings.yes", { ns: "phone" })
        let yesButton = new Button(scene, this.BG_X, this.BG_Y * 1.1, 1,
            () => {
                this.gameManager.startLangMenu();
            },
            this.gameManager.textBox.fillName, normalColor, hoverColor, pressedColor,
            yesText, buttonTextConfig, this.gameManager.textBox.edgeName,
            {
                // La textura generada con el objeto grafico es un pelin mas grande que el dibujo en si. Por lo tanto,
                // si la caja de colision por defecto es un pelin mas grande. Es por eso que se pasa una que se ajuste
                // a las medidas reales
                area: new Phaser.Geom.Rectangle(this.gameManager.textBox.offset, this.gameManager.textBox.offset, this.gameManager.textBox.width, this.gameManager.textBox.height),
                callback: Phaser.Geom.Rectangle.Contains
            }
        );
        let noText = this.i18next.t("settings.no", { ns: "phone" })
        let noButton = new Button(scene, this.BG_X, this.BG_Y * 1.4, 1,
            () => {
                phone.toPrevScreen();
            },
            this.gameManager.textBox.fillName, normalColor, hoverColor, pressedColor,
            noText, buttonTextConfig, this.gameManager.textBox.edgeName,
            {
                // La textura generada con el objeto grafico es un pelin mas grande que el dibujo en si. Por lo tanto,
                // si la caja de colision por defecto es un pelin mas grande. Es por eso que se pasa una que se ajuste
                // a las medidas reales
                area: new Phaser.Geom.Rectangle(this.gameManager.textBox.offset, this.gameManager.textBox.offset, this.gameManager.textBox.width, this.gameManager.textBox.height),
                callback: Phaser.Geom.Rectangle.Contains
            }
        );

        yesButton.setScale(0.9, 1);
        noButton.setScale(0.9, 1);

        this.add(yesButton);
        this.add(noButton);
        this.add(warningText);
    }
}