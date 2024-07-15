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

export class ChatNode extends DialogNode {
    /**
    * Clase para la informacion de los nodos de chat
    * @extends DialogNode
    * 
    * Ejemplo:
        {
            "type": "textMessage",
            "character": "mom",
            "chat": 0,
            "replyDelay": 1000
        }
    */
    constructor() {
        super();
        
        this.type = "textMessage";
        this.text = null;               // texto del mensaje
        this.chat = null;               // chat en el que se escribe el mensaje
        this.replyDelay = 0;            // retardo con el que se enviara el mensaje
    }
}