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
            && this.cameras.main.scrollX < this.rightBound - this.CANVAS_WIDTH - this.CAMERA_SPEED) {
            this.cameras.main.scrollX += this.CAMERA_SPEED;
        }
    }

    /**
    * Va leyendo el json (el archivo se lee una sola vez y se pasa el objeto obtenido como parametro)
    * y creando el arbol de nodos de manera recursiva
    *
    * @param {String} id - id del nodo que se lee. El nodo inicial es root
    * @param {Object} file - objeto obtenido como resultado de leer el json
    * @param {String} namespace - nombre del archivo de localizacion del que se va a leer
    * @param {String} playerName - nombre del jugador
    * @param {String} context - contexto en el que se va a referir al personaje (male / female)
    * @param {boolean} getObjs - si se quiere devolver el nodo leido como un objeto 
    *
    * 
    *  IMPORTANTE: En un nodo con condiciones, cada condicion lleva a otro nodo distinto.
    * Al momento de llegar a un nodo condicion, el siguiente nodo sera el indicado como siguiente
    * en la primera condicion que se cumpla (se van comprobando en el orden en el que se han leido).
    * Cada condicion puede tener varios requisitos (variables), en cuyo caso, la condicion solo 
    * se cumplira si todos sus requisitos se cumplen (operador &&. De momento no hay soporte para el operador || ) 
    * 
    * IMPORTANTE 2: La estructura de nodos es comun a todos los idiomas y se tiene que guardar con anterioridad
    * al momento de crear la escena para luego pasarlo como parametro file. El archivo del que se van a leer las
    * traducciones es el que se pasa en el parametro namespace, y tiene que pasarse un string con el nombre del
    * archivo sin la extension .json
    */
    readNodes(id, file, namespace, playerName, context, getObjs) {
        // Crea el nodo y establece sus atributos
        let currNode = new DialogNode();
        currNode.id = id;
        currNode.type = file[id].type;
        currNode.character = file[id].character;

        // Obtiene el nombre del personaje del archivo de nombres localizados
        currNode.name = this.i18next.t(file[id].character, { ns: "names", returnObjects: getObjs });
        
        // Si el nodo es de tipo condicion
        if (currNode.type === "condition") {
            // Se leen todas las condiciones. Cada condicion lleva a un nodo distinto y 
            // en una condicion se pueden comprobar multiples variables
            for (let i = 0; i < file[id].conditions.length; i++) {
                // Obtiene el nombre de las variables a comprobar (suprimiendo la propiedad next)
                let obj = Object.keys(file[id].conditions[i]);
                let vars = obj.filter(key => key !== "next");

                let nodeConditions = [];

                // Recorre todas las variables obtenidas
                for (let j = 0; j < vars.length; j++) {
                    // Lee el nombre de la variable
                    let varName = vars[j];

                    // Obtiene el objeto que guarda las propiedades que tiene que cumplir la variable
                    let obj = file[id].conditions[i][varName];

                    // Crea un objeto igual que obj, pero que tambien guarda su nombre
                    let condition = obj;
                    obj.key = varName

                    // Lo mete en las variables del nodo
                    nodeConditions.push(condition);

                    // Si la variable no esta guardada, la guarda en el gameManager a falso por defecto
                    if (!this.gameManager.hasValue(varName)) {
                        this.gameManager.setValue(varName, false);
                    }
                }

                // Se guardan las condiciones 
                currNode.conditions.push(nodeConditions);

                // Si hay un nodo despues de este, se crea de manera recursiva el nodo siguiente que corresponde a cumplir dichas condiciones
                if (file[id].conditions[i].next) {
                    currNode.next.push(this.readNodes(file[id].conditions[i].next, file, namespace, playerName, context, getObjs));
                }
            }
        }
        // Si el nodo es de tipo texto
        else if (currNode.type === "text") {
            // Se crea un dialogo con todo el texto a mostrar
            let split = {
                // Obtiene el texto del archivo de textos traducidos
                text: this.i18next.t(id + ".text", { ns: namespace, name: playerName, context: context, returnObjects: getObjs }),
                character: currNode.character,
                name: currNode.name
            }
            // // Se obtiene todo el texto separado en varios dialogos si es demasiado largo
            currNode.dialogs = this.splitDialogs([split]);
            currNode.currDialog = 0;

            // Si hay un nodo despues de este, se crea de manera recursiva
            if (file[id].next) {
                currNode.next.push(this.readNodes(file[id].next, file, namespace, playerName, context, getObjs));
            }

        }
        // Si el nodo es de tipo opcion multiple
        else if (currNode.type === "choice") {
            // Se obtienen los textos de las opciones del archivo de textos traducidos
            let texts = this.i18next.t(id, { ns: namespace, name: playerName, context: context, returnObjects: getObjs })

            for (let i = 0; i < file[id].choices.length; i++) {
                // Se guarda el texto de la eleccion y se crea de manera recursiva
                // el nodo siguiente que corresponde a elegir dicha opcion
                currNode.choices.push(texts[i].text);

                // Si hay un nodo despues de este, se crea de manera recursiva
                if (file[id].choices[i].next) {
                    currNode.next.push(this.readNodes(file[id].choices[i].next, file, namespace, playerName, context, getObjs));
                }
            }
        }
        
        else if (currNode.type === "event") {
            // Recorre todas las variables obtenidas
            for (let i = 0; i < file[id].events.length; i++) {
                // // Lee el nombre del evento
                let evtName = Object.keys(file[id].events[i]);
                
                // Obtiene el objeto que guarda los parametros del evento 
                let obj = file[id].events[i][evtName];

                // Crea un objeto igual que obj, pero que tambien guarda su nombre
                let evt = { ... obj };
                evt.name = evtName[0];

                // Lo mete en las variables del nodo
                currNode.events.push(evt);
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