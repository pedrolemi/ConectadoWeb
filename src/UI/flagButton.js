import GameManager from "../managers/gameManager.js";

export default class FlagButton extends Phaser.GameObjects.Image {
    /**
    * Clase que representa un boton para elegir el idioma del juego
    * @extends Phaser.GameObjects.Image 
    * @param {Phaser.Scene} scene - escena a la que pertenece
    * @param {integer} index - posicion del boton respecto al resto representada por un indice
    * @param {integer} numLang - numero de botones
    * @param {number} height - altura de todos los botones
    * @param {string} sprite - clave que representa el sprite de la bandera que usar
    * @param {string} language - idioma al que cambiar cuando se selecciona este boton
    */
    constructor(scene, index, numLang, height, sprite, language) {
        super(scene, 0, 0, sprite);

        const CANVAS_WIDTH = this.scene.sys.game.canvas.width;
        const CANVAS_HEIGHT = this.scene.sys.game.canvas.height;

        this.scene.add.existing(this);

        let gameManager = GameManager.getInstance();

        let i18next = gameManager.i18next;

        this.setOrigin(0.5, 0.5);

        let scale = height / this.height;
        this.setScale(scale);

        // Colocar el boton respecto al resto en funcion de su indice
        let regionWidth = CANVAS_WIDTH / numLang;
        this.x = regionWidth * index + regionWidth / 2;
        let offset = regionWidth / 6;
        // Si es el primero o el ultimo se deja un espacio a los lados
        if (index === 0) {
            this.x += offset;
        }
        else if (index === numLang - 1) {
            this.x -= offset;
        }
        this.y = CANVAS_HEIGHT / 2.3;

        this.setInteractive();
        this.on('pointerdown', () => {
            i18next.changeLanguage(language);
            gameManager.startGame();
        });

        // Configuracion de las animaciones
        let increasement = 1.3;
        let scaleTime = 7;

        // Animacion de los botones cuando se coloca el cursor encima de ellos
        this.on('pointerover', () => {
            this.scene.tweens.add({
                targets: this,
                scale: scale * increasement,
                duration: scaleTime,
                ease: 'Expo.easeOut',
                repeat: 0,
            });
        });

        this.on('pointerout', () => {
            this.scene.tweens.add({
                targets: this,
                scale: scale,
                duration: scaleTime,
                ease: 'Expo.easeOut',
                repeat: 0,
            });
        });
    }
}