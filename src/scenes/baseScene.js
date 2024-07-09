import DialogNode from '../UI/dialog/dialogNode.js';
import GameManager from '../managers/gameManager.js';

export default class BaseScene extends Phaser.Scene {
    constructor(name) {
        super({ key: name });
    }

    create() {
        this.CANVAS_WIDTH = this.sys.game.canvas.width;
        this.CANVAS_HEIGHT = this.sys.game.canvas.height;

        // Obtiene el dialogManager (tendria que haberse iniciado antes que la escena)
        this.gameManager = GameManager.getInstance();
        this.dialogManager = this.gameManager.getDialogManager();

        // Obtiene el plugin de i18n del GameManager
        this.i18next = this.gameManager.i18next;

        // Crea el mapa para los retratos de los personajes
        this.portraits = new Map();
        this.portraitX = 110;
        this.portraitY = 980;
        this.portraitScale = 0.1;

        // Transform del retrato con posicion y escala 
        this.portraitTr = {
            x: this.portraitX,
            y: this.portraitY,
            scale: this.portraitScale
        };

        this.leftBound = 0;
        this.rightBound = this.CANVAS_WIDTH;
        this.START_SCROLLING = 50;
        this.CAMERA_SPEED = 3;
    }
    
    preUpdate(t, dt) {
        super.preUpdate(t, dt);
    }

    update(t, dt) {
        super.update(t, dt);

        // Scroll de la camara. Si el raton esta a la izquierda y el scroll de la camara no es inferior al del
        // extremo izquierdo, la mueve hacia la izquierda y lo mismo para el extremo derecho del canvas
        if (this.game.input.mousePointer.x < this.START_SCROLLING && this.cameras.main.scrollX > this.leftBound + this.CAMERA_SPEED) {
            this.cameras.main.scrollX -= this.CAMERA_SPEED;
        }
        else if (this.game.input.mousePointer.x > this.CANVAS_WIDTH - this.START_SCROLLING 
                 && this.cameras.main.scrollX < this.rightBound - this.CANVAS_WIDTH - this.CAMERA_SPEED)
        {
            this.cameras.main.scrollX += this.CAMERA_SPEED;
        }
    }



    /**
    * Va leyendo el json y creando los nodos de manera recursiva
    * 
    * IMPORTANTE 1: Si para ir al siguiente nodo hay una condicion o seleccion de
    * opcion previa, las condiciones u opciones se guardan en el nodo actual,
    * haciendo que dicho nodo tenga las propiedades choices o conditions.
    * Esto implica que, aunque un nodo tenga texto, si tiene esas propiedades,
    * no se lo catalogara como nodo de tipo texto, por lo que un nodo de
    * tipo texto solo tiene un nodo siguiente y es de tipo texto
    * En principio, un nodo solo puede ser de opcion o de condicion a la vez.
    * 
    * IMPORTANTE 2: En un nodo con condiciones, cada condicion lleva a otro nodo distinto.
    * Al momento de llegar a un nodo condicion, el siguiente nodo al nodo con condiciones
    * sera el nodo indicado como siguiente en la primera condicion que se cumpla (se van 
    * comprobando en el orden en el que se han leido). Cada condicion puede tener varios 
    * requisitos (variables), en cuyo caso, la condicion solo se cumplira si todos sus
    * requisitos se cumplen (operador &&. De momento no hay soporte para el operador || ) 
    * 
    * 
    * @param {String} id - id del nodo que se lee. El nodo inicial es root
    * @param {String} namespace - nombre del archivo del que se va a leer
    * @param {String} playerName - nombre del jugador
    * @param {String} context - contexto en el que se va a referir al personaje (male / female)
    * @param {boolean} getObjs - si se quiere devolver el nodo leido como un objeto 
    */
    readNodes(id, namespace, playerName, context, getObjs) {
        // Lee el nodo del json con la id indicada
        let jsonNode = this.i18next.t(id, { ns: namespace, name: playerName, context: context, returnObjects: getObjs });

        // Crea el nodo y establece sus atributos
        let currNode = new DialogNode();
        currNode.name = jsonNode.name;
        currNode.character = jsonNode.character_uuid;
        currNode.parent = jsonNode.parent;
        currNode.id = id;
        currNode.type = "text";

        // Si el nodo tiene la propiedad choices, 
        if (jsonNode.hasOwnProperty("choices")) {
            currNode.type = "choice";

            // Se leen todas las opciones disponibles
            for (let i = 0; i < jsonNode.choices.length; i++) {
                // Se guarda el texto de la eleccion y se crea de manera recursiva
                //  el nodo siguiente que corresponde a elegir dicha opcion
                currNode.choices.push(jsonNode.choices[i].text);
                currNode.next.push(this.readNodes(jsonNode.choices[i].next, namespace, playerName, context, getObjs))
            }
        }
        // Si el nodo tiene la propiedad conditions
        else if (jsonNode.hasOwnProperty("conditions")) {
            currNode.type = "condition";

            // Se leen todas las condiciones. Cada condicion lleva a un nodo distinto y 
            // en una condicion se pueden comprobar multiples variables
            for (let i = 0; i < jsonNode.conditions.length; i++) {

                // Obtiene el nombre de las variables a comprobar
                // (suprimiendo las propiedades parent y next)
                let obj = Object.keys(jsonNode.conditions[i]);
                let vars = obj.filter(key => key !== "parent" && key !== "next");

                let nodeConditions = [];

                // Recorre todas las variables obtenidas
                for (let j = 0; j < vars.length; j++) {
                    // Lee el nombre de la variable
                    let varName = vars[j];

                    // Obtiene el objeto que guarda las propiedades que tiene que cumplir la variable
                    let obj = jsonNode.conditions[i][varName];

                    // Crea un objeto igual que obj, pero que tamiben guarda su nombre
                    let condition = obj;
                    obj.key = varName

                    // Lo mete en las variables del nodo
                    nodeConditions.push(condition);

                    // Si la variable no esta guardada, la guarda en el gameManager a falso por defecto
                    if (!this.gameManager.hasValue(varName)) {
                        this.gameManager.setValue(varName, false);
                    }
                }

                // Se guardan las condiciones y se crea de manera recursiva
                // el nodo siguiente que corresponde a cumplir dichas condiciones
                currNode.conditions.push(nodeConditions);
                currNode.next.push(this.readNodes(jsonNode.conditions[i].next, namespace, playerName, context, getObjs))
            }
        }
        // Si el nodo no es ni de opciones ni de condiciones, es de texto puro
        else if (jsonNode.hasOwnProperty("next")) {
            // Se crea de manera recursiva el nodo siguiente y se pone por defecto
            // que el indice del siguiente nodo sea el primer elemento del array
            currNode.next = [this.readNodes(jsonNode.next, namespace, playerName, context, getObjs)];
        }

        // Si tambien tiene la propiedad text
        if (jsonNode.hasOwnProperty("text")) {
            // Se crea un dialogo con todo el texto a mostrar
            let split = {
                text: jsonNode.text,
                character: currNode.character,
                name: currNode.name
            }
            // Se obtiene todo el texto separado en varios dialogos si es demasiado largo
            currNode.dialogs = this.splitDialogs([split]);
            currNode.currDialog = 0;
        }

        // Si tambien tiene la propiedad singals
        if (jsonNode.hasOwnProperty("signals")) {
            // Obtiene el nombre de los eventos a llamar
            // (suprimiendo las propiedades parent y next)
            let obj = Object.keys(jsonNode.signals);
            let eventNames = obj.filter(key => key !== "parent" && key !== "next");

            // Recorre todas las variables obtenidas
            for (let i = 0; i < eventNames.length; i++) {
                // Lee el nombre del evento
                let evtName = eventNames[i];

                // Obtiene el objeto que guarda los parametros del evento 
                let obj = jsonNode.signals[evtName];

                // Crea un objeto igual que obj, pero que tamiben guarda su nombre
                let evt = obj;
                evt.name = evtName;

                // Lo mete en las variables del nodo
                currNode.signals.push(evt);
            }

        }
        return currNode;
    }

    /**
    * Prepara los dialogos por si alguno es demasiado largo y se sale de la caja de texto
    * @param {Array} dialogs - array de dialogos a preparar
    * @return {Array} - array con los dialogos ajustados
    */
    splitDialogs(dialogs) {
        let newDialogs = [];        // Nuevo array de dialogos tras dividir los dialogos demasiado largos
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
            this.dialogManager.setText(dialogCopy, false);

            // Si la altura del texto supera la de la caja de texto 
            if (this.dialogManager.textTooBig()) {
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
                    this.dialogManager.setText(dialogCopy, false);

                    // Si no supera la altura de la caja de texto, saca la palabra del array
                    if (!this.dialogManager.textTooBig()) {
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

        let emptyDialog = {
            text: "",
            character: "",
            name: ""
        }

        this.dialogManager.setText(emptyDialog, false);
        return newDialogs;
    }

}