import DialogObject from './dialogObject.js';

export default class OptionBox extends DialogObject {
    /**
    * Caja de texto para la opcion multiple
    * @extends DialogObject
    * @param {Phaser.Scene} scene - escena a la que pertenece
    * @param {Number} index - indice de la opcion
    * @param {Number} numOpts - numero total de elecciones
    * @param {String} text - texto de la opcion
    */
    constructor(scene, dialogManager, index, numOpts, text) {
        super(scene);

        let padding = 10;
        this.box = scene.add.image(this.scene.CANVAS_WIDTH / 2, 0, 'dialogs', 'optionBg').setOrigin(0.5, 0);
        let scale = this.scene.CANVAS_WIDTH / (this.box.width + padding);
        this.box.setScale(scale);

        this.box.y = this.scene.CANVAS_HEIGHT - (this.box.displayHeight * numOpts) + (this.box.displayHeight * index);

        // Configuracion del texto de la caja
        this.textConfig = { ...scene.gameManager.textConfig };
        this.textConfig.fontSize = 25 + 'px';
        this.textConfig.fontStyle = 'bold';
        this.textConfig.strokeThickness = 5;

        let x = 50;
        let y = this.box.y + this.box.displayHeight / 2;

        // Crea el texto
        this.text = this.scene.add.text(x, y, text, this.textConfig);
        this.text.setOrigin(0, 0.5);

        this.box.setInteractive({ useHandCursor: true });

        // Configuracion de las animaciones
        let tintFadeTime = 50;

        let noTint = Phaser.Display.Color.HexStringToColor('#ffffff');
        let pointerOverColor = Phaser.Display.Color.HexStringToColor('#00ff56');

        // Hace fade del color de la caja al pasar o quitar el raton por encima
        this.box.on('pointerover', () => {
            scene.tweens.addCounter({
                targets: [this.box],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(noTint, pointerOverColor, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    this.box.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
            });
        });
        this.box.on('pointerout', () => {
            scene.tweens.addCounter({
                targets: [this.box],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(pointerOverColor, noTint, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    this.box.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
            });
        });

        // Al hacer click, vuelve a cambiar el color de la caja al original
        // y avisa a la escena de la opcion elegida 
        this.box.on('pointerdown', () => {
            this.box.disableInteractive();
            let fadeColor = scene.tweens.addCounter({
                targets: [this.box],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(pointerOverColor, noTint, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    this.box.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
                yoyo: true
            });
            fadeColor.on('complete', () => {
                dialogManager.selectOption(index);
            });
        });

        this.box.alpha = 0;
        this.text.alpha = 0;
        this.box.disableInteractive();
    }

    /**
    * Activa/desactiva la caja
    * @param {Boolean} active - si se va a activar
    */
    activate(active) {
        // Es visible si el alpha de la caja es 1
        let isVisible = this.box.alpha == 1;

        // Si se va a activar y no es visible, aparece con animacion
        if (active && !isVisible) {
            this.box.disableInteractive();
            super.activate(true, [this.box, this.text], () => {
                this.box.setInteractive({ useHandCursor: true });
            }, 0);
        }
        // Si se va a desactivar y es visible, desaparece con animacion
        else if (!active && isVisible) {
            this.box.disableInteractive();
            super.activate(false, [this.box, this.text]);
        }
    }

}