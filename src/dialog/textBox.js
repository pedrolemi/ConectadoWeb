import DialogObject from "./dialogObject.js";

export default class OptionBox extends DialogObject {
    /**
    * Caja de texto para los dialogos
    * @extends DialogObject
    * @param {Phaser.Scene} scene - escena a la que pertenece
    */
    constructor(scene) {
        super(scene);
        // Configuracion de la imagen de la caja de texto
        this.padding = 10;        // Espacio entre la caja y los bordes del canvas

        // Imagen de la caja
        this.box = this.scene.add.image(this.scene.sys.game.canvas.width / 2, this.scene.sys.game.canvas.height - this.padding, 'textbox').setOrigin(0.5, 1);
        let horizontalScale = (this.scene.sys.game.canvas.width - this.padding * 2) / this.box.width;
        this.box.setScale(horizontalScale, 1);
        this.box.visible = true;

        this.box.setInteractive();
        this.box.on('pointerdown', (pointer) => {
            this.scene.nextDialog();
        });

        // Imagen de la caja del nombre
        this.nameBox = this.scene.add.image(this.scene.sys.game.canvas.width / 2, this.scene.sys.game.canvas.height - this.padding, 'textboxName').setOrigin(0.5, 1);
        this.nameBox.setScale(horizontalScale, 1);
        this.nameBox.visible = true;

        this.height = 135;      // Alto que va a ocupar el texto
        // this.graphics = this.scene.add.graphics();
        // this.graphics.fillStyle('black', 1);
        // this.graphics.fillRect(this.scene.sys.game.canvas.width / 2, this.scene.sys.game.canvas.height / 1.28, 20, this.height);


        // Configuracion del texto de la caja
        this.normalTextConfig = { ...this.textConfig };
        this.normalTextConfig.size = 25;

        this.nameTextConfig = { ...this.textConfig };
        this.nameTextConfig.size = 20;

        // Animacion del texto
        this.textDelay = 30;                  // Tiempo que tarda en aparecer cada letra en milisegundos
        this.currText = null;                 // Texto escrito hasta el momento
        this.fulltext = "";                   // Texto completo a escribir
        this.fullTextSplit = null;            // Texto completo a escribir separado por palabras
        this.letterCount = 0;                 // Numero de letras del texto completo escritas
        this.finished = false;                // Si ha terminado de mostrar el texto o no

        this.nameText = null;
        this.canWrite = false;

        this.createText("");
        this.createName("");
        
        this.box.alpha = 0;
        this.nameBox.alpha = 0;
        this.currText.alpha = 0;
        this.nameText.alpha = 0;

        // Camara para mostrar el icono del personaje que habla
        this.portraitCam = new Phaser.GameObjects.Container(scene, 0, 0);
        this.playerTalking = false;
    }

    shutdown() {
        // Limpia los eventos de texto
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
        let width = (this.scene.sys.game.canvas.width - this.padding) / 1.45;

        // Si el personaje que habla es el jugador, modifica la posicion
        // y los margenes del texto porque no hace falta mostrar su retrato
        if (character === "player") {
            x = 110;
            width = (this.scene.sys.game.canvas.width - this.padding) / 1.23;
        }

        // Crea el texto en la escena
        this.currText = super.createText(x, y, text, this.normalTextConfig, width);
    }

    /**
    * Crea el texto del nombre del personaje hablando
    * @param {string} name - nombre del personaje
    * @param {string} character - id del personaje que habla
    */
    createName(name, character) {
        let x = 290;
        let y = 622;
        let charName = name;

        this.playerTalking = false;
        // Si el personaje que habla es el jugador, modifica el nombre
        // para que sea el del jugador
        if (character === "player") {
            charName = this.scene.playerName;
            this.playerTalking = true;
        }

        // Crea el texto en la escena
        this.nameText = super.createText(x, y, name, this.nameTextConfig);
        this.nameText.setOrigin(0.5, 0.5);

        // Cambia el texto del objeto
        this.nameText.text = charName;
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

        // Si se va a activar y no es visible, aparece con animacion.
        if (active && !isVisible) {
            this.canWrite = false;

            // Si es el jugador el que va a hablar, no muestra el retrato
            // del personaje que habla, y si no lo es, lo muestra
            if (this.playerTalking) {
                super.activate(true, [this.box, this.nameBox, this.currText, this.nameText], () => {
                    this.box.setInteractive(true);
                    setTimeout(() => {
                        this.canWrite = true;
                    }, 200);
                    
                }, 0);
            }
            else {
                super.activate(true, [this.box, this.nameBox, this.currText, this.nameText, this.portraitCam], () => {
                    this.box.setInteractive(true);
                    setTimeout(() => {
                        this.canWrite = true;
                    }, 200);
                }, 0);
            }
        }
        // Si se va a desactivar y es visible, desaparece con animacion
        else if (!active && isVisible) {
            this.box.setInteractive(false);
            this.canWrite = false;

            // Si es el jugador el que va a hablar, no oculta el retrato del personaje 
            // que habla, (ya que ya deberia estarlo) y si no lo es, lo oculta
            if (this.playerTalking) {
                super.activate(false, [this.box, this.nameBox, this.currText, this.nameText], onComplete, delay);
            }
            else {
                super.activate(false, [this.box, this.nameBox, this.currText, this.nameText, this.portraitCam], onComplete, delay);
            }
        }
    }



}