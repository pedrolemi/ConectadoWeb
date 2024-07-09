import TextBox from '../UI/dialog/textbox.js';
import OptionBox from '../UI/dialog/optionBox.js';
import GameManager from './gameManager.js';
import EventDispatcher from '../eventDispatcher.js';

export default class DialogManager  {
    /**
    * Gestor de los dialogos. Crea la caja de texto/opciones con su texto y se encarga de actualizarlos.
    * Los nodos de dialogos tienen que estar creados con antelacion (deberia hacerse en la constructora de la escena)
    */
    constructor(scene) {
        this.scene = scene;

        this.textbox = null;                // Instancia de la caja de dialogo
        this.lastCharacter = "";            // Ultimo personaje que hablo
        this.options = [];                  // Cajas de opcion multiple
        this.currNode = null;               // Nodo actual
        this.portraits = new Map();         // Mapa para guardar los retratos en esta escena

        this.gameManager = GameManager.getInstance();
        this.dispatcher = EventDispatcher.getInstance();

        this.textbox = new TextBox(scene, this);
        this.textbox.activate(false);
        this.activateOptions(false);

        // Mascara para los retratos de los personajes (para que no se pinten fuera de la caja de texto)
        let mask = scene.add.image(this.textbox.getTransform().x, this.textbox.getTransform().y, 'textboxMask');
        // let mask = this.add.image(this.textbox.box.x, this.textbox.box.y, 'dialog', 'textboxMask.png');
        mask.setOrigin(this.textbox.getTransform().originX, this.textbox.getTransform().originY);
        mask.setScale(this.textbox.getTransform().scaleX, this.textbox.getTransform().scaleY);
        mask.setCrop(0, 0, 160, mask.displayHeight);
        mask.visible = false;
        this.portraitMask = mask.createBitmapMask();

        this.talking = false;
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
            let p = this.scene.add.existing(value);
            this.portraits.set(key, p);

            value.alpha = 0;
            value.setMask(this.portraitMask)
        });

        // Desactiva la caja de texto y las opciones (por si acaso)
        if (this.textbox) this.textbox.activate(false);
        this.activateOptions(false);
    }


    /**
    * Devuelve el retrato del personaje indicado
    * @param {string} character - id del personaje
    * @return {Phaser.Image} - imagen con el retrato del personaje. 
    *                          Devuelve null si la id no esta en el mapa de retratos 
    */
    getPortrait(character) {
        return this.portraits.get(character);
    }

    /**
    * Cambia el texto de la caja
    * @param {string} text - texto a escribir
    * @param {boolean} animate - si se va a animar el texto o no
    */
    setText(dialogInfo, animate) {
        this.textbox.setText(dialogInfo, animate);
    }

    /**
    * Devuelve si el texto de la caja supera la altura maxima
    * @return {boolean} - true si la caja supera la altura maxima, false en caso contrario
    */
    textTooBig() {
        return (this.textbox.textTooBig());
    }

    /**
    * Cambia el nodo actual por el indicado
    * @param {DialogNode} node - nodo que se va a poner como nodo actual
    */
    setNode(node) {
        // Si no hay ningun dialogo activo
        if (!this.isTalking()) {
            // Avisa al gameManager de que ha empezado uno
            this.talking = true;

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
    
    

    // Dependiendo del tipo del nodo actual, actualiza cual es el indice del nodo al que tiene que ir despues
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

            // El indice del siguiente nodo sera el primero que cumpla una de las condiciones
            this.currNode.nextInd = i;

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
                    this.setText(this.currNode.dialogs[this.currNode.currDialog], true);
                    this.textbox.activate(true);
                }
                // Si ya se han mostrado todos los dialogos del nodo,
                else {
                    // Se reinicia el dialogo del nodo actual
                    this.currNode.currDialog = 0;

                    // Si es un nodo de tipo texto, 
                    if (this.currNode.type === "text") {
                        // Un nodo de tipo texto (unicamente con texto, sin opciones ni condiciones) solo puede llevar
                        // a un unico nodo, por lo que el siguiente nodo sera el primero de la lista de nodos siguientes
                        this.currNode.nextInd = 0;
                        this.processNextNode();
                    }
                    // Si es un nodo de opcion multiple 
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
            this.textbox.setPortrait(this.portraits.get(this.currNode.character));
        }
        // Si no, se ha acabado el dialogo y lo avisa al gameManager
        else {
            this.talking = false;
        }

    }

    // Actualiza el nodo por el nodo siguiente y gestiona los cambios correspondientes
    processNextNode() {
        for (let i = 0; i < this.currNode.signals.length; i++) {
            let evtName = this.currNode.signals[i].name;
            this.dispatcher.dispatch(evtName, this.currNode.signals[i]);
        }

        // Actualiza el nodo actual
        this.currNode = this.currNode.next[this.currNode.nextInd];

        // Si el nodo no es valido, se oculta la caja de texto
        if (!this.currNode || !this.currNode.id) {
            this.textbox.activate(false);
        }
        else {
            if (this.currNode.type === "condition") {
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
                            this.setText(this.currNode.dialogs[this.currNode.currDialog], true);
                            this.textbox.activate(true);
                        });
                    }
                    // Si el personaje es el mismo, se actualiza la caja de dialogo
                    else {
                        this.setText(this.currNode.dialogs[this.currNode.currDialog], true);
                    }

                }
            }
        }

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
            this.options.push(new OptionBox(this.scene, this, i, opts.length, opts[i]));
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
        this.processNextNode();

        // Si el nodo actual es valido, actualiza el retrato del personaje por si acaso
        if (this.currNode) {
            this.textbox.setPortrait(this.portraits.get(this.currNode.character));
        }
    }

    /**
    * Metodo que se llama cuando inicia o termina un dialogo 
    * @param {boolean} talking - true si el dialogo inicia, false si acaba
    */
    setTalking(talking) {
        this.talking = talking;
    }

    /**
    * Metodo para comprobar si un dialogo esta activo o no
    * @return {boolean} - true si hay un dialogo activo, false en caso contrario
    */
    isTalking() {
        return this.talking;
    }


}