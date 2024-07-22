import { TextNode, ChoiceNode, ConditionNode, EventNode, ChatNode, SocialNetNode } from '../../UI/dialog/dialogNode.js';
import GameManager from '../../managers/gameManager.js';


export default class BaseScene extends Phaser.Scene {
    /**
     * Escena base para las escenas del juego. Guarda parametros como las dimensiones 
     * del canvas o los managers y posiciones de los retratos de los personajes 
     * @extends Phaser.Scene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super({ key: name });
    }

    create(params) {
        this.CANVAS_WIDTH = this.sys.game.canvas.width;
        this.CANVAS_HEIGHT = this.sys.game.canvas.height;

        // Obtiene el dialogManager (tendria que haberse iniciado antes que la escena)
        this.gameManager = GameManager.getInstance();

        this.UIManager = this.gameManager.UIManager;
        this.dialogManager = this.gameManager.UIManager.dialogManager;
        this.phoneManager = this.gameManager.UIManager.phoneManager;
        this.dispatcher = this.gameManager.dispatcher;

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


        // Parametros del fondo y la camara para el scroll
        this.scale = 1;
        this.leftBound = 0;
        this.rightBound = this.CANVAS_WIDTH;
        this.START_SCROLLING = 30;
        this.CAMERA_SPEED = 3;

        // Se anaden funciones adicionales a las que se llamara al crear, despertar y destruir la escena
        this.events.on('create', () => {
            this.onCreate(params);
        }, this);
        this.events.on('wake', (scene, params) => {
            this.onWake(params);
        }, this);
        this.events.on('shutdown', this.shutdown, this);
        
    }


    /**
     * Metodo que se llama al terminar de crear la escena. Se encarga de llamar initialSetup
     * @param {Object} params - objeto con los parametros que pasarle a initialSetup 
     */
    onCreate(params) {
        // console.log("onCreate");
        this.initialSetup(params);
    }

    /**
     * Metodo que se llama al despertar la escena. Se encarga de llamar initialSetup
     * @param {Object} params - objeto con los parametros que pasarle a initialSetup 
     */
    onWake(params) {
        // console.log("onWake");
        this.initialSetup(params);
    }

    // Metodo que se llama al borrar la escena. Se encarga de limpiar los eventos del dispatcher
    shutdown() {
        if (this.dispatcher) {
            this.dispatcher.removeAll();
        }
    }

    /**
     * Se encarga de configurar la escena con los parametros iniciales y
     * de anadir los retratos de la escena actual en el dialogManager
     * @param {Object} params - parametros que se le pasan a la configuracion inicial 
     */
    initialSetup(params) {
        // console.log(params);

        this.dialogManager.changeScene(this.gameManager.currentScene);
        if (params) {
            if (params.left) {
                this.cameras.main.scrollX = this.leftBound;
            }
            else {
                this.cameras.main.scrollX = this.rightBound - this.CANVAS_WIDTH;
            }
        }
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
    * @param {String} objectName - nombre del objeto en el que esta el dialogo, si es que el json contiene varios dialogos de distintos objetos
    * @param {Boolean} getObjs - si se quiere devolver el nodo leido como un objeto 
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
    readNodes(id, file, namespace, objectName, getObjs) {
        let playerName = this.gameManager.getUserInfo().name;
        let context = this.gameManager.getUserInfo().gender;

        let fileObj = file;
        let translationId = id;

        // Si el dialogo esta dentro de algun objeto, se ajusta tanto el objeto
        // del json en el que buscar los nodos, como la id que utilizar para encontrar
        // la traduccion del nodo. Esto es porque la id del nodo debe coincidir tanto
        // en el json como en el archivo de traducciones, pero al estar dentro de un objeto
        // con (por ejemplo) nombre object, un nodo con la id name deberia buscarse en el 
        // archivo de traducciones como object.name, pero la id de nodo seguiria siendo name
        if (objectName !== "") {
            fileObj = file[objectName];
            translationId = objectName + "." + id;
        }
        // console.log(fileObj);
        // console.log(this.i18next.t(translationId, { ns: namespace, name: playerName, context: context, returnObjects: getObjs }));

        // Crea el nodo y guarda sus atributos (se estableceran en el nodo al final)
        let node = null;
        let nodeId = id;
        let type = fileObj[id].type;

        // Si el nodo es de tipo condicion
        if (type === "condition") {
            node = new ConditionNode();

            // Se leen todas las condiciones. Cada condicion lleva a un nodo distinto y 
            // en una condicion se pueden comprobar multiples variables
            for (let i = 0; i < fileObj[id].conditions.length; i++) {
                // Obtiene el nombre de las variables a comprobar (suprimiendo la propiedad next)
                let obj = Object.keys(fileObj[id].conditions[i]);
                let vars = obj.filter(key => key !== "next");

                let nodeConditions = [];

                // Recorre todas las variables obtenidas
                for (let j = 0; j < vars.length; j++) {
                    // Lee el nombre de la variable
                    let varName = vars[j];

                    // Obtiene el objeto que guarda las propiedades que tiene que cumplir la variable
                    let obj = fileObj[id].conditions[i][varName];

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
                node.conditions.push(nodeConditions);

                // Si hay un nodo despues de este, se crea de manera recursiva el nodo siguiente que corresponde a cumplir dichas condiciones
                if (fileObj[id].conditions[i].next) {
                    node.next.push(this.readNodes(fileObj[id].conditions[i].next, file, namespace, objectName, getObjs));
                }
            }
        }
        // Si el nodo es de tipo texto
        else if (type === "text") {
            node = new TextNode();

            // Obtiene el nombre del personaje del archivo de nombres localizados
            // En el caso de que se trate del jugador, obtiene su nombre
            let character = fileObj[id].character;
            node.name = this.i18next.t(fileObj[id].character, { ns: "names", returnObjects: getObjs });
            node.character = character;

            // Se crea un dialogo con todo el texto a mostrar
            let split = {
                // Obtiene el texto del archivo de textos traducidos
                text: this.i18next.t(translationId + ".text", { ns: namespace, name: playerName, context: context, returnObjects: getObjs }),
                //character: character,
                name: node.name
            }
            // Se obtiene todo el texto separado en varios dialogos si es demasiado largo
            node.dialogs = this.splitDialogs([split]);
            node.currDialog = 0;

            // Si hay un nodo despues de este, se crea de manera recursiva
            if (fileObj[id].next) {
                node.next.push(this.readNodes(fileObj[id].next, file, namespace, objectName, getObjs));
            }
        }
        // Si el nodo es de tipo opcion multiple
        else if (type === "choice") {
            node = new ChoiceNode();

            // Se obtienen los textos de las opciones del archivo de textos traducidos
            let texts = this.i18next.t(translationId, { ns: namespace, name: playerName, context: context, returnObjects: getObjs })

            for (let i = 0; i < fileObj[id].choices.length; i++) {
                // Se guarda el texto de la eleccion y se crea de manera recursiva
                // el nodo siguiente que corresponde a elegir dicha opcion
                node.choices.push(texts[i].text);

                // Si hay un nodo despues de este, se crea de manera recursiva
                if (fileObj[id].choices[i].next) {
                    node.next.push(this.readNodes(fileObj[id].choices[i].next, file, namespace, objectName, getObjs));
                }
            }
        }
        // Si el nodo es de tipo evento
        else if (type === "event") {
            node = new EventNode();

            // Recorre todas las variables obtenidas
            for (let i = 0; i < fileObj[id].events.length; i++) {
                // Lee el nombre del evento
                let evtName = Object.keys(fileObj[id].events[i]);

                // Obtiene el objeto que guarda los parametros del evento 
                let obj = fileObj[id].events[i][evtName];

                // Crea un objeto igual que obj, pero que tambien guarda su nombre
                let evt = { ...obj };
                evt.name = evtName[0];

                // Lo mete en las variables del nodo
                node.events.push(evt);
            }

            // Si hay un nodo despues de este, se crea de manera recursiva
            if (fileObj[id].next) {
                node.next.push(this.readNodes(fileObj[id].next, file, namespace, objectName, getObjs));
            }
        }
        // Si el nodo es de tipo mensaje de texto
        else if (type === "chatMessage") {
            node = new ChatNode();

            // Obtiene el texto del archivo de textos traducidos y lo guarda
            let text = this.i18next.t(translationId + ".text", { ns: namespace, name: playerName, context: context, returnObjects: getObjs });
            node.text = text;

            // Obtiene el nombre del personaje del archivo de nombres localizados
            // En el caso de que se trate del jugador, obtiene su nombre
            let character = fileObj[id].character;
            if (character === "player") {
                node.name = this.gameManager.getUserInfo().name;
            }
            else {
                node.name = this.i18next.t(fileObj[id].character, { ns: "names" });
            }
            node.character = character;

            // Guarda el chat en el que tiene que ir la respuesta y el retardo con el que se envia
            node.chat = this.i18next.t("textMessages" + "." + fileObj[id].chat, { ns: "phoneInfo" });

            if (fileObj[id].replyDelay) {
                node.replyDelay = fileObj[id].replyDelay;
            }

            // Si hay un nodo despues de este, se crea de manera recursiva
            if (fileObj[id].next) {
                node.next.push(this.readNodes(fileObj[id].next, file, namespace, objectName, getObjs));
            }
        }
        // Si el nodo es de tipo comentario de la red social
        else if (type === "socialNetMessage") {
            node = new SocialNetNode();

            // Obtiene el texto del archivo de textos traducidos y lo guarda
            let text = this.i18next.t(translationId + ".text", { ns: namespace, name: playerName, context: context, returnObjects: getObjs });
            node.text = text;

            node.character = fileObj[id].character;
            // Obtiene el nombre del jugador del archivo de nombres localizados
            // En el caso de se trate del propio del jugador, obtiene el pronombre personal Tu
            // traducido en el idioma correspondiente
            node.name = this.i18next.t(fileObj[id].character, { ns: "names" });

            // Guarda el usuario que ha subido el post
            node.user = fileObj[id].user;

            // Guarda el numero del post del usuario
            node.post = filed[id].post;

            // Si hay un nodo despues de este, se crea de manera recursiva
            if (fileObj[id].next) {
                node.next.push(this.readNodes(fileObj[id].next, file, namespace, objectName, getObjs));
            }
        }

        // Guarda los atributos basicos del nodo despues de haber decidido que tipo de nodo se va a crear
        node.id = nodeId;

        return node;
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


    /**
     * Cambia la imagen de la puerta cerrada por la puerta abierta o viceversa
     * al interactuar con ella (al hacer click o al pasar/sacar el raton por encima)
     * @param {Phaser.Image} closed - imagen de la puerta cerrada
     * @param {Phaser.Image} opened - imagen de la puerta abierta 
     * @param {Boolean} click - true si la imagen se cambia al hacer click, false si lo hace al pasar/sacar el raton por encima
     */
    toggleDoor(closed, opened, click = true) {
        closed.setInteractive();
        opened.setInteractive();

        opened.visible = false;
        let openEvt = 'pointerdown';
        let closeEvt = 'pointerdown';

        if (!click) {
            openEvt = 'pointerover';
            closeEvt = 'pointerout';
        }

        closed.on(openEvt, () => {
            closed.visible = false;
            opened.visible = true;
        });
        opened.on(closeEvt, () => {
            opened.visible = false;
            closed.visible = true;
        });
    }
}