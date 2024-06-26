import Textbox from './textbox.js'

export default class DialogManager extends Phaser.Scene {
    /**
    * Gestor de los dialogos. Crea la caja de texto y el texto y se encarga de actualizarlos.
    * Los textos a escribir se deben establecer con el metodo setdialogs()
    * @extends Phaser.Scene
    */
    constructor() {
        super({ key: 'DialogManager' });

        this.textbox = null;
        this.dialogs = [];
        this.textCount = 0;
        this.lastCharacter = " ";
    }
    preload() {
        this.load.image('textbox', 'assets/textbox.png');
        this.load.image('textboxName', 'assets/textboxName.png');
    }

    create() {
        this.textbox = new Textbox(this);
        this.textbox.activate(false);

        // Pruebas
        this.playerName = "Paco";
    }

    // Pruebas
    test() {
        this.setdialogs([
            {
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Vulputate sapien nec sagittis aliquam. Massa vitae tortor condimentum lacinia. Duis tristique sollicitudin nibh sit amet commodo nulla facilisi. Libero nunc consequat interdum varius sit amet mattis vulputate. Molestie a iaculis at erat pellentesque adipiscing commodo elit. Id aliquet risus feugiat in ante metus dictum. Odio facilisis mauris sit amet massa. In aliquam sem fringilla ut morbi. Vel fringilla est ullamcorper eget nulla facilisi etiam dignissim. Tincidunt lobortis feugiat vivamus at augue eget. Ac turpis egestas integer eget aliquet. Urna cursus eget nunc scelerisque viverra mauris in aliquam. Ut placerat orci nulla pellentesque. Viverra nam libero justo laoreet sit amet cursus sit amet.",
                character: "player",
                name: " ",
            },
            {
                text: "texto2 texto2 texto2 texto2",
                character: "b",
                name: "Personaje 2",
            },
        ]);

        this.textbox.activate(true);
    }

    // Limpia los eventos de input
    shutdown() {
        this.input.keyboard.shutdown();
    }

    getPlayerName() { return this.playerName; }
    // Getters de las dimensiones del canvas
    getWidth() { return this.sys.game.canvas.width; }
    getHeight() { return this.sys.game.canvas.height; }


    /**
    * Cambia la serie de dialogos a mostrar
    * @param {Array} dialogs - la coleccion de dialogos que se mostraran
    */
    setdialogs(dialogs) {
        this.textCount = 0;
        this.dialogs = dialogs;

        var splitDialogs = [];      // Nuevo array de dialogos tras dividir los dialogos demasiado largos
        var i = 0;                  // Indice del dialogo en el array de dialogos
        var txt = "";               // Texto del dialogo a separar

        // Se establece el primer dialogo como el texto a separar
        if (this.dialogs.length > 0) txt = this.dialogs[i].text;

        // Mientras no se haya llegado al final de los dialogos
        while (i < this.dialogs.length) {
            // Cambia el texto a mostrar para obtener sus dimensiones 
            this.textbox.setText({
                text: txt,
                character: this.dialogs[i].character,
                name: this.dialogs[i].name
            }, false);

            // Si la altura del texto supera la de la caja de texto 
            if (this.textbox.currText.getBounds().height > this.textbox.height) {
                var words = txt.split(' ');    // Se separan todas las palabras del dialogo por espacios
                var nextText = "";              // Parte del dialogo que no cabe en el cuadro

                // Va quitando palabras del final del dialogo mientras supere la altura de la caja de texto
                while (this.textbox.currText.getBounds().height > this.textbox.height && words.length > 0) {
                    // Guarda la palabra del final y la pone al principio del texto que no cabe 
                    // en el cuadro (al principio, ya que se va recorriendo en orden inverso)
                    var currWord = words.pop();
                    currWord += " " + nextText;
                    nextText = currWord;

                    // Reconstruye el texto sin la palabra que se ha eliminado y lo actualiza
                    txt = words.join(' ');
                    this.textbox.setText({
                        text: txt,
                        character: this.dialogs[i].character,
                        name: this.dialogs[i].name
                    }, false);
                }

                // Mete el texto que cabe en la caja en el array de dialogos
                // y actualiza el texto a separar por el texto de ese dialogo
                // que no cabia en la caja 
                splitDialogs.push({
                    text: txt,
                    character: this.dialogs[i].character,
                    name: this.dialogs[i].name,
                });
                txt = nextText;
            }
            // Si la altura no supera la de la caja de texto, se guarda el texto 
            // actual en el array de dialogos y se pasa a mirar el siguiente
            else {
                splitDialogs.push({
                    text: txt,
                    character: this.dialogs[i].character,
                    name: this.dialogs[i].name,
                });
                i++;
                if (this.dialogs[i]) txt = this.dialogs[i].text;
            }
        }

        // Muestra el primer dialogo del array
        this.dialogs = splitDialogs;
        this.lastCharacter = this.dialogs[this.textCount].character;
        this.textbox.setText(this.dialogs[this.textCount], true);
    }


    // Pasa al siguiente dialogo
    nextDialog() {
        // Si no ha acabado de aparecer todo el texto, lo muestra de golpe
        if (!this.textbox.finished) {
            this.textbox.forceFinish();
        }
        else {
            // Actualiza el numero de dialogos
            this.textCount++;

            // Si aun no se han escrito todos los dialogos, 
            // escribe el siguiente
            if (this.textCount < this.dialogs.length) {
                if (this.dialogs[this.textCount].character === this.lastCharacter) {
                    this.textbox.setText(this.dialogs[this.textCount], true);
                }
                else {
                    this.textbox.changeCharacter(this.dialogs[this.textCount], true);
                }
            }
            // Si se han acabado, desactiva la caja de texto
            else {
                this.textbox.activate(false);
            }
        }

    }
}