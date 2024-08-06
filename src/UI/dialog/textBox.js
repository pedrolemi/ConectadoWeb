import DialogObject from "./dialogObject.js";

export default class TextBox extends DialogObject {
    /**
    * Caja de texto para los dialogos
    * @extends DialogObject
    * @param {Phaser.Scene} scene - escena a la que pertenece
    */
    constructor(scene, dialogManager) {
        super(scene);
        this.scene = scene;

        // Configuracion de la imagen de la caja de texto
        this.padding = 10;        // Espacio entre la caja y los bordes del canvas

        // Imagen de la caja
        this.box = scene.add.image(this.scene.CANVAS_WIDTH / 2, this.scene.CANVAS_HEIGHT - this.padding, 'dialogs', 'textbox').setOrigin(0.5, 1);
        let horizontalScale = (this.scene.CANVAS_WIDTH - this.padding * 2) / this.box.width;
        this.box.setScale(horizontalScale, 1);
        this.box.visible = true;

        this.box.setInteractive({ useHandCursor: true });
        this.box.on('pointerdown', () => {
            dialogManager.nextDialog();
        });

        // Imagen de la caja del nombre
        this.nameBox = scene.add.image(this.scene.CANVAS_WIDTH / 2, this.scene.CANVAS_HEIGHT - this.padding, 'dialogs', 'textboxName').setOrigin(0.5, 1);
        this.nameBox.setScale(horizontalScale, 1);
        this.nameBox.visible = true;

        this.height = 135;      // Alto que va a ocupar el texto
        // Depurar el tamano real de la caja de texto
        /*
        this.graphics = scene.add.graphics();
        this.graphics.fillStyle('black', 1);
        this.graphics.fillRect(230, this.scene.CANVAS_HEIGHT / 1.28, (this.scene.CANVAS_WIDTH - this.padding) / 1.53, this.height);
        */

        // Indica si el texto de la caja esta centrado o no
        this.centered = false;

        // Configuracion por defecto del texto de la caja
        this.defaultNormalTextConfig = { ...scene.gameManager.textConfig };
        this.defaultNormalTextConfig.fontStyle = 'bold';
        this.defaultNormalTextConfig.strokeThickness = 5;
        // Inicialmente la configuracion del texto de la caja es la de por defecto
        this.normalTextConfig = { ...this.defaultNormalTextConfig };

        // Configuracion por defecto del texto del nombre
        this.defaultNameTextConfig = { ...scene.gameManager.textConfig };
        this.defaultNameTextConfig.fontStyle = 'bold';
        this.defaultNameTextConfig.strokeThickness = 5;
        // Inicialmente la configuracion del texto del nombre la por defecto
        this.nameTextConfig = { ...this.defaultNameTextConfig };

        // Animacion del texto
        this.textDelay = 30;                                                        // Tiempo que tarda en aparecer cada letra en milisegundos
        this.currText = this.scene.add.text(0, 0, "", this.normalTextConfig);       // Texto escrito hasta el momento
        this.fulltext = "";                                                         // Texto completo a escribir
        this.fullTextSplit = null;                                                  // Texto completo a escribir separado por palabras
        this.letterCount = 0;                                                       // Numero de letras del texto completo escritas
        this.finished = false;                                                      // Si ha terminado de mostrar el texto o no

        this.nameText = this.scene.add.text(0, 0, "", this.nameTextConfig);
        this.canWrite = false;

        this.box.alpha = 0;
        this.nameBox.alpha = 0;
        this.currText.alpha = 0;
        this.nameText.alpha = 0;

        // Retrato del personaje que habla
        this.portrait = null;
        this.nonPortraitChar = false;
    }

    getTransform() {
        return {
            x: this.box.x,
            y: this.box.y,
            originX: this.box.originX,
            originY: this.box.originY,
            scaleX: this.box.scaleX,
            scaleY: this.box.scaleY
        }
    }


    /**
    * Cambia el texto de la caja
    * @param {String} text - texto a escribir
    * @param {Boolean} animate - si se va a animar el texto o no
    */
    setText(dialogInfo, animate) {
        // Limpia los eventos
        if (this.timedEvent) this.timedEvent.remove();

        // Reinicia el numero de letras escritas y se separa
        // cada caracter del texto completo en un array
        this.letterCount = 0;
        this.fullText = dialogInfo.text;
        this.fullTextSplit = dialogInfo.text.split('');

        // Si el texto es animado, el texto inicial esta vacio
        // si no, el texto inicial es el texto completo
        let tempText = dialogInfo.text;
        this.finished = true;
        if (animate) {
            tempText = '';
            this.finished = false;
        }

        // Se crea el texto que se va a escribir y el nombre del personaje
        this.changeText(tempText);
        this.changeName(dialogInfo.name);

        this.nonPortraitChar = false;
        if (!this.portrait) {
            this.nonPortraitChar = true;
        }

        if (animate) {
            // Se crea el evento 
            this.timedEvent = this.scene.time.addEvent({
                delay: this.textDelay,
                callback: this.animateText,
                callbackScope: this,
                loop: true
            });
        }
    }

    /**
    * Cambia el texto que se muestra por pantalla
    * @param {String} text - texto a escribir
    */
    changeText(text) {
        // Nota: no hay soporte para texto centrado con retrato
        
        // Arriba a la izquierda y con retrato
        let x = 230;
        let y = 660;
        let width = (this.scene.CANVAS_WIDTH - this.padding) / 1.53;

        // Centrado y sin retrato
        if (this.centered) {
            x = this.box.x;
            y = this.box.y - this.box.displayHeight / 2.25;
            width = (this.scene.CANVAS_WIDTH - this.padding * 2) / 1.30;
        }
        else {
            // Arriba a la izquierda y sin retrato
            // Se modifica la posicion y los margenes del texto porque no hace falta mostrar su retrato
            if (!this.portrait) {
                x = 110;
                width = (this.scene.CANVAS_WIDTH - this.padding) / 1.30;
            }
        }

        this.normalTextConfig.wordWrap = {
            width: width,
            useAdvancedWrap: true
        }

        // Crea el texto en la escena
        this.currText.x = x;
        this.currText.y = y;
        this.currText.setStyle(this.normalTextConfig);
        this.currText.setText(text);
    }

    /**
    * Cambia el texto del nombre del personaje hablando
    * @param {String} name - nombre del personaje
    */
    changeName(name) {
        let x = 290;
        let y = 622;

        // Crea el texto en la escena
        this.nameText.setOrigin(0.5, 0.5);
        this.nameText.x = x;
        this.nameText.y = y;

        // Cambia el texto del objeto
        this.nameText.setText(name);
        this.nameText.setStyle(this.nameTextConfig);
    }

    /**
    * Devuelve si el texto de la caja supera la altura maxima
    * @returns {boolean} - true si la caja supera la altura maxima, false en caso contrario
    */
    textTooBig() {
        return (this.currText.getBounds().height > this.height);
    }

    /**
    * Cambia el retrato del personaje hablando
    * IMPORTANTE: LLAMARLO ANTES QUE setText PARA QUE EL TEXTO SE COLOQUE CORRECTAMENTE EN FUNCION
    * DE SI HAY RETRATO O NO
    * @param {Phaser.Image} portrait - retrato personaje que habla
    */
    setPortrait(portrait) {
        // Si el personaje que va a hablar no tiene retrato, no se va a mostrar (null)
        this.portrait = null;
        if (portrait) {
            this.portrait = portrait;
        }
    }

    // Anima el texto para que vaya apareciendo caracter a caracter
    animateText() {
        if (this.canWrite) {
            // Actualiza el numero de letras
            this.letterCount++;

            // Cambia el texto a mostrar por el texto actual + el nuevo caracter a escribir
            this.currText.setText(this.currText.text + this.fullTextSplit[this.letterCount - 1]);

            // Si se ya se han escrito todos los caracteres, elimina el evento
            if (this.letterCount === this.fullTextSplit.length) {
                this.timedEvent.remove();
                this.finished = true;
            }
        }

    }

    // Muestra de golpe el dialogo completo
    forceFinish() {
        if (this.timedEvent) this.timedEvent.remove();
        this.finished = true;
        if (this.currText) this.currText.setText(this.fullText);
    }

    /**
    * Activa/desactiva el cuadro de texto y ejecuta la funcion o lambda que se le
    * pase como parametro una vez haya terminado la animacion y el retardo indicado
    * @param {Boolean} active - si se va a activar
    * @param {Function} onComplete - funcion a la que llamar cuando acabe la animacion
    * @param {Number} delay - tiempo en ms que tarda en llamarse a onComplete
    */
    activate(active, onComplete, delay) {
        // Es visible si el alpha de la caja es 1
        let isVisible = this.box.alpha == 1;

        if (active && isVisible) {
            if (this.nonPortraitChar && this.portrait) {
                this.portrait.alpha = 0;
            }
        }

        // Si se va a activar y no es visible, aparece con animacion.
        if (active && !isVisible) {
            this.canWrite = false;

            // Si el personaje que va a hablar no tiene retrato, no lo muestra
            // y si lo tiene, si lo muestra
            if (this.nonPortraitChar) {
                this.box.disableInteractive();
                super.activate(true, [this.box, this.nameBox, this.currText, this.nameText], () => {
                    setTimeout(() => {
                        this.box.setInteractive({ useHandCursor: true });
                        this.canWrite = true;
                    }, 200);

                }, 0);
            }
            else {
                this.box.disableInteractive();
                super.activate(true, [this.box, this.nameBox, this.currText, this.nameText, this.portrait], () => {
                    setTimeout(() => {
                        this.box.setInteractive({ useHandCursor: true });
                        this.canWrite = true;
                    }, 200);
                }, 0);
            }
        }
        // Si se va a desactivar y es visible, desaparece con animacion
        else if (!active && isVisible) {
            this.box.disableInteractive();
            this.canWrite = false;

            // Si el personaje que va a hablar no tiene retrato, no lo oculta (ya que ya deberia estarlo)
            // y si tiene retrato, si lo oculta
            if (this.nonPortraitChar) {
                super.activate(false, [this.box, this.nameBox, this.currText, this.nameText], onComplete, delay);
            }
            else {
                super.activate(false, [this.box, this.nameBox, this.currText, this.nameText, this.portrait], onComplete, delay);
            }
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

    /**
     * Se resetea la configuracion del texto de la caja a la por defecto
     */
    resetTextConfig() {
        this.normalTextConfig = { ...this.defaultNormalTextConfig };
        // Por si acaso
        if (this.centered) {
            this.normalTextConfig.align = 'center';
        }
        this.nameTextConfig = { ...this.defaultNameTextConfig };
    }

    /**
     * Alinear el texto de la caja al centro o arriba a la izquierda
     * @param {Boolean} centered - true si el texto esta centrado, false si esta arriba a la izquierda
     */
    centerText(centered) {
        this.centered = centered;

        this.normalTextConfig.align = 'left';
        this.currText.setOrigin(0);
        if (this.centered) {
            this.normalTextConfig.align = 'center';
            this.currText.setOrigin(0.5);
        }
    }
}