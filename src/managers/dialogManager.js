import TextBox from '../UI/dialog/textbox.js';
import OptionBox from '../UI/dialog/optionBox.js';
import GameManager from './gameManager.js';
import EventDispatcher from '../eventDispatcher.js';

export default class DialogManager {
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
            // Indica que ha empezado un dialogo
            this.talking = true;

            // Desactiva la caja de texto y las opciones (por si acaso)
            if (this.textbox) this.textbox.activate(false);
            this.activateOptions(false);

            // Cambia el nodo por el indicado
            this.currNode = node;
            this.processNode();
        }

    }

    // Procesa el nodo actual dependiendo de su tipo
    processNode() {
        // Si el nodo actual es valido
        if (this.currNode) {
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
                this.currNode = this.currNode.next[i];

                // Pasa al siguiente nodo
                this.processNode();
            }
            else if (this.currNode.type === "choice") {
                this.createOptions(this.currNode.choices);
                this.activateOptions(true);
            }
            else if (this.currNode.type === "text") {
                // Si el nodo no tiene texto, se lo salta y pasa al siguiente nodo
                // IMPORTANTE: DESPUES DE UN NODO DE DIALOGO SOLO HAY UN NODO, POR LO QUE 
                // EL SIGUIENTE NODO SERA EL PRIMER NODO DEL ARRAY DE NODOS SIGUIENTES
                if (this.currNode.dialogs[this.currNode.currDialog].text.length < 1) {
                    this.currNode = this.currNode.next[0];
                    this.processNode();
                }
                else {
                    this.textbox.setPortrait(this.portraits.get(this.currNode.character));
                    this.setText(this.currNode.dialogs[this.currNode.currDialog], true);
                    this.textbox.activate(true);
                }
            }
            else if (this.currNode.type === "event") {
                // Recorre todos los eventos del nodo y les hace dispatch
                for (let i = 0; i < this.currNode.events.length; i++) {
                    let evtName = this.currNode.events[i].name;
                    this.dispatcher.dispatch(evtName, this.currNode.events[i]);
                }

                // IMPORTANTE: DESPUES DE UN NODO DE EVENTO SOLO HAY UN NODO, POR LO QUE 
                // EL SIGUIENTE NODO SERA EL PRIMER NODO DEL ARRAY DE NODOS SIGUIENTES
                this.currNode = this.currNode.next[0];
                this.processNode();
            }
        }
        else {
            this.talking = false;
        }
    }

    // Pasa al siguiente dialogo
    // (llamado al hacer click en la caja de texto)
    nextDialog() {
        // Si aun no ha acabado de mostrarse todo el texto, lo muestra de golpe
        if (!this.textbox.finished) {
            this.textbox.forceFinish();
        }
        // Si ha acabado de mostrarse todo el dialogo
        else {
            // Actualiza el dialogo que se esta mostrando del nodo actual
            this.currNode.currDialog++;
            console.log(this.currNode);

            // Si aun no se han mostrado todos los dialogos del nodo, muestra el siguiente dialogo
            if (this.currNode.currDialog < this.currNode.dialogs.length) {
                this.setText(this.currNode.dialogs[this.currNode.currDialog], true);
            }
            // Si ya se han mostrado todos los dialogos
            else {
                // Se oculta la caja de texto y una vez terminada la animacion,
                // reinicia el dialogo del nodo actual y actualiza el nodo al siguiente
                this.textbox.activate(false, () => {
                    this.currNode.currDialog = 0;

                    // IMPORTANTE: DESPUES DE UN NODO DE DIALOGO SOLO HAY UN NODO, POR LO QUE 
                    // EL SIGUIENTE NODO SERA EL PRIMER NODO DEL ARRAY DE NODOS SIGUIENTES
                    this.currNode = this.currNode.next[0];
                    this.processNode();
                }, 0);
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

        // Actualiza el nodo actual y lo procesa
        this.currNode = this.currNode.next[index];
        this.processNode();

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