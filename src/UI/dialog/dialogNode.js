export default class DialogNode {
    /**
    * Clase base para la informacion de los nodos de dialogo. Inicialmente esta todo vacio
    */
    constructor() {
        this.type = null;               // dialog, choice, condition, event, textMessage

        this.character = null;          // id del personaje que habla
        this.name = null;               // nombre del personaje que habla

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
                { "next": "choice1", "chat": 0, "reply": true },
                { "next": "choice1" }
            ]
        }
    */
    constructor() {
        super();

        this.type = "choice";
        this.subtype = null;
        this.choices = [];              // Opciones (texto y si es un mensaje, de que chat y si que hay que responder)
        this.selectedOption = null;     // indice de la opcion seleccionada
    }
}

export class ChatChoiceNode extends ChoiceNode {
    /**
     * Clase para los nodos de opcion multiple en los mensajes de texto del movil
     * Hay dos tipos de efectos: respuesta o no
     * Ejemplo:
        {
            "type": "choice",
            "subtype": "phone"
            "chat:" 0
            "choices":[
                { "next": "choice1", "effect": "reply" },
                { "next": "choice1" }
            ]
        }
     */
    constructor(){
        super();

        this.subtype = "phone";
        this.chat = null;
    }
}

export class SocialNetChoiceNode extends ChoiceNode {
     /**
     * Clase para los nodos de opcion multiple en los mensajes de la red social
     * Hay tres tipos de efectos: respuesta, no respuesta o borrar post
     * Ejemplo:
        {
            "type": "choice",
            "subtype": "socialNetwork"
            "user": mom     // id del personaje
            "post": 0
            "choices":[
                { "next": "choice1", "effect": "reply" },
                { "next": "choice1" }
            ]
        }
     */
    constructor(){
        super();

        this.subtype = "socialNetwork";
        this.user = null;
        this.post = null;
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
                        "type": "boolean"
                    },
                    "sponsored": {
                        "value": false,
                        "operator": "equal",
                        "type": "boolean"
                    }
                },
                {
                    "next": "talked",
                    "talked": {
                        "value": true,
                        "operator": "equal",
                        "type": "boolean"
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

export class MessageNode extends DialogNode {
    /**
    * Clase para la informacion de los nodos de chat
    * Funciona como una clase abstracta, nunca se van a crear instancias de esta clase
    * @extends DialogNode
    */
    constructor() {
        super();
        
        this.type = "textMessage";
        this.subtype = null;
        this.message = null;            // texto del mensaje
        this.replyDelay = 0;            // retardo con el que se enviara el mensaje
    }
}

export class ChatNode extends MessageNode {
    /**
    * Clase para la informacion de los nodos de chat del movil
    * @extends MessageNode
    * 
    * Ejemplo:
        {
            "type": "textMessage",
            "subtype": "phone"
            "character": "mom",
            "chat": 0,
            "replyDelay": 1000
        }
    */
    constructor(){
        super();

        this.subtype = "phone";
        this.chat = null;               // chat en el que se escribe el mensaje
    }
}

export class SocialNetNode extends MessageNode {
    /**
    * Clase para la informacion de los nodos de chat de la red social
    * @extends MessageNode
    * 
    * Ejemplo:
        {
            "type": "textMessage",
            "subtype": "socialNetwork"
            "character": "mom",
            "user": 0,
            "post": 0,
            "replyDelay": 1000
        }
    */
    constructor(){
        super();

        this.subtype = "socialNetwork";
        this.user = null;
        this.post = null;
    }
}