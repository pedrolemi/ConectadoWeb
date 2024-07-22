export default class DialogNode {
    /**
    * Clase base para la informacion de los nodos de dialogo. Inicialmente esta todo vacio
    */
    constructor() {
        this.type = null;               // dialog, choice, condition, event, chatMessage, socialNetMessage

        this.id = null;                 // id de este nodo
        this.next = [];                 // posibles nodos siguientes
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
        }
    */
    constructor() {
        super();

        this.type = "text";
        this.dialogs = [];              // serie de dialogos que se van a mostrar
        this.currDialog = null;         // indice del dialogo que se esta mostrando
        this.character = null;          // id del personaje que habla
        this.name = null;               // nombre del personaje que habla (si se trata del player, es el nombre elegido en la pantalla de login)
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
                        "type": "boolean",
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
                        "type": "boolean",
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
                { "talked": { "delay": 20 } },
                { "b": { "String": "ddsad" } },
                { "c": { 
                    "Vector2": {
                        "x": "1",
                        "y": "1"
                        }
                    } 
                },
                { "d": { "Number": "1" }}
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
            "user": "mom",
            "post": 0
        }
     */
    constructor() {
        super();

        this.type = "socialNetMessage";
        this.text = null;               // texto del mensaje
        this.character = null;          // id del personaje que publica escribe en la publicacion
        this.name = null;               // nombre del personaje que escribe en la publicacion (si se trata del jugador, es el pronombre personal Tu)
        this.user = null;               // usuario que ha hecho la publicacion (corresponde con los ids de los personajes)
        this.post = null;               // numero de la publicacion (inamovible aunque se borren publicaciones)
    }
}