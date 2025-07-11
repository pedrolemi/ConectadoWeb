import ConectadoBaseScene from "../conectadoBaseScene.js";
import Grid from "../../../framework/UI/grid.js";

import xApiTracker from "../../../framework/lib/xApiTracker.js";

export default class LanguageMenu extends ConectadoBaseScene {
    /**
    * Escena que muestra el menu de selección de idioma
    * @extends ConectadoBaseScene
    */
    constructor() {
        super("LanguageMenu",);
    }

    create() {
        super.create();

        // Fondo escalado en cuanto al canvas
        let bg = this.add.image(0, 0, "basePC").setOrigin(0, 0);
        let scale = this.CANVAS_WIDTH / bg.width;
        bg.setScale(scale);

        // Pantalla del ordenador con el tam del canvas
        let screen = this.add.image(0, 0, "PCscreen").setOrigin(0, 0);
        screen.setDisplaySize(this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

        // Se crea una cuadricula para organizar los botones de idioma
        let grid = new Grid(this, 115, 60, 923, 590, 3, 2, 20);

        grid.addItem(this.createFlagButton("es", "es"));
        grid.addItem(this.createFlagButton("fr", "fr"));
        grid.addItem(this.createFlagButton("en", "en"));

        grid.addItem(this.createFlagButton("pt-br", "pt-BR"));
        grid.addItem(this.createFlagButton("cn-cn", "cn-CN"));
        grid.addItem(this.createFlagButton("cn-hk", "cn-HK"));
    }

    /**
    * Crea un boton interactivo con una bandera para seleccionar el idioma
    * 
    * @param {String} frame - nombre del frame (pais) dentro del atlas
    * @param {String} language - codigo del idioma que se activara al hacer clic
    * @param {Number} scale - escala inicial del boton (opcional)
    * @returns {Phaser.GameObjects.Image} - boton interactivo de la bandera
    */
    createFlagButton(frame, language, scale = 1) {
        let animTime = 50;

        let button = this.add.image(0, 0, "flags", frame);
        this.setInteractive(button);

        button.on("pointerover", () => {
            this.tweens.add({
                targets: button,
                scale: scale * 1.1,
                duration: animTime,
                repeat: 0,
            });
        });

        button.on("pointerout", () => {
            this.tweens.add({
                targets: button,
                scale: scale,
                duration: 0,
                repeat: 0,
            });
        });

        button.on("pointerdown", () => {
            this.tweens.add({
                targets: button,
                scale: scale,
                duration: 0,
                repeat: 0,
            });
            // TRACKER EVENT
            xApiTracker.alternativeTracker.Selected("language", language, JSTracker.ALTERNATIVETYPE.MENU);

            this.localizationManager.changeLanguage(language);
            this.gameManager.startMainMenu();
        });
        return button;
    }
}