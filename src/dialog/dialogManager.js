import TextBox from './textbox.js'
import OptionBox from './optionBox.js'
import GameManager from '../gameManager.js'


export default class DialogManager extends Phaser.Scene {
    /**
    * Gestor de los dialogos. Crea la caja de texto/opciones con su texto y se encarga de actualizarlos.
    * Los nodos de dialogos tienen que estar creados con antelacion (deberia hacerse en la constructora de la escena)
    * @extends Phaser.Scene
    */
    constructor() {
        super({ key: 'DialogManager' });

        this.textbox = null;                // Instancia de la caja de dialogo
        this.lastCharacter = "";            // Ultimo personaje que hablo
        this.options = [];                  // Cajas de opcion multiple
        this.currNode = null;               // Nodo actual
        this.portraits = new Map();         // Mapa para guardar los retratos en esta escena
    }

    create() {
        this.textbox = new TextBox(this);
        this.textbox.activate(false);
        this.activateOptions(false);

        // Mascara para los retratos de los personajes (para que no se pinten fuera de la caja de texto)
        let mask = this.add.image(this.textbox.box.x, this.textbox.box.y, 'textboxMask');
        // let mask = this.add.image(this.textbox.box.x, this.textbox.box.y, 'dialog', 'textboxMask.png');
        mask.setOrigin(this.textbox.box.originX, this.textbox.box.originY);
        mask.setScale(this.textbox.box.scaleX, this.textbox.box.scaleY);
        mask.setCrop(0, 0, 160, mask.displayHeight);
        mask.visible = false;
        this.portraitMask = mask.createBitmapMask();

        this.gameManager = GameManager.getInstance();

    }


    // IMPORTANTE: SE TIENE QUE LLAMAR ANTES DE CAMBIAR LA ESCENA
    // Destruye de la escena todos los retratos de los personajes para que
    // no de error al cambiar de escena porque los personajes ya no existan
    clearPortraits() {
        this.portraits.forEach((value, key) => {
            value.destroy();
        });
        this.portraits.clear();
    }

    /**
    * Metodo que se llama cuando se llama al changeScene de una escena 
    * @param {Phaser.Scene} scene - escena a la que se va a pasar
    */
    changeScene(scene) {
        // Coge todos los retratos de los personajes de la escena, 
        // los copia en esta escena, y les aplica la mascara
        scene.portraits.forEach((value, key) => {
            let p = this.add.existing(value);
            this.portraits.set(key, p);

            value.alpha = 0;
            value.setMask(this.portraitMask)
        });

        // Desactiva la caja de texto y las opciones (por si acaso)
        if (this.textbox) this.textbox.activate(false);
        this.activateOptions(false);
    }

    /**
    * Crea las opciones de eleccion multiple
    * @param {Array} opts - array con los strings con el texto a mostrar en las opciones
    */
    createOptions(opts) {
        // Limpia las opciones que hubiera anteriormente
        this.options.forEach((option) => { option.activate(false); });
        this.options = [];

        // Crea las opciones y las guarda en el array
        for (let i = 0; i < opts.length; i++) {
            this.options.push(new OptionBox(this, i, opts.length, opts[i]));
        }
    }

    /**
    * Activa/desactiva las cajas de opcion multiple
    * @param {Boolean} active - si se van a activar o no las opciones
    * @param {function} onComplete - funcion a la que llamar cuando acabe la animacion
    * @param {number} delay - tiempo en ms que tarda en llamarse a onComplete
    */
    activateOptions(active, onComplete, delay) {
        this.options.forEach((option) => { option.activate(active, onComplete, delay); });
    }

    /**
    * Elige la opcion sobre la que se ha hecho click (llamado desde la instancia correspondiente de OptionBox)
    * @param {Number} index - indice elegido
    */
    selectOption(index) {
        // Desactiva las opciones
        this.activateOptions(false);

        // Actualiza el nodo actual
        this.currNode.nextInd = index;
        this.currNode = this.currNode.next[this.currNode.nextInd];
        this.processNextNode();

        // Si el nodo actual es valido, actualiza el retrato del personaje por si acaso
        if (this.currNode) {
            this.textbox.setPortrait(this.currNode.character);
        }
    }

    /**
    * Cambia el nodo actual por el indicado
    * @param {DialogNode} node - nodo que se va a poner como nodo actual
    */
    setNode(node) {
        // Si no hay ningun dialogo activo
        if (!this.gameManager.isTalking()) {
            // Avisa al gameManager de que ha empezado uno
            this.gameManager.setTalking(true);

            // Desactiva la caja de texto y las opciones (por si acaso)
            if (this.textbox) this.textbox.activate(false);
            this.activateOptions(false);

            // Cambia el nodo por el indicado
            this.currNode = node;

            // Si el nodo es la raiz, pasa al siguiente nodo, ya que la
            // raiz solo contiene informacion de los nodos siguientes
            if (node.id === "root") {
                this.nextNode();
            }
        }


    }


    // Pasa al nodo siguiente dependiendo del tipo que sea el nodo actual y el nodo siguiente
    nextNode() {
        // Actualiza el ultimo personaje que tuvo un dialogo
        this.lastCharacter = this.currNode.character;

        // Si el nodo es un nodo condicional
        if (this.currNode.type === "condition") {
            let conditionMet = false;
            let i = 0;

            // Recorre todas las condiciones hasta que se haya cumplido la primera
            while (i < this.currNode.conditions.length && !conditionMet) {
                let allConditionsMet = true;
                let j = 0;

                // Se recorren todas las variables de la condicion mientras se cumplan todas
                while (j < this.currNode.conditions[i].length && allConditionsMet) {
                    // Coge el nombre de la variable, el operador y el valor esperado 
                    let variable = this.currNode.conditions[i][j].key;
                    let operator = this.currNode.conditions[i][j].operator;
                    let expectedValue = this.currNode.conditions[i][j].value;

                    // Busca el valor de la variable en el gameManager
                    let variableValue = this.gameManager.getValue(variable);

                    if (operator === "equal") {
                        conditionMet = variableValue === expectedValue;
                    }
                    else if (operator === "greater") {
                        conditionMet = variableValue >= expectedValue;

                    }
                    else if (operator === "lower") {
                        conditionMet = variableValue <= expectedValue;

                    }
                    else if (operator === "different") {
                        conditionMet = variableValue !== expectedValue;
                    }

                    // Se habran cumplido todas las condiciones si todas las condiciones
                    // se han cumplido anteriormente y esta tambien se ha cumplido
                    allConditionsMet &= conditionMet;

                    j++;
                }

                // Si no se ha cumplido ninguna condicion, pasa a la siguiente
                if (!conditionMet) i++;
            }

            // Actualiza el nodo actual con el primer nodo que cumpla una condicion
            this.currNode.nextInd = i;
            this.currNode = this.currNode.next[this.currNode.nextInd];

            // Procesa el siguiente nodo
            this.processNextNode()
        }
        // Si es un nodo de texto o de opcion multiple
        else if (this.currNode.type === "text" || this.currNode.type === "choice") {
            // Si no se ha acabado de escribir todo el texto, lo muestra entero de golpe
            if (!this.textbox.finished) {
                this.textbox.forceFinish();
            }
            // Si ya se ha mostrado todo el texto,
            else {
                // Actualiza el dialogo del nodo actual que se esta mostrando
                this.currNode.currDialog++;

                // Si aun no se han mostrado todos los dialogos del nodo, muestra el siguiente dialogo
                if (this.currNode.currDialog < this.currNode.dialogs.length) {
                    this.textbox.setText(this.currNode.dialogs[this.currNode.currDialog], true);
                    this.textbox.activate(true);
                }
                // Si ya se han mostrado todos los dialogos del nodo,
                else {
                    // Se reinicia el dialogo del nodo actual
                    this.currNode.currDialog = 0;
                    // Si es un nodo de tipo texto, 
                    if (this.currNode.type === "text") {
                        // Actualiza el dialogo actual por el siguiente. Un nodo de tipo texto solo
                        // puede llevar a un unico nodo de tipo texto, por lo que no se hace distincion
                        // de casos y se gestiona directamente intentando poner otra caja de texto 
                        this.currNode = this.currNode.next[this.currNode.nextInd];

                        this.processNextNode()
                    }
                    // Si es un nodo de opciocn multiple 
                    else if (this.currNode.type === "choice") {
                        // Desactiva la caja de texto y una vez desaparece, hace aparecer las opciones
                        this.textbox.activate(false, () => {
                            this.createOptions(this.currNode.choices);
                            this.activateOptions(true);
                        });
                    }
                }

            }

        }
        // Si el nodo actual es valido, se actualiza el retrato a mostrar
        if (this.currNode) {
            this.textbox.setPortrait(this.currNode.character);
        }
        // Si no, se ha acabado el dialogo y lo avisa al gameManager
        else {
            this.gameManager.setTalking(false);
        }

    }

    processNextNode() {
        // Si el nodo no es valido, se oculta la caja de texto
        if (!this.currNode || !this.currNode.id) {
            this.textbox.activate(false);
        }
        // Si el nodo es de condicion, comprueba el siguiente nodo
        else if (this.currNode.type === "condition") {
            this.nextNode();
        }
        // Si es un nodo de texto o de opcion multiple
        else if (this.currNode.type == "text" || this.currNode.type === "choice") {
            // Si el nodo no tiene texto, se lo salta
            if (this.currNode.dialogs[this.currNode.currDialog].text.length < 1) {
                this.nextNode();
            }
            else {
                // Si el ultimo personaje que hablo no es el mismo que el personaje 
                // que va a hablar (deberia serlo, pero se comprueba por si acaso)
                if (this.lastCharacter !== this.currNode.character) {
                    // Se oculta la caja de dialogo y una vez termine la animacion,
                    // se actualiza el texto a mostrar y se vuelve a mostrar la caja
                    this.textbox.activate(false, () => {
                        this.textbox.setText(this.currNode.dialogs[this.currNode.currDialog], true);
                        this.textbox.activate(true);
                    });
                }
                // Si el personaje es el mismo, se actualiza la caja de dialogo
                else {
                    this.textbox.setText(this.currNode.dialogs[this.currNode.currDialog], true);
                }

            }
        }


    }


}