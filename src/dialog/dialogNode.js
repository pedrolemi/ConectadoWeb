export default class DialogNode {
    /**
    * Clase base para la informacion de los nodos de dialogo. Inicialmente esta todo vacio
    */
    constructor() {
        this.type = null;           // dialog, choice, condition

        this.name = null;           // nombre del personaje que habla
        this.character = null;      // id del personaje que habla

        this.parent = null;         // nodo padre de este nodo
        this.id = null;             // id de este nodo
        this.next = [];             // posibles nodos siguientes
        this.choices = [];          // texto de las opciones si el nodo es un nodo opcion
        this.conditions = [];       // condiciones si el nodo es un nodo condicional

        this.dialogs = [];          // serie de dialogos que se van a mostrar
        this.currDialog = null;     // indice del dialogo que se esta mostrando
        this.nextInd = null;        // indice del nodo del array de nodos siguientes que sera el siguiente a este nodo
    }
}