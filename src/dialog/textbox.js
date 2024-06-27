export default class Textbox extends Phaser.GameObjects.Container {
    /**
    * Caja de texto para los dialogos
    * @extends Phaser.GameObjects.Container 
    * @param {Phaser.Scene} scene - escena a la que pertenece
    */
    constructor(scene) {
        super(scene, 0, 0);
        this.scene = scene;

        // Configuracion de la imagen de la caja de texto
        this.padding = 10;        // Espacio entre la caja y los bordes del canvas

        this.box = this.scene.add.image(this.scene.getWidth() / 2, this.scene.getHeight() - this.padding, 'textbox').setOrigin(0.5, 1);
        let horizontalScale = (this.scene.getWidth() - this.padding * 2) / this.box.width;
        this.box.setScale(horizontalScale, 1);
        this.box.visible = true;
        this.box.setInteractive();

        this.nameBox = this.scene.add.image(this.scene.getWidth() / 2, this.scene.getHeight() - this.padding, 'textboxName').setOrigin(0.5, 1);
        this.nameBox.setScale(horizontalScale, 1);
        this.nameBox.visible = true;

        this.box.on('pointerdown', (pointer) => {
            this.scene.nextDialog();
        });

        this.height = 135;  // Alto que va a ocupar el texto
        // this.graphics = this.scene.add.graphics();
        // this.graphics.fillStyle('black', 1);
        // this.graphics.fillRect(this.scene.getWidth() / 2, this.scene.getHeight() / 1.28, 20, this.height);


        // Configuracion del texto de la caja
        this.textFont = 'Arial';       // Fuente (tiene que estar precargada en el html o el css)
        this.textSize = 25;                 // Tamano de la fuente del dialogo
        this.nameSize = 25;                 // Tamano de la fuente del nombre
        this.textStyle = 'bold';            // Estilo de la fuente
        this.textBgColor = null;            // Color del fondo del texto
        this.textColor = '#fff';            // Color del texto
        this.textBorderColor = '#000';      // Color del borde del texto
        this.textBorderSize = 5;            // Grosor del borde del texto 
        this.textAlign = 'left'             // Alineacion del texto ('left', 'center', 'right', 'justify')

        // Animacion del texto
        this.textDelay = 30;                  // Tiempo que tarda en aparecer cada letra en milisegundos
        this.currText = null;                 // Texto escrito hasta el momento
        this.fulltext = "";
        this.fullTextSplit = null;            // Texto completo a escribir
        this.letterCount = 0;                 // Numero de letras del texto completo escritas
        this.finished = false;                // Si ha terminado de mostrar el texto o no

        this.nameText = null;

        // Configuracion de las animaciones
        this.fadeTime = 100;
        this.fadeEase = 'linear';
        this.canWrite = false;

        this.createText("");
        this.createName("");
        
        this.box.alpha = 0;
        this.nameBox.alpha = 0;
        this.currText.alpha = 0;
        this.nameText.alpha = 0;
        
        this.scene.add.existing(this);

        // this.charCamera = this.scene.cameras.add(400, 0, 400, 300);
        // this.charCamera.setZoom(0.5);
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
        let tempText;
        if (animate) {
            tempText = '';
            this.finished = false;
        }
        // Si no, el texto inicial es el texto completo
        else {
            tempText = dialogInfo.text;
            this.finished = true;
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
        let width = (this.scene.getWidth() - this.padding) / 1.45;

        // Si el personaje que habla es el jugador, modifica la posicion
        // y los margenes del texto porque no hace falta mostrar su retrato
        if (character === "player") {
            x = 110;
            width = (this.scene.getWidth() - this.padding) / 1.23;
        }

        // Crea el texto en la escena
        this.currText = this.scene.make.text({
            x, y, text,
            style: {
                fontFamily: this.textFont,
                fontSize: this.textSize + 'px',
                fontStyle: this.textStyle,
                backgroundColor: this.textBgColor,
                color: this.textColor,
                stroke: this.textBorderColor,
                strokeThickness: this.textBorderSize,
                align: this.textAlign,
                wordWrap: {
                    width: width,
                    useAdvancedWrap: true
                },
            }
        });
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

        // Si el personaje que habla es el jugador, modifica el nombre
        // para que sea el del jugador
        if (character === "player") {
            charName = this.scene.getPlayerName();
        }
        
        // Crea el texto en la escena
        this.nameText = this.scene.make.text({
            x, y, charName,
            style: {
                fontFamily: this.textFont,
                fontSize: this.nameSize + 'px',
                fontStyle: this.textStyle,
                backgroundColor: this.textBgColor,
                color: this.textColor,
                stroke: this.textBorderColor,
                strokeThickness: this.textBorderSize,
            }
        });
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
        if(this.timedEvent) this.timedEvent.remove();
        this.finished = true;
        if(this.currText) this.currText.setText(this.fullText);
    }

    // Activa la caja con fade in
    show() {
        let wasVisible = this.box.alpha == 1;
        
        // Si antes estaba desactivada
        if (!wasVisible) {
            // Fuerza todas las opacidades a 0 por si acaso
            this.canWrite = false;
            this.box.alpha = 0;
            this.nameBox.alpha = 0;
            this.currText.alpha = 0;
            this.nameText.alpha = 0;

            // Hace la animacion de fade in
            let fadeIn = this.scene.tweens.add({
                targets: [this.box, this.nameBox, this.currText, this.nameText],
                alpha: { from: 0, to: 1 },
                ease: this.fadeEase,
                duration: this.fadeTime,
                repeat: 0,
            });

            // Una vez termina la animacion, permite hacer click sobre la caja
            // y retrasa el momento en el que puede empezar a aparecer el texto
            fadeIn.on('complete', () => {
                this.box.setInteractive(true);
                setTimeout( () => {
					this.canWrite = true;
				}, 200);
            });
        }
    }

    // Desactiva la caja de texto con fade out. Si se quiere hacer 
    // algo despues de que haga el fade out, se le pasa la funcion 
    // o lambda como parametro y el delay con el que ejecutarlo
    hide(onComplete, delay) {
        let wasVisible = this.box.alpha == 1;

        // Si antes estaba activada
        if (wasVisible) {
            // Fuerza todas las opacidades a 1 por si acaso
            this.box.setInteractive(false);
            this.canWrite = false;
            this.box.alpha = 1;
            this.nameBox.alpha = 1;
            this.currText.alpha = 1;
            this.nameText.alpha = 1;

            // Hace la animacion de fade out
            let fadeOut = this.scene.tweens.add({
                targets: [this.box, this.nameBox, this.currText, this.nameText],
                alpha: { from: 1, to: 0 },
                ease: this.fadeEase,
                duration: this.fadeTime,
                repeat: 0,
            });

            // Llama a la funcion que se quiera ejecutar una vez esta oculta
            fadeOut.on('complete', () => {
                setTimeout( () => {
                    if (onComplete !== null && typeof onComplete === 'function') {
                        onComplete();
                    }
				}, delay);
                
            });
        }
    }
    

}