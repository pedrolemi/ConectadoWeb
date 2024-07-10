import GameManager from "../managers/gameManager.js"

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

        // Fondo escalado en cuanto al canvas
        let bg = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'basePC');
        let scale = CANVAS_WIDTH / bg.width;
        bg.setScale(scale);

        this.add.rectangle(CANVAS_WIDTH / 2, 0, CANVAS_WIDTH, CANVAS_HEIGHT / 1.2, 0x2B9E9E).setOrigin(0.5, 0);

        // Pantalla del ordenador con el tam del canvas
        let screen = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'PCscreen');
        screen.setDisplaySize(CANVAS_WIDTH, CANVAS_HEIGHT);

        // Botones con las banderas
        let height = CANVAS_HEIGHT / 7.5;
        let tweenTime = 7;
        let increase = 1.3; 
        this.createFlagButton(1.2 * CANVAS_WIDTH / 4, 1.1 * CANVAS_HEIGHT / 4, 
            height, 'frFlag', 'en', tweenTime, increase);
        this.createFlagButton(2.8 * CANVAS_WIDTH / 4, 1.1 * CANVAS_HEIGHT / 4, 
            height, 'poFlag', 'en', tweenTime, increase);
        this.createFlagButton(1.2 * CANVAS_WIDTH / 4, 2.4 * CANVAS_HEIGHT / 4, 
            height, 'spFlag', 'es', tweenTime, increase);
        this.createFlagButton(2.8 * CANVAS_WIDTH / 4, 2.4 * CANVAS_HEIGHT / 4, 
            height, 'ukFlag', 'en', tweenTime, increase);
    }

    /**
     * Metodo para crear un boton que cambie al idioma seleccionado
     * @param {number} x - posicion x
     * @param {number} y - posicion y
     * @param {number} height - altura del boton
     * @param {string} sprite - imagen que se va a usar para mostrar al boton
     * @param {number} tweenTime - tiempo que dura el tween de escalado tanto cuando se coloca el cursor encima como cuando se quita
     * @param {number} scaleIncrease - cuanto se escala cuando se realiza el tween de escalado al colocar el cursor encima 
     */
    createFlagButton(x, y, height, sprite, language, tweenTime, scaleIncrease){
        let button = this.add.image(x, y, sprite);
        
        let scale = height / button.height;
        button.setScale(scale);

        button.setInteractive();
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
            // Se cambia el idioma y se pasa a la pantalal de titulo
            this.i18next.changeLanguage(language);
            this.gameManager.startTitleMenu();
        });
    }
}