import GameManager from "../managers/gameManager.js";

export default class TextInput extends Phaser.GameObjects.Container {
    /**
    * Clase que permite crear una caja de texto donde poder escribir
    * @param {Phaser.Scene} scene - escena a la que pertenece
    * @param {Number} x - posicion x
    * @param {Number} y - posicion y
    * @param {Number} scale - escala del objeto
    * @param {String} defaultText - texto por defecto que aparece en la caja si no se ha escrito nada aun
    * @param {Number} offset - punto a partir del cual se comienza a escribir el texto para que todo este bien ajustado
    * @param {Color} pressedCol - color RGB al que se cambia cuando se produce la animacion de comenzar a escribir en la caja
    * @param {String} fill - sprite que se usa para el relleno
    * @param {String} edge - sprite que se usa para el borde (opcional)
    * @param {String} font - tipografia (opcional). En caso de que no se especifique ninguna, se usa 'Arial'
    * @param {String} hitArea - cambiar el area de colision para que corresponda con el del relleno del boton (opcional)
    */
    constructor(scene, x, y, scale, defaultText, offset, pressedColor, fill, edge, font, hitArea) {
        super(scene, x, y);

        this.scene.add.existing(this);

        let gameManager = GameManager.getInstance();

        // Relleno del cuadro de texto
        // Es la parte interactuable
        this.fillImg = this.scene.add.image(0, 0, fill);
        this.fillImg.setOrigin(0, 0.5);
        if (hitArea) {
            this.fillImg.setInteractive({ useHandCursor: true }, hitArea.area, hitArea.callback);
        }
        else {
            this.fillImg.setInteractive({ useHandCursor: true });
        }
        if (this.scene.sys.game.debug) {
            this.scene.input.enableDebug(this.fillImg, '0xffff00');
        }
        this.add(this.fillImg);

        if (edge) {
            let edgeImg = this.scene.add.image(0, 0, edge);
            edgeImg.setOrigin(0, 0.5);
            this.add(edgeImg);
        }

        // Configuracion del estilo del texto que se escribe
        if (!font) {
            font = 'Arial';
        }

        let style = { ...gameManager.textConfig };
        style.fontFamily = font;
        style.fontSize = '42px';
        style.color = '#000000';

        this.offset = offset;

        // El texto por defecto aparece en cursiva y con cierto grado de transparencia
        this.defaultTextAlpha = 0.3;
        this.defaultText = defaultText;

        // Inicialmente no hay texto escrito
        this.currentText = "";

        // Texto donde se escribe (inicialmetne esta vacio)
        this.text = this.scene.add.text(this.offset, 0, this.defaultText, style);
        this.text.setAlpha(this.defaultTextAlpha).setOrigin(0, 0.5).setFontStyle('italic');
        this.add(this.text);

        // Indicar si el usuario esta escribiendo o no
        this.isEnteringName = false;

        // Texto para simular el cursor
        // (se trata como un elemento aparte para poder acercarle mas al texto escrito)
        this.cursor = this.scene.add.text(0, 0, '|', style);
        this.cursor.setAlpha(0).setOrigin(0, 0.5);
        this.add(this.cursor);

        // Tween para simular que el cursor aparece y desaparece
        this.cursorTween = this.scene.tweens.add({
            targets: this.cursor,
            alpha: 1,
            duration: 300,
            hold: 600,          // tiempo en milisegundos para que el tween haga yoyo
            yoyo: true,
            repeat: -1,
            paused: true
        });

        let nCol = Phaser.Display.Color.HexStringToColor('#ffffff');
        let pCol = Phaser.Display.Color.GetColor(pressedColor.R, pressedColor.G, pressedColor.B);
        pCol = Phaser.Display.Color.IntegerToRGB(pCol);

        // Se cambia el color de la caja al pasar y sacar el raton por encima
        this.fillImg.on('pointerover', () => {
            scene.tweens.addCounter({
                targets: this.fillImg,
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(nCol, pCol, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    this.fillImg.setTint(colInt);
                },
                duration: 50,
                repeat: 0,
            });
        });
        this.fillImg.on('pointerout', () => {
            scene.tweens.addCounter({
                targets: this.fillImg,
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(pCol, nCol, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    this.fillImg.setTint(colInt);
                },
                duration: 50,
                repeat: 0,
            });
        });

        this.fillImg.on('pointerup', () => {
            // Si se clica en la caja de texto, es que el usuario quiere escribir en la caja
            if (!this.isEnteringName) {
                // Si no hay texto escrito, se quita el texto por defecto
                if (this.currentText === "") {
                    this.setText(this.currentText);
                    this.text.setAlpha(1).setFontStyle('normal');
                }

                // Se activa el cursor
                this.cursor.setAlpha(0);
                this.cursorTween.resume();

                // Se realiza la animacion de la caja cuando se ha clicado
                scene.tweens.addCounter({
                    targets: this.fillImg,
                    from: 0,
                    to: 100,
                    onUpdate: (tween) => {
                        const value = tween.getValue();
                        let col = Phaser.Display.Color.Interpolate.ColorWithColor(nCol, pCol, 100, value);
                        let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                        this.fillImg.setTint(colInt);
                    },
                    duration: 50,
                    repeat: 0,
                    yoyo: true
                });

                this.isEnteringName = true;

                // Habilitar el salir de la caja y dejar de escribir
                // Se tiene que hacer con un pequeño temporizador porque sino saltarian los dos eventos
                // de pointerup a la vez y entonces, no se podria llegar a escribir
                setTimeout(() => {
                    this.deactiveInput();
                }, 10);

            }
        })

        // Escribir texto en la caja
        this.scene.input.keyboard.on('keydown', (event) => {
            // Si se esta escribiendo en la caja, se van procesando las letras que se pulsan en el teclado
            if (this.isEnteringName) {
                let hasChanged = false;
                // Borrar caracter
                if (event.keyCode === 8 && this.currentText.length > 0) {
                    hasChanged = true;
                    this.currentText = this.currentText.slice(0, -1);
                }
                // Escribir un nuevo caracter
                // Nota: \s --> espacio
                else if (event.key.length === 1 && event.key.match(/[a-zA-Z0-9\s]/)) {
                    hasChanged = true;
                    this.currentText += event.key;
                }

                // Se puede escribir en la caja mas caracteres de los que visualmente caben.
                // Sin embargo, solo se van a mostrar los ultimos
                if (hasChanged) {
                    // Se comprueba si el texto actual se puede mostrar visualmente entero en la caja
                    this.setText(this.currentText);
                    let cont = 1;
                    // Si no caben todos los caracteres, se van quitando uno a uno del principio
                    // hasta encontrar cual es el maximo que se puede mostrar visualmente
                    while (this.text.width >= this.fillImg.displayWidth - this.offset * 2) {
                        let aux = this.currentText.slice(-(this.currentText.length - cont));
                        this.setText(aux);
                        ++cont;
                    }
                }
            }
        });

        this.setScale(scale);
    }

    deactiveInput() {
        // Se desactiva cualquier evento de pointerup que pudiera haber en la escena
        // (No es necesario, pero se hace por si acaso)
        this.scene.input.off('pointerup');
        // Se activa un evento de pointerup que se produce una sola vez al clicar en cualquier
        // lugar de la escena
        // Nota: los eventos de la escena tienen preferencia a los eventos de los objetos
        // Por lo tanto, pulsar en la escena no va a colisionar con pulsar en otra caja. Si este evento
        // estuviera activado, y se pulsara en una caja, seria este el que se lanzara y no el de la caja
        this.scene.input.once('pointerup', () => {
            // Se desactiva el poder escribir
            if (this.isEnteringName) {
                this.isEnteringName = false;

                // Se deja el texto ya escrito o si no se ha escrito ningun
                // texto, se vuelve al texto por defecto
                if (!this.currentText) {
                    this.setDefaultText();
                    //this.setText(this.defaultText);
                    //this.text.setAlpha(this.defaultTextAlpha).setFontStyle('italic');
                }

                // Se desactiva el cursor
                this.cursor.setAlpha(0);
                this.cursorTween.pause();
            }
        })
    }

    setText(text) {
        this.text.setText(text);
        this.cursor.x = this.text.x + this.text.width - 4;
    }

    getText() {
        return this.currentText;
    }

    isValid() {
        let aux = this.currentText !== "";
        return aux;
    }

    reset() {
        this.isEnteringName = false;
        this.currentText = "";
        this.setDefaultText();
        this.cursor.setAlpha(0);
        this.cursorTween.pause();
    }

    setDefaultText() {
        this.setText(this.defaultText);
        this.text.setAlpha(this.defaultTextAlpha).setFontStyle('italic');
    }
}