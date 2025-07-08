import GameManager from "../../managers/gameManager.js"
import xapiTracker from "../../lib/xapi.js";

export default class LanguageMenu extends Phaser.Scene {
    /**
    * Menu para elegir el idioma del juego
    * @extends Phaser.Scene
    */
    constructor() {
        super({ key: 'LanguageMenu' });
    }

    create() {
        const CANVAS_WIDTH = this.sys.game.canvas.width;
        const CANVAS_HEIGHT = this.sys.game.canvas.height;

        this.gameManager = GameManager.getInstance();
        this.i18next = this.gameManager.i18next;
        let namespace = 'menus\\languageMenu';

        // Fondo escalado en cuanto al canvas
        let bg = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'basePC');
        let scale = CANVAS_WIDTH / bg.width;
        bg.setScale(scale);

        // Fondo
        this.add.rectangle(CANVAS_WIDTH / 2, 0, CANVAS_WIDTH, CANVAS_HEIGHT / 1.2, 0x2B9E9E).setOrigin(0.5, 0);

        // Pantalla del ordenador con el tam del canvas
        let screen = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'PCscreen');
        screen.setDisplaySize(CANVAS_WIDTH, CANVAS_HEIGHT);

        // Botones con las banderas
        let height = CANVAS_HEIGHT / 7.5;
        let tweenTime = 7;
        let increase = 1.3;
        this.createFlagButton(1.3 * CANVAS_WIDTH / 6, 1.1 * CANVAS_HEIGHT / 4, height, 'es', 'es', tweenTime, increase);
        this.createFlagButton(3.2 * CANVAS_WIDTH / 6, 1.1 * CANVAS_HEIGHT / 4, height, 'fr', 'fr', tweenTime, increase);
        this.createFlagButton(4.9 * CANVAS_WIDTH / 6, 1.1 * CANVAS_HEIGHT / 4, height, 'en', 'en', tweenTime, increase);

        this.createFlagButton(1.3 * CANVAS_WIDTH / 6, 2.4 * CANVAS_HEIGHT / 4, height, 'pt-br', 'pt-BR', tweenTime, increase);
        this.createFlagButton(3.2 * CANVAS_WIDTH / 6, 2.4 * CANVAS_HEIGHT / 4, height, 'cn-cn', 'cn-CN', tweenTime, increase);
        this.createFlagButton(4.9 * CANVAS_WIDTH / 6, 2.4 * CANVAS_HEIGHT / 4, height, 'cn-hk', 'cn-HK', tweenTime, increase);
        
        // Boton de salir
        // let exitButton = new Button(this, 100, 3 * CANVAS_HEIGHT / 4 + 10, 0.5,
        //     async () => {
        //         if(!this.gameManager.initialized) {
        //             await this.gameManager.InitializedGame();
        //         }
        //         this.gameManager.CompletedGame(true);
        //     },
        //     'powerOff', { R: 64, G: 142, B: 134 }, { R: 0, G: 104, B: 93 }, { R: 200, G: 200, B: 200 }
        // );
    }

    /**
     * Metodo para crear un boton que cambie al idioma seleccionado
     * @param {Number} x - posicion x
     * @param {Number} y - posicion y
     * @param {Number} height - altura del boton
     * @param {String} sprite - imagen que se va a usar para mostrar al boton
     * @param {Number} tweenTime - tiempo que dura el tween de escalado tanto cuando se coloca el cursor encima como cuando se quita
     * @param {Number} scaleIncrease - cuanto se escala cuando se realiza el tween de escalado al colocar el cursor encima 
     */
    createFlagButton(x, y, height, sprite, language, tweenTime, scaleIncrease) {
        let button = this.add.image(x, y, 'flags', sprite);

        let scale = height / button.height;
        button.setScale(scale);

        button.setInteractive({ useHandCursor: true });
        button.on('pointerover', () => {
            this.tweens.add({
                targets: button,
                scale: scale * scaleIncrease,
                duration: tweenTime,
                ease: 'Expo.easeOut',
                repeat: 0,
            });
        });
        button.on('pointerout', () => {
            this.tweens.add({
                targets: button,
                scale: scale,
                duration: tweenTime,
                ease: 'Expo.easeOut',
                repeat: 0,
            });
        });
        button.on('pointerdown', () => {
            xapiTracker.enqueue(xapiTracker.alternativeTracker.Selected("language", language, JSTracker.ALTERNATIVETYPE.MENU));
            // Se cambia el idioma y se pasa a la pantalla de titulo
            this.i18next.changeLanguage(language);
            this.gameManager.startTitleMenu();
        });
    }
}