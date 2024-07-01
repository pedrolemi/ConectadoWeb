import TextBox from './textbox.js'
import OptionBox from './optionBox.js'

export default class DialogManager extends Phaser.Scene {
    /**
    * Gestor de los dialogos. Crea la caja de texto y el texto y se encarga de actualizarlos.
    * Los textos a escribir se deben establecer con el metodo setDialogs(), y deben establecer
    * al momento de crear la escena.
    * @extends Phaser.Scene
    */
    constructor() {
        super({ key: 'DialogManager' });

        this.textbox = null;
        this.dialogs = [];
        this.textCount = 0;
        this.lastCharacter = "";
        this.playerName = "";

        this.options = [];
        this.selectedOption = null;
    }

    create() {
        this.textbox = new TextBox(this);
        this.textbox.activate(false);
        this.activateOptions(false);

        // let mask = this.add.image(this.textbox.box.x, this.textbox.box.y, 'textboxMask');
        let mask = this.add.image(this.textbox.box.x, this.textbox.box.y, 'dialog', 'textboxMask.png');
        mask.setOrigin(this.textbox.box.originX, this.textbox.box.originY);
        mask.setScale(this.textbox.box.scaleX, this.textbox.box.scaleY);
        mask.setCrop(0, 0, 160, mask.displayHeight);
        mask.visible = false;
        this.portraitMask = mask.createBitmapMask();
    }

    /**
    * Metodo que se llama cuando se llama al changeScene de una escena 
    * @param {Phaser.Scene} scene - escena a la que se va a pasar
    */
    changeScene(scene) {
        // Coge todos los retratos de los personajes de la escena y los copia en esta escena
        this.portraits = new Map();
        scene.portraits.forEach((value, key) => {
            let p = this.add.existing(value);
            this.portraits.set(key, p );
        });

        // Desactiva la caja de texto y las opciones (por si acaso)
        if (this.textbox) this.textbox.activate(false);
        this.activateOptions(false);
    }

    // Pruebas
    test1() {
        this.playerName = "Paco";
        this.activateOptions(false);

        this.finished = false;

        this.textCount = 0;
        this.lastCharacter = this.dialogs[this.textCount].character;
        this.textbox.setText(this.dialogs[this.textCount], true);

        this.textbox.activate(true);
    }

    test2() {
        this.textbox.activate(false);
        this.createOptions(["Opcion 1", "Opcion 2"]);
        this.activateOptions(true);
    }

    /**
    * Cambia la serie de dialogos a mostrar. Deberia llamarse una vez al crear la escena
    * @param {Array} dialogs - array de dialogos que se mostraran. Cada objeto debera tener los atributos text, character, name, ... (completar)
    */
    setDialogs(dialogs) {
        this.dialogs = this.splitDialogs(dialogs);
        this.textCount = 0;
        this.lastCharacter = this.dialogs[this.textCount].character;
        this.textbox.setText(this.dialogs[this.textCount], true);
    }
    
    /**
    * Prepara los dialogos por si alguno es demasiado largo y se sale de la caja de texto
    * @param {Array} dialogs - array de dialogos a preparar
    * @return {Array} - array con los dialogos ajustados
    */
    splitDialogs(dialogs) {
        let newDialogs = [];      // Nuevo array de dialogos tras dividir los dialogos demasiado largos
        let i = 0;                  // Indice del dialogo en el array de dialogos
        let dialogCopy = "";        // Copia del dialogo con todos sus atributos
        let currText = "";          // Texto a dividir

        // Mientras no se haya llegado al final de los dialogos
        while (i < dialogs.length) {
            // Cambia el texto a mostrar por el dialogo completo para obtener sus dimensiones 
            // (se copia la informacion del dialogo actual, pero se cambia el texto a mostrar)
            currText = dialogs[i].text;            
            dialogCopy = { ...dialogs[i] };
            dialogCopy.text = currText;
            this.textbox.setText(dialogCopy, false);

            // Si la altura del texto supera la de la caja de texto 
            if (this.textbox.currText.getBounds().height > this.textbox.height) {
                // Se separan todas las palabras del dialogo por espacios
                let words = currText.split(' ');
                let prevText = "";          // Texto antes de coger la siguiente palabra del dialogo
                let newText = "";           // Texto obtenido tras coger la siguiente palabra del dialogo
                let currWord = words[0];

                // Va recorriendo el array de palabras hasta que no quede ninguna
                while (words.length > 0) {
                    // Coge la primera palabra y actualiza tanto el
                    // texto anterior como el nuevo con dicha palabra
                    prevText = newText;
                    newText += " " + currWord;
                    
                    // Cambia el texto por el nuevo para calcular sus dimensiones
                    dialogCopy = { ...dialogs[i] };
                    dialogCopy.text = newText;
                    this.textbox.setText(dialogCopy, false);
                    
                    // Si no supera la altura de la caja de texto, saca la palabra del array
                    if (this.textbox.currText.getBounds().height <= this.textbox.height) {
                        words.shift();   
                        currWord = words[0]; 
                    }
                    // Si no, reinicia el texto y guarda el dialogo actual con el texto obtenido hasta el momento
                    else {
                        newText = "";
                        dialogCopy = { ...dialogs[i] };
                        dialogCopy.text = prevText;
                        newDialogs.push(dialogCopy);
                    }
                }
                // Una vez recorrido todo el dialogo, guarda el dialogo con el texto restante 
                prevText = newText;
                newText += " " + currWord;
                dialogCopy = { ...dialogs[i] };
                dialogCopy.text = prevText;
                newDialogs.push(dialogCopy);
                
                i++;
            }
            // Si la altura no supera la de la caja de texto, se guarda 
            // el dialogo actual y se pasa a mirar el siguiente
            else {
                dialogCopy = { ...dialogs[i] };
                dialogCopy.text = currText;
                newDialogs.push(dialogCopy);
                i++;
                if (dialogs[i]) currText = dialogs[i].text;
            }
        }

        return newDialogs;
    }

    
    createOptions(opts) {
        // Limpia las opciones que hubiera anteriormente
        this.options.forEach((option) => {
            option.activate(false, () => { option.destroy(); });
        });
        this.options = [];
        this.selectedOption = null;

        // Crea las opciones y las guarda en el array
        for (let i = 0; i < opts.length; i++) {
            this.options.push(new OptionBox(this, i, opts.length, opts[i]));
        }
    }

    // Activa/desactiva las cajas de opcion multiple
    activateOptions(active) {
        this.selectedOption = null;
        this.options.forEach((option) => { option.activate(active); });
    }

    selectOption(index) {
        this.activateOptions(false);
        this.selectedOption = index;
        console.log("Selected option " + index);
    }


    // Pasa al siguiente dialogo
    nextDialog() {
        // Si no ha acabado de aparecer todo el texto, lo muestra de golpe
        if (!this.textbox.finished) {
            this.textbox.forceFinish();
        }
        else {
            // Actualiza el ultimo personaje que ha hablado
            this.lastCharacter = this.dialogs[this.textCount].character;
            
            // Actualiza el numero de dialogos
            this.textCount++;

            // Si aun no se han escrito todos los dialogos, escribe el siguiente
            if (this.textCount < this.dialogs.length) {
                // Si es el mismo personaje el que habla, solo cambia el texto a mostrar
                if (this.dialogs[this.textCount].character === this.lastCharacter) {
                    this.textbox.setText(this.dialogs[this.textCount], true);
                }
                // Si es otro, oculta la caja de texto y una vez oculta,
                // actualiza el texto y el personaje y vuelve a mostrar la caja
                else {
                    this.textbox.activate(false, () => {
                        this.textbox.setText(this.dialogs[this.textCount], true);
                        this.textbox.activate(true);
                    });
                }

                // Cambia el retrato a mostrar
                this.textbox.setPortrait(this.dialogs[this.textCount].character);
            }
            // Si se han acabado, desactiva la caja de texto
            else {
                this.textbox.activate(false);
            }
        }

    }
}