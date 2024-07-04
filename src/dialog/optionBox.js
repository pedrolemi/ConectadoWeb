import DialogObject from './dialogObject.js';
import GameManager from '../gameManager.js'

export default class OptionBox extends DialogObject {
    /**
    * Caja de texto para la opcion multiple
    * @extends DialogObject
    * @param {Phaser.Scene} scene - escena a la que pertenece
    * @param {number} index - indice de la opcion
    * @param {number} numOpts - numero total de elecciones
    * @param {string} text - texto de la opcion
    */
    constructor(scene, index, numOpts, text) {
        super(scene, 0, 0);
        this.scene = scene;

        let padding = 10;
        this.box = this.scene.add.image(this.scene.sys.game.canvas.width / 2, 0, 'dialog', 'optionBg.png').setOrigin(0.5, 0);
        let scale = this.scene.sys.game.canvas.width / (this.box.width + padding);
        this.box.setScale(scale);

        this.box.y = this.scene.sys.game.canvas.height - (this.box.displayHeight * numOpts) + (this.box.displayHeight * index);

        // Configuracion del texto de la caja
        this.textConfig = { ...this.textConfig };
        this.textConfig.size = 20;

        let x = 50;
        let y = this.box.y + this.box.displayHeight / 2;

        // Crea el texto en la escena
        this.text = super.createText(x, y, text, this.textConfig);
        this.text.setOrigin(0, 0.5);
        this.text.text = text;

        this.box.setInteractive();

        let gameManager = GameManager.getInstance();

        // Configuracion de las animaciones
        let tintFadeTime = 50;
        gameManager.tintrgb.add(this.box);

        // Hace fade del color de la caja al pasar o quitar el raton por encima
        this.box.on('pointerover', () => {
            this.scene.tweens.add({
                targets: [this.box],
                tintR: 0x00,
                tintG: 0xFF,
                tintB: 0x56,
                duration: tintFadeTime,
                repeat: 0,
            });
        });
        this.box.on('pointerout', () => {
            this.scene.tweens.add({
                targets: [this.box],
                tintR: 0xFF,
                tintG: 0xFF,
                tintB: 0xFF,
                duration: tintFadeTime,
                repeat: 0,
            });
        });

        // Al hacer click, vuelve a cambiar el color de la caja al original
        // y avisa a la escena de la opcion elegida 
        this.box.on('pointerdown', (pointer) => {
            this.box.disableInteractive();
            let fadeColor = this.scene.tweens.add({
                targets: [this.box],
                tintR: 0xFF,
                tintG: 0xFF,
                tintB: 0xFF,
                duration: tintFadeTime,
                repeat: 0,
            });
            fadeColor.on('complete', () => {
                this.scene.selectOption(index);
            });
        });

        this.box.alpha = 0;
        this.text.alpha = 0;
        this.box.disableInteractive();
    }

    /**
    * Activa/desactiva la caja y ejecuta la funcion o lambda que se le
    * pase como parametro una vez haya terminado la animacion y el retardo indicado
    * @param {boolean} active - si se va a activar
    * @param {function} onComplete - funcion a la que llamar cuando acabe la animacion
    * @param {number} delay - tiempo en ms que tarda en llamarse a onComplete
    */
    activate(active, onComplete, delay) {
        // Es visible si el alpha de la caja es 1
        let isVisible = this.box.alpha == 1;

        // Si se va a activar y no es visible, aparece con animacion
        if (active && !isVisible) {
            this.box.disableInteractive();
            super.activate(true, [this.box, this.text], () => {
                this.box.setInteractive();
            }, 0);
        }
        // Si se va a desactivar y es visible, desaparece con animacion
        else if (!active && isVisible) {
            this.box.disableInteractive();
            super.activate(false, [this.box, this.text], onComplete, delay);
        }
        // Si se va a desactivar y no era visible, se llama a la funcion que se ha pasado
        else if (!active && !isVisible) {
            if (onComplete !== null && typeof onComplete === 'function') {
                setTimeout(() => {
                    onComplete();
                }, delay);

            }
        }
    }

}