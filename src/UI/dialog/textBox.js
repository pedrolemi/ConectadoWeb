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
        this.box = scene.add.image(this.scene.CANVAS_WIDTH / 2, this.scene.CANVAS_HEIGHT - this.padding, 'dialog', 'textbox.png').setOrigin(0.5, 1);
        let horizontalScale = (this.scene.CANVAS_WIDTH - this.padding * 2) / this.box.width;
        this.box.setScale(horizontalScale, 1);
        this.box.visible = true;

        this.box.setInteractive();
        this.box.on('pointerdown', (pointer) => {
            dialogManager.nextDialog();
        });

        // Imagen de la caja del nombre
        this.nameBox = scene.add.image(this.scene.CANVAS_WIDTH / 2, this.scene.CANVAS_HEIGHT - this.padding, 'dialog', 'textboxName.png').setOrigin(0.5, 1);
        this.nameBox.setScale(horizontalScale, 1);
        this.nameBox.visible = true;

        this.height = 135;      // Alto que va a ocupar el texto
        // this.graphics = scene.add.graphics();
        // this.graphics.fillStyle('black', 1);
        // this.graphics.fillRect(230 , this.scene.CANVAS_HEIGHT / 1.28, (this.scene.CANVAS_WIDTH - this.padding) / 1.53, this.height);


        // Configuracion del texto de la caja
        this.normalTextConfig = { ...scene.textConfig };
        this.normalTextConfig.fontSize = 20 + 'px';

        this.nameTextConfig = { ...scene.textConfig };
        this.nameTextConfig.fontSize = 25 + 'px';


        // Animacion del texto
        this.textDelay = 30;                                                        // Tiempo que tarda en aparecer cada letra en milisegundos
        this.currText = scene.createText(0, 0, "aaa", this.normalTextConfig);       // Texto escrito hasta el momento
        this.fulltext = "";                                                         // Texto completo a escribir
        this.fullTextSplit = null;                                                  // Texto completo a escribir separado por palabras
        this.letterCount = 0;                                                       // Numero de letras del texto completo escritas
        this.finished = false;                                                      // Si ha terminado de mostrar el texto o no

        this.nameText = scene.createText(0, 0, "aaa", this.nameText);
        this.canWrite = false;

        this.box.alpha = 0;
        this.nameBox.alpha = 0;
        this.currText.alpha = 0;
        this.nameText.alpha = 0;

        // Retrato del personaje que habla
        this.emptyPortrait = new Phaser.GameObjects.Container(scene, 0, 0);
        this.portrait = this.emptyPortrait;
        this.playerTalking = false;
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

    shutdown() {
        // Limpia los eventos y el texto
        if (this.timedEvent) this.timedEvent.remove();
        if (this.currText) this.currText.destroy();
        if (this.nameText) this.nameText.destroy();
    }

    /**
    * Cambia el texto de la caja
    * @param {string} text - texto a escribir
    * @param {boolean} animate - si se va a animar el texto o no
    */
    setText(dialogInfo, animate) {
        this.shutdown();

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
        this.createText(tempText, dialogInfo.character);
        this.createName(dialogInfo.name, dialogInfo.character);

        this.playerTalking = false;
        if (dialogInfo.character === "player") {
            this.playerTalking = true;
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
    * Crea el texto que se muestra por pantalla
    * @param {string} text - texto a escribir
    * @param {string} character - id del personaje que habla
    */
    createText(text, character) {
        let x = 230;
        let y = 660;
        let width = (this.scene.CANVAS_WIDTH - this.padding) / 1.53;

        // Si el personaje que habla es el jugador, modifica la posicion
        // y los margenes del texto porque no hace falta mostrar su retrato
        if (character === "player") {
            x = 110;
            width = (this.scene.CANVAS_WIDTH - this.padding) / 1.30;
        }
        this.normalTextConfig.wordWrap = {
            width: width,
            useAdvancedWrap: true
        }

        // Crea el texto en la escena
        this.currText = this.scene.createText(x, y, text, this.normalTextConfig);
        this.currText.setText(text);
    }

    /**
    * Crea el texto del nombre del personaje hablando
    * @param {string} name - nombre del personaje
    */
    createName(name) {
        let x = 290;
        let y = 622;

        // // Crea el texto en la escena
        this.nameText = this.scene.createText(x, y, name, this.nameTextConfig).setOrigin(0.5, 0.5);

        // // Cambia el texto del objeto
        this.nameText.setText(name);
    }

    /**
    * Devuelve si el texto de la caja supera la altura maxima
    * @return {boolean} - true si la caja supera la altura maxima, false en caso contrario
    */
    textTooBig() {
        return (this.currText.getBounds().height > this.height);
    }

    /**
    * Cambia el retrato del personaje hablando
    * @param {Phaser.Image} portrait - retrato personaje que habla
    */
    setPortrait(portrait) {
        this.portrait = portrait;
        if (!this.portrait) this.portrait = this.emptyPortrait;
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
    * @param {boolean} active - si se va a activar
    * @param {function} onComplete - funcion a la que llamar cuando acabe la animacion
    * @param {number} delay - tiempo en ms que tarda en llamarse a onComplete
    */
    activate(active, onComplete, delay) {
        // Es visible si el alpha de la caja es 1
        let isVisible = this.box.alpha == 1;

        if (active && isVisible) {
            if (this.playerTalking) this.portrait.alpha = 0;
        }

        // Si se va a activar y no es visible, aparece con animacion.
        if (active && !isVisible) {
            this.canWrite = false;

            // Si es el jugador el que va a hablar, no muestra el retrato
            // del personaje que habla, y si no lo es, lo muestra
            if (this.playerTalking) {
                this.box.disableInteractive();
                super.activate(true, [this.box, this.nameBox, this.currText, this.nameText], () => {
                    setTimeout(() => {
                        this.box.setInteractive();
                        this.canWrite = true;
                    }, 200);

                }, 0);
            }
            else {
                this.box.disableInteractive();
                super.activate(true, [this.box, this.nameBox, this.currText, this.nameText, this.portrait], () => {
                    setTimeout(() => {
                        this.box.setInteractive();
                        this.canWrite = true;
                    }, 200);
                }, 0);
            }
        }
        // Si se va a desactivar y es visible, desaparece con animacion
        else if (!active && isVisible) {
            this.box.disableInteractive();
            this.canWrite = false;

            // Si es el jugador el que va a hablar, no oculta el retrato del personaje 
            // que habla, (ya que ya deberia estarlo) y si no lo es, lo oculta
            if (this.playerTalking) {
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



}