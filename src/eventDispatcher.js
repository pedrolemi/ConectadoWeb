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
    * @param {string} event - nombre del evento
    * @param {object} obj - objeto que reciben los objetos suscritos al evento (opcional)
    */
    dispatch(event, obj) {
        this.emitter.emit(event, obj);
    }


    /**
    * Metodo para suscribir un objeto a un evento de forma indefinida
    * @param {string} event - nombre del evento
    * @param {object} owner - objeto que se suscribe al evento
    * @param {fn} fn - funcion que se ejecuta cuando se produce el evento
    */
    add(event, owner, fn) {
        // se agregan los difereentes elementos a los mapas
        // mapa de eventos
        if (!this.eventsMap.has(event)) {
            this.eventsMap.set(event, new Set());
        }
        this.eventsMap.get(event).add(owner);

        // mapa de propietarios
        if (!this.ownersMap.has(owner)) {
            this.ownersMap.set(owner, new Map());
        }
        if (!this.ownersMap.get(owner).has(event)) {
            this.ownersMap.get(owner).set(event, new Set());
        }
        this.ownersMap.get(owner).get(event).add(fn);

        // se emite el evento
        this.emitter.on(event, fn, owner);
    }

    /**
    * Metodo para suscribir un objeto a un evento una sola vez
    * @param {string} event - nombre del evento
    * @param {object} owner - objeto que se suscribe al evento
    * @param {fn} fn - funcion que se ejecuta cuando se produce el evento
    */
    addOnce(event, owner, fn) {
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

        this.emitter.once(event, fn, owner);
    }

    /**
    * Metodo para desuscribir a todos los objetos de un evento concreto
    * @param {string} event - nombre del evento
    */
    removeByEvent(event) {
        if (this.eventsMap.has(event)) {
            // se actualiza el mapa de propietarios
            let owners = this.eventsMap.get(event);
            owners.forEach(owner => {
                this.ownersMap.get(owner).delete(event);
            });

            // se elimina el evento
            this.emitter.off(event);

            // se actualiza el mapa de eventos
            this.eventsMap.delete(event);
        }
    }

    /**
    * Metodo para desuscribir a un objeto de todos sus eventos
    * @param {object} owner - objeto suscrito a algun evento
    */
    removeByOwner(owner) {
        if (this.ownersMap.has(owner)) {
            // se obtienen todos los eventos del objeto
            let events = this.ownersMap.get(owner);
            // se recorren
            events.forEach((value, key) => {
                // se elimina de cada evento ese objeto
                this.eventsMap.get(key).delete(owner);

                // se va desuscribiendo el objeto del evento por cada funcion que tenga
                // (no es lo habitual, pero podria darse el caso que un
                // mismo objeto estuviera suscrito a un mismo evento con varias funciones)
                value.forEach(fn => {
                    this.emitter.off(key, fn, owner);
                });
            });

            // se actualiza el mapa de propietarios
            this.ownersMap.delete(owner);
        }
    }

    /**
    * Metodo para desuscribir a un objeto de un evento concreto
    * @param {string} event - nombre del evento
    * @param {object} owner - objeto suscrito al evento
    */
    remove(event, owner) {
        // se comprueba si ese objeto tiene ese evento
        if (this.eventsMap.has(event)) {
            if (this.eventsMap.get(event).has(owner)) {
                // se actualiza el mapa de eventos
                this.eventsMap.get(event).delete(owner);

                // se da de baja de ese evento el objeto por cada funcion que tenga
                let aux = this.ownersMap.get(owner).get(event);
                aux.forEach(fn => {
                    this.emitter.off(event, fn, owner);
                });

                // se actualiza el mapa de propietarios
                this.ownersMap.get(owner).delete(event);
            }
        }
    }

    /**
    * Metodo para eliminar todos los eventos
    * Ademas de uso principal, es recomendable hacerlo por cada
    * cambio de escena para mejorar el rendimiento
    */
    removeAll() {
        this.emitter.shutdown();
        this.eventsMap.clear();
        this.ownersMap.clear();
    }
}