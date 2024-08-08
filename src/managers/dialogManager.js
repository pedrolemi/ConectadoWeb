import TextBox from '../UI/dialog/textBox.js';
import OptionBox from '../UI/dialog/optionBox.js';
import GameManager from './gameManager.js';

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
        this.allPortraits = new Set();

        this.gameManager = GameManager.getInstance();
        this.dispatcher = this.gameManager.dispatcher;

        this.textbox = new TextBox(scene, this);

        // Mascara para los retratos de los personajes (para que no se pinten fuera de la caja de texto)
        let mask = scene.add.image(this.textbox.getTransform().x, this.textbox.getTransform().y, 'textboxMask');
        // let mask = this.add.image(this.textbox.box.x, this.textbox.box.y, 'dialog', 'textboxMask.png');
        mask.setOrigin(this.textbox.getTransform().originX, this.textbox.getTransform().originY);
        mask.setScale(this.textbox.getTransform().scaleX, this.textbox.getTransform().scaleY);
        mask.setCrop(0, 0, 160, mask.displayHeight);
        mask.visible = false;
        this.portraitMask = mask.createBitmapMask();

        this.setTalking(false);

        // Anade un rectangulo para bloquear la interaccion con los elementos del fondo
        this.bgBlock = scene.add.rectangle(0, 0, this.scene.CANVAS_WIDTH, this.scene.CANVAS_HEIGHT, 0xfff, 0).setOrigin(0, 0);
        this.bgBlock.setDepth(this.textbox.box.depth - 1);
        this.bgBlock.on('pointerdown', () => {
            if (this.textbox.box.input.enabled && this.textbox.box.alpha > 0) {
                this.nextDialog();
            }
        });

        this.textbox.activate(false);
        this.bgBlock.disableInteractive();
        this.activateOptions(false);
    }


    /**
     * Metodo que elimina de esta escena todos los retratos guardados
     * anteriormente para que no de error al destruir las escenas 
     */
    clearScene() {
        this.portraits.clear();
        this.allPortraits.forEach((portrait) => {
            portrait.destroy();
        });
        this.allPortraits.clear();
    }

    /**
    * Metodo que se llama cuando se llama al changeScene de una escena 
    * @param {Phaser.Scene} scene - escena a la que se va a pasar
    */
    changeScene(scene) {
        // Desactiva la caja de texto y las opciones (por si acaso)
        if (this.textbox) {
            this.textbox.activate(false);
            this.bgBlock.disableInteractive();
        }
        this.activateOptions(false);
        this.portraits.clear();

        // Coge todos los retratos de los personajes de la escena, 
        // los copia en esta escena, y les aplica la mascara
        scene.portraits.forEach((value, key) => {
            // Guarda los retratos de todas las escenas que se ejecutan sin destuirse, ya que al
            // cambiar de escena, se pierde la referncia a los retratos, pero siguen existiendo
            this.allPortraits.add(value);

            let p = this.scene.add.existing(value);
            this.portraits.set(key, p);
            p.alpha = 0;
            p.setMask(this.portraitMask);
        });
    }


    /**
    * Devuelve el retrato del personaje indicado
    * @param {String} character - id del personaje
    * @returns {Phaser.Image} - imagen con el retrato del personaje. 
    *                          Devuelve null si la id no esta en el mapa de retratos 
    */
    getPortrait(character) {
        return this.portraits.get(character);
    }

    /**
    * Cambia el texto de la caja
    * @param {String} text - texto a escribir
    * @param {Boolean} animate - si se va a animar el texto o no
    */
    setText(dialogInfo, animate) {
        this.textbox.setText(dialogInfo, animate);
    }

    /**
    * Devuelve si el texto de la caja supera la altura maxima
    * @returns {boolean} - true si la caja supera la altura maxima, false en caso contrario
    */
    textTooBig() {
        return (this.textbox.textTooBig());
    }

    /**
    * Cambia el nodo actual por el indicado
    * @param {DialogNode} node - nodo que se va a poner como nodo actual
    */
    setNode(node) {
        // Si no hay ningun dialogo activo y el nodo a poner es valido
        if (!this.isTalking() && node) {
            // Indica que ha empezado un dialogo
            this.setTalking(true);

            // Desactiva la caja de texto y las opciones (por si acaso)
            if (this.textbox) {
                this.textbox.activate(false);
                this.bgBlock.disableInteractive();
            }
            this.activateOptions(false);

            // Cambia el nodo por el indicado
            this.currNode = node;
            this.processNode(node);
        }
        else {
            this.textbox.activate(false);
            this.bgBlock.disableInteractive();
            this.setTalking(false);
            this.bgBlock.disableInteractive();
        }
    }

    /**
     * Procesa el nodo de condicion que se le pase como parametro
     * @param {DialogNode} node - Nodo a procesar 
     * @returns {Number} - indice del siguiente nodo
     */
    processCondition(node) {
        let conditionMet = false;
        let i = 0;

        // Recorre todas las condiciones hasta que se haya cumplido la primera
        while (i < node.conditions.length && !conditionMet) {
            let allConditionsMet = true;
            let j = 0;

            // Se recorren todas las variables de la condicion mientras se cumplan todas
            while (j < node.conditions[i].length && allConditionsMet) {
                // Coge el nombre de la variable, el operador y el valor esperado 
                let variable = node.conditions[i][j].key;
                let operator = node.conditions[i][j].operator;
                let expectedValue = node.conditions[i][j].value;

                // Busca el valor de la variable en la blackboard indicada. 
                // Si no es valida, buscara por defecto en el gameManager
                let variableValue = this.gameManager.getValue(variable, node.conditions[i][j].blackboard);
                // console.log(variable + " " + variableValue);

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
        return i;
    }

    /**
     * Procesa el nodo de evento que se le pasa como parametro
     * @param {DialogNode} node - nodo a procesar 
     */
    processEvent(node) {
        // Recorre todos los eventos del nodo y les hace dispatch con el delay establecido (si tienen)
        for (let i = 0; i < node.events.length; i++) {
            let evt = node.events[i];

            let delay = 0
            if (evt.delay) {
                delay = evt.delay;
            }
            setTimeout(() => {
                this.dispatcher.dispatch(evt.name, evt);

                // Si el evento establece el valor de una variable, lo cambia en la 
                // blackboard correspondiente (la de la escena o la del gameManager)
                let blackboard = this.gameManager.blackboard;
                if (evt.global !== undefined && evt.global === false) {
                    blackboard = evt.blackboard;
                }
                if (evt.variable && evt.value !== undefined) {
                    this.gameManager.setValue(evt.variable, evt.value, blackboard);
                }
            }, delay);
        }
    }

    // Procesa el nodo actual dependiendo de su tipo
    processNode() {
        // Si el nodo actual es valido
        if (this.currNode) {
            this.bgBlock.setInteractive();
            // Si el nodo es un nodo condicional
            if (this.currNode.type === "condition") {
                let i = this.processCondition(this.currNode);

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
                    // Funcion a ejecutar para mostrar la caja. Actualiza el retrato y el texto y activa la caja
                    let showBox = () => {
                        this.textbox.setPortrait(this.portraits.get(this.currNode.character));
                        this.textbox.centerText(this.currNode.centered);
                        this.setText(this.currNode.dialogs[this.currNode.currDialog], true);
                        this.textbox.activate(true);
                    }

                    // Si el ultimo personaje que hablo es distinto del que habla ahora, se oculta la caja y luego se muestra
                    if (this.currNode.character !== this.lastCharacter) {
                        this.textbox.activate(false, () => {
                            showBox();
                        }, 0);
                    }
                    // Si no, se muestra directamente. Si la caja ya estaba activa, no vuelve a mostrarla
                    else {
                        showBox();
                    }
                }
            }
            else if (this.currNode.type === "event") {
                this.processEvent(this.currNode);

                // IMPORTANTE: DESPUES DE UN NODO DE EVENTO SOLO HAY UN NODO, POR LO QUE 
                // EL SIGUIENTE NODO SERA EL PRIMER NODO DEL ARRAY DE NODOS SIGUIENTES
                this.currNode = this.currNode.next[0];
                this.processNode();
            }
            else if (this.currNode.type === "chatMessage") {
                this.setTalking(false);
                this.scene.phoneManager.phone.setChatNode(this.currNode.chat, this.currNode);
            }
            else if (this.currNode.type === "socialNetMessage") {
                // Funcion comun (se anade el comentario al post y se procesa el nodo)
                let fnAux = () => {
                    this.gameManager.computerScene.socialNetScreen.addCommentToPost(this.currNode.owner, this.currNode.postName,
                        this.currNode.character, this.currNode.name, this.currNode.text);

                    this.currNode = this.currNode.next[0];
                    this.processNode();
                }
                // Si el retraso es 0...
                if (this.currNode.replyDelay <= 0) {
                    // Se procesa inmediatamente
                    // Importante: se hace de esta manera porque aunque setTimeout permite un delay de 0 segundos,
                    // el codigo no se procesa al instante.
                    // Es muy importante que los mensaje con un delay de 0 segundos se procesen al instante porque al crear un post
                    // se anade una lista larga de mensajes iniciales y si no se procesan en orden, this.currNode se vuelve loco
                    fnAux();
                }
                // Sino...
                else {
                    // Se usa un timeout
                    setTimeout(() => {
                        fnAux();
                    }, this.currNode.replyDelay);
                }
            }
        }
        else {
            // Se resetea la configuracion del texto de la caja por si se habia cambiado a la de por defecto
            this.textbox.resetTextConfig();
            this.textbox.activate(false);
            this.bgBlock.disableInteractive();
            this.setTalking(false);
        }
    }

    // Pasa al siguiente dialogo
    // (llamado al hacer click en la caja de texto)
    nextDialog() {
        if (this.currNode.type === "text") {
            // Si aun no ha acabado de mostrarse todo el texto, lo muestra de golpe
            if (!this.textbox.finished) {
                this.textbox.forceFinish();
            }
            // Si ha acabado de mostrarse todo el dialogo
            else {
                // Actualiza el dialogo que se esta mostrando del nodo actual
                this.currNode.currDialog++;
                // Si aun no se han mostrado todos los dialogos del nodo, muestra el siguiente dialogo
                if (this.currNode.currDialog < this.currNode.dialogs.length) {
                    this.setText(this.currNode.dialogs[this.currNode.currDialog], true);
                }
                // Si ya se han mostrado todos los dialogos
                else {
                    // Actualiza el ultimo personaje que ha balado
                    this.lastCharacter = this.currNode.character;

                    // Se reinicia el dialogo del nodo actual y actualiza el nodo al siguiente
                    // IMPORTANTE: DESPUES DE UN NODO DE DIALOGO SOLO HAY UN NODO, POR LO QUE 
                    // EL SIGUIENTE NODO SERA EL PRIMER NODO DEL ARRAY DE NODOS SIGUIENTES
                    this.currNode.currDialog = 0;
                    this.currNode = this.currNode.next[0];
                    this.processNode();
                }
            }

        }
    }



    /**
    * Crea las opciones de eleccion multiple
    * @param {Array} opts - array con los strings/opciones a mostrar
    */
    createOptions(opts) {
        // Limpia las opciones que hubiera anteriormente
        for (let i = 0; i < this.options.length; i++) {
            this.options[i].activate(false);
        }
        this.options = [];

        // Crea las opciones y las guarda en el array
        for (let i = 0; i < opts.length; i++) {
            this.options.push(new OptionBox(this.scene, this, i, opts.length, opts[i].text));
        }

    }

    /**
    * Activa/desactiva las cajas de opcion multiple
    * @param {Boolean} active - si se van a activar o no las opciones
    * @param {Function} onComplete - funcion a la que llamar cuando acabe la animacion
    * @param {Number} delay - tiempo en ms que tarda en llamarse a onComplete
    */
    activateOptions(active, onComplete = {}, delay = 0, instant = false) {
        // Dependiendo de si es instantaneo o no, se ocultan las opciones con animacion o sin ella. 
        // Oculta primero la caja de texto por si acaso y luego muestra las opciones
        this.textbox.activate(false, () => {
            for (let i = 0; i < this.options.length; i++) {
                if (instant) {
                    this.options[i].box.visible = active;
                    this.options[i].text.visible = active;
                }
                else {
                    this.options[i].activate(active);
                }
            }

            // Si la funcion es valida, se ejecuta con el retardo indicado
            if (onComplete !== null && typeof onComplete === 'function') {
                setTimeout(() => {
                    onComplete();
                }, delay);
            }
        });
    }

    /**
    * Elige la opcion sobre la que se ha hecho click (llamado desde la instancia correspondiente de OptionBox)
    * @param {Number} index - indice elegido
    */
    selectOption(index) {
        // Desactiva las opciones
        this.activateOptions(false);

        let next = this.currNode.next[index];

        // Si la opcion no se puede elegir de nuevo, elimina tanto la opcion
        // como el nodo al que lleva de sus arrays correspondientes
        if (!this.currNode.choices[index].repeat) {
            this.currNode.choices.splice(index, 1);
            this.currNode.next.splice(index, 1);
        }

        // Actualiza el nodo actual y lo procesa            
        this.currNode.selectedOption = index;
        this.currNode = next;
        this.processNode();
    }

    /**
    * Metodo que se llama cuando inicia o termina un dialogo 
    * @param {Boolean} talking - true si el dialogo inicia, false si acaba
    */
    setTalking(talking) {
        this.talking = talking;
    }

    /**
    * Metodo para comprobar si un dialogo esta activo o no
    * @returns {boolean} - true si hay un dialogo activo, false en caso contrario
    */
    isTalking() {
        return this.talking;
    }
}