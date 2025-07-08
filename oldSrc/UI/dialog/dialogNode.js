export default class DialogNode {
    /**
    * Clase base para la informacion de los nodos de dialogo. Inicialmente esta todo vacio
    */
    constructor() {
        this.type = null;               // dialog, choice, condition, event, chatMessage, socialNetMessage

        this.id = null;                 // id de este nodo dentro del objeto en el que se encuentra
        this.next = [];                 // posibles nodos siguientes
        this.fullId = null;             // id completa del nodo en el archivo en general
    }
}

export class TextNode extends DialogNode {
    /**
    * Clase para la informacion de los nodos de texto
    * @extends DialogNode
    * 
    * Ejemplo:
        {
            "type": "text",
            "character": "mom",
            "next": "setNotTalked"
            "centered": "true"
        }
    */
    constructor() {
        super();

        this.type = "text";
        this.dialogs = [];              // serie de dialogos que se van a mostrar
        this.currDialog = null;         // indice del dialogo que se esta mostrando
        this.character = null;          // id del personaje que habla
        this.name = null;               // nombre del personaje que habla (si se trata del player, es el nombre elegido en la pantalla de login)
        this.centered = false;          // indica si el texto esta centrado o no (en caso de que no se especifique aparece alineado arriba a la izquierda)
    }
}


export class ChoiceNode extends DialogNode {
    /**
    * Clase para la informacion de los nodos de opcion multiple
    * @extends DialogNode
    * 
    * Ejemplo:
        {
            "type": "choice",
            "choices":[
                { "next": "choice1" },
                { "next": "choice1" }
            ]
        }
    */
    constructor() {
        super();

        this.type = "choice";
        this.choices = [];              // Opciones (texto y si es un mensaje, de que chat y si que hay que responder)
        this.selectedOption = null;     // indice de la opcion seleccionada
    }
}

export class ConditionNode extends DialogNode {
    /**
    * Clase para la informacion de los nodos de de condicion
    * @extends DialogNode
    * 
    * Ejemplo:
        {
            "type": "condition", 
            "conditions": [
                {
                    "next": "notTalked",
                    "talked": {
                        "value": false,
                        "operator": "equal",
                        "global": false,
                        "default": true,
                    },
                    "sponsored": {
                        "value": false,
                        "operator": "equal",
                        "type": "boolean"
                        "default": false,
                    }
                },
                {
                    "next": "talked",
                    "talked": {
                        "value": true,
                        "operator": "equal",
                    }
                }
            ]
        }
    */
    constructor() {
        super();

        this.type = "condition";
        this.conditions = [];           // condiciones con su nombre/identificador y sus atributos
    }
}

export class EventNode extends DialogNode {
    /**
    * Clase para la informacion de los nodos de evento
    * @extends DialogNode
    * Ejemplo:
        {
            "type": "event",
            "events": [
                { 
                    "talked": { 
                        "variable": "talked", 
                        "global": false,
                        "value": true, 
                        "delay": 20 
                    } 
                }
            ]
        }
    */
    constructor() {
        super();
        this.type = "event";
        this.events = [];               // eventos que se llamaran al procesar el nodo (nombre del evento y el retardo con el que se llama)
    }
}

export class ChatNode extends DialogNode {
    /**
    * Clase para la informacion de los nodos de los mensajes de los chats del movil
    * @extends DialogNode
    * Ejemplo:
        {
            "type": "chatMessage",
            "character": "player",
            "chat": "chat1",
            "replyDelay": 1000
        }
    */
    constructor() {
        super();

        this.type = "chatMessage";
        this.text = null;               // texto del mensaje
        this.character = null;          // id del personaje que envia el mensaje
        this.name = null;               // nombre del personaje que envia el mensaje (si se trata del jugador, es el nombre elegido en la pantalla de login)
        this.chat = null;               // chat al que corresponde el mensaje
        this.replyDelay = 0;            // retardo con el que se enviara el mensaje
    }
}

export class SocialNetNode extends DialogNode {
    /**
     * Clase para la informacion de los nodos de los mensajes de las publicaciones
     * de la red social
     * @extends DialogNode
    * Ejemplo:
        {
            "type": "socialNetMessaage",
            "character": "player",
            "owner": "mom",
            "post": 0,
            "replyDelay": 1000
        }
     */
    constructor() {
        super();

        this.type = "socialNetMessage";
        this.text = null;               // texto del mensaje
        this.character = null;          // id del personaje que escribe en la publicacion
        this.name = null;               // nombre del personaje que escribe en la publicacion (si se trata del jugador, es el pronombre personal Tu)
        this.owner = null;               // usuario que ha hecho la publicacion (corresponde con los ids de los personajes)
        this.postName = null;           // nombre de la publicacion
        this.replyDelay = 0;            // retardo con el que se enviara el mensaje
    }
}