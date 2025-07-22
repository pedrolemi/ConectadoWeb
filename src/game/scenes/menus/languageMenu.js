import ConectadoBaseScene from "../conectadoBaseScene.js";
import Grid from "../../../framework/UI/grid.js";
import { growAnimation } from "../../../framework/utils/graphics.js";

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

        this.add.rectangle(this.CANVAS_WIDTH / 2, 10, this.CANVAS_WIDTH - 20, this.CANVAS_HEIGHT / 1.2, 0xFF2B9E9E, 1).setOrigin(0.5, 0);

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

        let button = this.add.image(0, 0, "flags", frame).setScale(scale);
        growAnimation(button, button, () => {
            // TRACKER EVENT
            this.trackerManager.sendSelectLanguage(language);

            this.localizationManager.changeLanguage(language);
            this.gameManager.startMainMenu();
        }, true, false, 1.1, true, animTime);
        
        return button;
    }
}