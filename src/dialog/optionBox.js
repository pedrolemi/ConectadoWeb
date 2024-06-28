export default class Optionbox extends Phaser.GameObjects.Container {
    /**
    * Caja de texto para los dialogos
    * @extends Phaser.GameObjects.Container 
    * @param {Phaser.Scene} scene - escena a la que pertenece
    */
    constructor(scene, index, numOpts, text) {
        super(scene, 0, 0);
        this.scene = scene;

        let padding = 10;
        this.boxImage = this.scene.add.image(this.scene.sys.game.canvas.width / 2, 0, 'option').setOrigin(0.5, 0);
        let scale = this.scene.sys.game.canvas.width / (this.boxImage.width + padding);
        this.boxImage.setScale(scale);

        this.boxImage.y = this.scene.sys.game.canvas.height - (this.boxImage.displayHeight * numOpts) + (this.boxImage.displayHeight * index);

        // Configuracion del texto de la caja
        let textFont = 'Arial';            // Fuente (tiene que estar precargada en el html o el css)
        let textSize = 25;                 // Tamano de la fuente del dialogo
        let textStyle = 'bold';            // Estilo de la fuente
        let textBgColor = null;            // Color del fondo del texto
        let textColor = '#fff';            // Color del texto
        let textBorderColor = '#000';      // Color del borde del texto
        let textBorderSize = 5;            // Grosor del borde del texto 
        let textAlign = 'left'             // Alineacion del texto ('left', 'center', 'right', 'justify')

        let x = 80;
        let y = this.boxImage.y + this.boxImage.displayHeight / 2;
        // Crea el texto en la escena
        this.text = this.scene.make.text({
            x, y, text,
            style: {
                fontFamily: textFont,
                fontSize: textSize + 'px',
                fontStyle: textStyle,
                backgroundColor: textBgColor,
                color: textColor,
                stroke: textBorderColor,
                strokeThickness: textBorderSize,
                align: textAlign,
            }
        });
        this.text.setOrigin(0.5, 0.5);

        // Cambia el texto del objeto
        this.text.text = text;


        // Configuracion de las animaciones
        this.fadeTime = 100;
        this.fadeEase = 'linear';
        this.canWrite = false;

        this.boxImage.setInteractive();
        let tintFadeTime = 50;
        this.scene.plugins.get('rextintrgbplugin').add(this.boxImage);

        // Hace fade del color de la caja al pasar o quitar el raton por encima
        this.boxImage.on('pointerover', () => {
            this.scene.tweens.add({
                targets: [this.boxImage],
                tintR: 0x00,
                tintG: 0xFF,
                tintB: 0x56,
                duration: tintFadeTime,
                repeat: 0,
            });
        });
        this.boxImage.on('pointerout', () => {
            this.scene.tweens.add({
                targets: [this.boxImage],
                tintR: 0xFF,
                tintG: 0xFF,
                tintB: 0xFF,
                duration: tintFadeTime,
                repeat: 0,
            });
        });

        // Al hacer click, vuelve a cambiar el color de la caja al original
        // y avisa a la escena de la opcion elegida 
        this.boxImage.on('pointerdown', (pointer) => {
            let fadeColor = this.scene.tweens.add({
                targets: [this.boxImage],
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

        this.boxImage.alpha = 0;
        this.text.alpha = 0;
        this.boxImage.setInteractive(false);
    }



    // Activa la caja con fade in
    show() {
        let wasVisible = this.boxImage.alpha == 1;

        // Si antes estaba desactivada
        if (!wasVisible) {
            // Fuerza todas las opacidades a 0 por si acaso
            this.boxImage.alpha = 0;
            this.text.alpha = 0;
            this.boxImage.setInteractive(false);

            // Hace la animacion de fade in
            let fadeIn = this.scene.tweens.add({
                targets: [this.boxImage, this.text],
                alpha: { from: 0, to: 1 },
                ease: this.fadeEase,
                duration: this.fadeTime,
                repeat: 0,
            });
            fadeIn.on('complete', () => {
                this.boxImage.setInteractive(true);
            });
        }
    }

    // Desactiva la caja con fade out. Si se quiere hacer 
    // algo despues de que haga el fade out, se le pasa la funcion 
    // o lambda como parametro y el delay con el que ejecutarlo
    hide(onComplete, delay) {
        let wasVisible = this.boxImage.alpha == 1;

        // Si antes estaba activada
        if (wasVisible) {
            // Fuerza todas las opacidades a 0 por si acaso
            this.boxImage.alpha = 1;
            this.text.alpha = 1;
            this.boxImage.setInteractive(false);

            // Hace la animacion de fade out
            let fadeOut = this.scene.tweens.add({
                targets: [this.boxImage, this.text],
                alpha: { from: 1, to: 0 },
                ease: this.fadeEase,
                duration: this.fadeTime,
                repeat: 0,
            });

            // Llama a la funcion que se quiera ejecutar una vez esta oculta
            fadeOut.on('complete', () => {
                setTimeout(() => {
                    if (onComplete !== null && typeof onComplete === 'function') {
                        onComplete();
                    }
                }, delay);

            });
        }
    }


}