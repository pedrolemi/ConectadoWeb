import BaseScene from './baseScene.js';

export default class TextOnlyScene extends BaseScene {
    /**
     * Escena para las transiciones en las que solo hay texto,  
     * @extends Phaser.Scene
     */
    constructor() {
        super('TextOnlyScene');
    }

    onCreate(params) {
        super.onCreate(params);

        let DEFAULT_TIME = 5000;
        setTimeout(() => {
            if (!this.exiting) {
                this.exiting = true;
                this.cameras.main.fadeOut(this.FADE_TIME, 0, 0, 0);
            }
        }, DEFAULT_TIME);
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

        let PADDING = 50;

        let text = "";
        let onComplete = () => { };
        let onCompleteDelay = 0;

        // Configuracion de texto
        let fontSize = 100;
        let textConfig = { ...this.gameManager.textConfig };
        // textConfig.fontFamily = 'gidole-regular';
        textConfig.fontSize = fontSize + 'px';
        textConfig.align = 'center';
        textConfig.wordWrap = {
            width: this.CANVAS_WIDTH - PADDING * 2,
            useAdvancedWrap: true
        }

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
            // Parsea el string del tamano de fuente. El 10 indica que se parsea en base 10
            fontSize = parseInt(params.fontSize, 10);
            textConfig = params.textConfig;
        }

        // Hace invisible el UIManager entero
        this.scene.setVisible(false, this.UIManager);

        // Establece las animaciones de fade in y fade out
        this.FADE_TIME = 300;
        this.cameras.main.fadeIn(this.FADE_TIME, 0, 0, 0);
        // Una vez terminado el fade out, se vuelve a hacer visible el UIManager 
        // y se llama a la funcion que se haya pasado por los parametros
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            setTimeout(() => {
                this.scene.setVisible(true, this.UIManager);
                onComplete();
            }, onCompleteDelay);
        });

        // Anade la imagen del fondo 
        let bg = this.add.rectangle(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT, 0x000, 1).setOrigin(0, 0);

        // Se puede hacer click en la imagen de fondo una vez termine el fade in
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, (cam, effect) => {
            bg.setInteractive();
        });

        this.exiting = false;
        // Se anade el evento de hacer clicke sobre el fondo para que solo se pueda ejecutar una vez.
        // Si no se hace click sobre el fondo, se pone un temporizador para que haga fade out 
        // automaticamente tras un tiempo. El temporizador empezara cuando la escena este creada
        bg.once('pointerdown', (pointer) => {
            // Al hacer click en la imagen del fondo, comienza el fade out
            if (!this.exiting) {
                this.exiting = true;
                this.cameras.main.fadeOut(this.FADE_TIME, 0, 0, 0);
            }
        });


        // Crea el texto
        let screenText = this.add.text(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, text, textConfig).setOrigin(0.5, 0.5);

        // En caso de que el texto sea demasiado largo y se salga de la 
        // pantalla, se va reduciendo el tamano de la fuente hasta que quepa
        // IMPORTANTE: SE REALIZA DE ESTA MANERA EN VEZ DE ESCALANDO EL
        // TEXTO PORQUE SI EL TEXTO ES DEMASIADO GRANDE, HABRA DEMASIADOS SALTOS
        // DE LINEA. SIN EMBARGO, ESTE PROCESO TOMARA MUCHO TIEMPO CUANTO MAS GRANDE
        // SEA EL TAMANO DE LA FUENTE, YA QUE VA REDUCIENDOLO POCO A POCO Y CREANDO
        // Y DESTRUYENDO EL TEXTO HASTA ENCONTRAR UN TAMANO CON EL QUE QUEPA.
        while (screenText.displayHeight > this.CANVAS_HEIGHT - PADDING * 2) {
            fontSize -= 5;
            textConfig.fontSize = fontSize + 'px';
            screenText.destroy();
            screenText = this.add.text(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, text, textConfig).setOrigin(0.5, 0.5);
        }

    }

}