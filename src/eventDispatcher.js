let instance = null;

export default class EventDispatcher {
    /**
    * Clase para tratar los mensajes sin tener en cuenta el ambito puesto que es un Singleton
    * De este modo cualquier objeto puede acceder a ella y emitir un mensaje y otro que se 
    * encuentre en otro lugar distinto puede suscribirse sin preocuparse del ambito
    */
    constructor() {
        // Patron singleton
        if (instance === null) {
            instance = this;
        }
        else {
            throw new Error('EventDispatcher is a Singleton class!');
        }

        // Emisor de eventos
        this.emitter = new Phaser.Events.EventEmitter();
        // Mapas para conseguir un mejor manejo de los eventos y poder eliminar los eventos segun propietario
        this.eventsMap = new Map();     // evento-propietario (string, set)
        this.ownersMap = new Map();     // propietario-evento-funciones (string, map(string, set))
    }

    // metodo para generar y coger la instancia
    static getInstance() {
        if (instance === null) {
            instance = new EventDispatcher();
        }
        return instance;
    }

    /**
    * Metodo para emitir un evento
    * @param {String} event - nombre del evento
    * @param {Object} obj - objeto que reciben los objetos suscritos al evento (opcional)
    */
    dispatch(event, obj) {
        this.emitter.emit(event, obj);
    }


    /**
    * Metodo para suscribir un objeto a un evento de forma indefinida
    * @param {String} event - nombre del evento
    * @param {Object} owner - objeto que se suscribe al evento
    * @param {Fn} fn - funcion que se ejecuta cuando se produce el evento
    */
    add(event, owner, fn) {
        // Se agregan los difereentes elementos a los mapas
        // Mapa de eventos
        if (!this.eventsMap.has(event)) {
            this.eventsMap.set(event, new Set());
        }
        this.eventsMap.get(event).add(owner);

        // Mapa de propietarios
        if (!this.ownersMap.has(owner)) {
            this.ownersMap.set(owner, new Map());
        }
        if (!this.ownersMap.get(owner).has(event)) {
            this.ownersMap.get(owner).set(event, new Set());
        }
        this.ownersMap.get(owner).get(event).add(fn);

        // Se emite el evento
        this.emitter.on(event, fn, owner);
    }

    /**
    * Metodo para suscribir un objeto a un evento una sola vez
    * @param {String} event - nombre del evento
    * @param {Object} owner - objeto que se suscribe al evento
    * @param {Fn} fn - funcion que se ejecuta cuando se produce el evento
    */
    addOnce(event, owner, fn) {
        /*
        if (!this.eventsMap.has(event)) {
            this.eventsMap.set(event, new Set());
        }
        this.eventsMap.get(event).add(owner);

        if (!this.ownersMap.has(owner)) {
            this.ownersMap.set(owner, new Map());
        }
        if (!this.ownersMap.get(owner).has(event)) {
            this.ownersMap.get(owner).set(event, new Set());
        }
        this.ownersMap.get(owner).get(event).add(fn);
        */

        this.emitter.once(event, fn, owner);
    }

    /**
    * Metodo para desuscribir a todos los objetos de un evento concreto
    * @param {String} event - nombre del evento
    */
    removeByEvent(event) {
        if (this.eventsMap.has(event)) {
            // Se actualiza el mapa de propietarios
            let owners = this.eventsMap.get(event);
            owners.forEach(owner => {
                this.ownersMap.get(owner).delete(event);
            });

            // Se elimina el evento
            this.emitter.off(event);

            // Se actualiza el mapa de eventos
            this.eventsMap.delete(event);
        }
    }

    /**
    * Metodo para desuscribir a un objeto de todos sus eventos
    * @param {Object} owner - objeto suscrito a algun evento
    */
    removeByOwner(owner) {
        if (this.ownersMap.has(owner)) {
            // Se obtienen todos los eventos del objeto
            let events = this.ownersMap.get(owner);
            // Se recorren
            events.forEach((value, key) => {
                // Se elimina de cada evento ese objeto
                this.eventsMap.get(key).delete(owner);

                // Se va desuscribiendo el objeto del evento por cada funcion que tenga
                // (no es lo habitual, pero podria darse el caso que un
                // mismo objeto estuviera suscrito a un mismo evento con varias funciones)
                value.forEach(fn => {
                    this.emitter.off(key, fn, owner);
                });
            });

            // Se actualiza el mapa de propietarios
            this.ownersMap.delete(owner);
        }
    }

    /**
    * Metodo para desuscribir a un objeto de un evento concreto
    * @param {String} event - nombre del evento
    * @param {Object} owner - objeto suscrito al evento
    */
    remove(event, owner) {
        // Se comprueba si ese objeto tiene ese evento
        if (this.eventsMap.has(event)) {
            if (this.eventsMap.get(event).has(owner)) {
                // Se actualiza el mapa de eventos
                this.eventsMap.get(event).delete(owner);

                // Se da de baja al objeto del evento
                let aux = this.ownersMap.get(owner).get(event);
                // Se dan de baja todas las funciones
                aux.forEach(fn => {
                    this.emitter.off(event, fn, owner);
                });

                // Se actualiza el mapa de propietarios
                this.ownersMap.get(owner).delete(event);
            }
        }
    }

    /**
    * Metodo para eliminar todos los eventos
    * Nota: si no hay comunicacion entre escenas, es recomendable llamarlo por cada
    * cambio de escenas para mejorar el rendimiento
    */
    removeAll() {
        this.emitter.shutdown();
        this.eventsMap.clear();
        this.ownersMap.clear();
    }
}