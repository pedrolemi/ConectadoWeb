import ConectadoBaseScene from "../conectadoBaseScene.js";
import { DEFAULT_TEXT_CONFIG } from "../../../framework/utils/graphics.js";
import TextArea from "../../../framework/UI/textArea.js";

export default class TextOnlyScene extends ConectadoBaseScene {
    /**
    * Escena para las transiciones en las que solo hay texto
    * DEBE IR DESPUES DE LA UI PARA PINTARSE POR ENCIMA DE ELLA
    * @extends ConectadoBaseScene
    */
    constructor() {
        super("TextOnlyScene");
    }

    /**
    * Crear los elementos de la escena
    * 
    * @param {Object} params - parametros de la escena. Debe contener text, onComplete y onCompleteDelay.
    * Como opcional, puede contener textConfig con la configuracion para el texto a mostrar
    * 
    * IMPORTANTE: Esta escena es general para todas las transiciones, por lo que hay que especificar
    * en los parametros tanto el texto que debera aparecer en la escena, como la funcion que se debe 
    * ejecutar una vez acabe la escena. Generalmente, en la funcion onComplete se llamaria al changeScene 
    * del gameManager con la siguiente escena, pero no se hace directamente porque dependiendo de la 
    * escena a la que se quiera cambiar, podria hacer falta pasarle unos parametros distintos   
    */
    create(params) {
        super.create(params);

        let text = "";
        let onComplete = () => { };
        let onCompleteDelay = 0;

        let textConfig = { ...DEFAULT_TEXT_CONFIG };
        textConfig.fontSize = 100;
        textConfig.align = "center";

        if (params.text) {
            text = params.text
        }
        if (params.onComplete) {
            onComplete = params.onComplete;
        }
        if (params.onCompleteDelay) {
            onCompleteDelay = params.onCompleteDelay;
        }
        if (params.textConfig) {
            textConfig.fontSize = params.fontSize
        }

        // Fondo negro 
        let bg = this.add.rectangle(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT, 0x000, 1).setOrigin(0, 0);

        // Se puede hacer click en la imagen de fondo una vez termine el fade in
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, (cam, effect) => {
            this.setInteractive(bg);
        });

        this.exiting = false;
        this.exit = () => {
            if (!this.exiting) {
                this.exiting = true;
                this.scene.setVisible(true, this.UIManager);
                setTimeout(onComplete, onCompleteDelay);
            }
        }

        // Se anade el evento de hacer click sobre el fondo para que solo se pueda ejecutar una vez.
        bg.once("pointerdown", this.exit);


        // Se calculan las dimensiones del texto, se crea, y se ajusta al tamano
        let PADDING = 50;
        let BOTTOM_PADDING = 10;

        let TEXT_WIDTH = this.CANVAS_WIDTH - PADDING * 2;
        let TEXT_HEIGHT = this.CANVAS_HEIGHT - BOTTOM_PADDING - PADDING;
        let TEXT_Y = BOTTOM_PADDING + (TEXT_HEIGHT) / 2;

        textConfig.wordWrap = {
            width: TEXT_WIDTH,
            useAdvancedWrap: true
        }
        let textObj = new TextArea(this, this.CANVAS_WIDTH / 2, TEXT_Y, TEXT_WIDTH, TEXT_HEIGHT, text, textConfig).setOrigin(0.5, 0.5);
        textObj.adjustFontSize();


        // Se crea el texto del mensaje de informacion
        textConfig.fontSize = 20;
        textConfig.align = "right";
        let infoTextObj = new TextArea(this, this.CANVAS_WIDTH - PADDING / 2, this.CANVAS_HEIGHT - PADDING / 2, 0, 0,
            this.localizationManager.translate("transitionInfo", "transitionScenes"), textConfig).setOrigin(1, 1);

        this.tweens.add({
            targets: infoTextObj,
            alpha: { from: 1, to: 0.3 },
            repeat: -1,
            yoyo: true
        });
    }
}