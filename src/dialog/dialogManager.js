import TextBox from './textbox.js'
import OptionBox from './optionBox.js'

export default class DialogManager extends Phaser.Scene {
    /**
    * Gestor de los dialogos. Crea la caja de texto y el texto y se encarga de actualizarlos.
    * Los textos a escribir se deben establecer con el metodo splitDialogs()
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

        let mask = this.add.image(this.textbox.box.x, this.textbox.box.y, 'dialog', 'textboxMask.png');
        mask.setOrigin(this.textbox.box.originX, this.textbox.box.originY);
        mask.setScale(this.textbox.box.scaleX, this.textbox.box.scaleY);
        mask.setCrop(0, 0, 160, mask.displayHeight);
        mask.visible = false;
        this.portraitMask = mask.createBitmapMask();
    }

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
        
        let i18next = this.plugins.get('rextexttranslationplugin');
        let dialog = {}
        dialog.text = i18next.t('dialog.text', { ns: 'day1', name: 'John', context: 'male' });
        dialog.character = i18next.t('dialog.character', { ns: 'day1' });
        dialog.name = i18next.t('dialog.name', { ns: 'day1' });

        this.splitDialogs([
            {
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Arcu non sodales neque sodales ut etiam sit amet. Tempus urna et pharetra pharetra massa massa ultricies. Pellentesque dignissim enim sit amet. Sit amet justo donec enim diam vulputate ut pharetra sit. Quisque sagittis purus sit amet volutpat. Nulla posuere sollicitudin aliquam ultrices sagittis orci. Euismod elementum nisi quis eleifend quam. Imperdiet sed euismod nisi porta lorem mollis aliquam. Lacus vestibulum sed arcu non odio euismod lacinia at quis.",
                character: "player",
                name: " ",
            },
            {
                text: "Sit amet consectetur adipiscing elit ut aliquam purus sit. In nibh mauris cursus mattis molestie a iaculis at. Laoreet sit amet cursus sit amet dictum. Tellus mauris a diam maecenas sed enim. Diam donec adipiscing tristique risus nec feugiat in fermentum. Vulputate dignissim suspendisse in est ante. Scelerisque felis imperdiet proin fermentum leo vel. Id eu nisl nunc mi. Quam id leo in vitae. Posuere ac ut consequat semper viverra. Quam vulputate dignissim suspendisse in est. Volutpat sed cras ornare arcu dui vivamus arcu felis bibendum. Egestas tellus rutrum tellus pellentesque eu tincidunt tortor aliquam nulla. Commodo viverra maecenas accumsan lacus vel facilisis. Varius sit amet mattis vulputate enim nulla. Aenean sed adipiscing diam donec. Tempor id eu nisl nunc mi ipsum faucibus. Quisque sagittis purus sit amet volutpat.",
                character: "mom",
                name: "Personaje 2",
            },
            {
                text: "Purus semper eget duis at tellus at urna. Quam elementum pulvinar etiam non quam lacus suspendisse faucibus interdum. Et molestie ac feugiat sed lectus vestibulum mattis ullamcorper. Diam maecenas ultricies mi eget mauris pharetra et ultrices. Convallis aenean et tortor at risus viverra adipiscing. Facilisis magna etiam tempor orci eu lobortis elementum nibh tellus. Mi quis hendrerit dolor magna eget est lorem ipsum. Sit amet facilisis magna etiam. Netus et malesuada fames ac turpis egestas. Nam at lectus urna duis. Tortor condimentum lacinia quis vel eros donec ac. Suscipit adipiscing bibendum est ultricies integer quis auctor elit. Urna et pharetra pharetra massa. A diam maecenas sed enim ut sem viverra. Ligula ullamcorper malesuada proin libero nunc. Id donec ultrices tincidunt arcu non sodales neque sodales ut. In mollis nunc sed id semper risus.",
                character: "dad",
                name: "La pola",
            },
            {
                text: "Etiam tempor orci eu lobortis elementum nibh tellus. Ornare suspendisse sed nisi lacus sed viverra tellus in hac. Commodo viverra maecenas accumsan lacus vel facilisis volutpat. Pellentesque habitant morbi tristique senectus. Augue eget arcu dictum varius duis at consectetur. Id volutpat lacus laoreet non curabitur gravida. Pharetra vel turpis nunc eget lorem dolor. Ac feugiat sed lectus vestibulum mattis ullamcorper velit. Neque viverra justo nec ultrices dui. Aliquam etiam erat velit scelerisque in dictum non consectetur. Massa sed elementum tempus egestas. Ultrices vitae auctor eu augue. Eu sem integer vitae justo eget magna fermentum iaculis.",
                character: "player",
                name: " ",
            },
            dialog
        ]);
        this.finished = false;
        this.textbox.activate(true);
    }

    test2() {
        this.textbox.activate(false);
        this.createOptions(["Opcion 1", "Opcion 2"]);
        this.activateOptions(true);
    }

    /**
    * Cambia la serie de dialogos a mostrar
    * @param {Array} dialogs - la coleccion de dialogos que se mostraran. Cada objeto debera tener los atributos text, character, name (completar)
    */
    splitDialogs(dialogs) {
        let splitDialogs = [];      // Nuevo array de dialogos tras dividir los dialogos demasiado largos
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
                        splitDialogs.push(dialogCopy);
                    }
                }
                // Una vez recorrido todo el dialogo, guarda el dialogo con el texto restante 
                prevText = newText;
                newText += " " + currWord;
                dialogCopy = { ...dialogs[i] };
                dialogCopy.text = prevText;
                splitDialogs.push(dialogCopy);
                
                i++;
            }
            // Si la altura no supera la de la caja de texto, se guarda 
            // el dialogo actual y se pasa a mirar el siguiente
            else {
                dialogCopy = { ...dialogs[i] };
                dialogCopy.text = currText;
                splitDialogs.push(dialogCopy);
                i++;
                if (dialogs[i]) currText = dialogs[i].text;
            }
        }

        // Actualiza los dialogos
        this.textCount = 0;
        this.dialogs = splitDialogs;
        this.lastCharacter = this.dialogs[this.textCount].character;
        this.textbox.setText(this.dialogs[this.textCount], true);
    }

    
    createOptions(opts) {
        // Limpia las opciones
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