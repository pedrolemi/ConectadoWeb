// variable de nivel de modulo
// - Se puede acceder desde cualquier parte del modulo, pero no es visible
// al no pertencen a la clase y no ser exportada
// - No cambia con las instancia puesto que no pertenece a la clase, sino
// al modulo y solo existe un modulo
let instance = null;

export default class GameManager {
    /**
    * Maneja el flujo de juego y variables de uso comun
    * @param {scene} - se necesita una escena para poder acceder al ScenePlugin y cambiar de escena
    */
    constructor(scene) {
        // no deberia suceder, pero por si acaso se hace el new de la clase desde fuera
        if (instance === null) {
            instance = this;
        }
        else {
            throw new Error('GameManager is a Singleton class!');
        }

        // se necestia una escena para poder acceder al ScenePlugin y cambiar de escena
        // Por lo tanto, se aprovecha para mantener la escena actual
        // El SceneManager tb incluye el cambio de escena, pero no es recomendable segun
        // la docu manejarlo a traves de el
        this.currentScene = scene

        this.tintrgb = this.currentScene.plugins.get('rextintrgbplugin');
        this.i18next = this.currentScene.plugins.get('rextexttranslationplugin');

        // indica el dia del juego
        this.day = 1;

        // almacena los valores que van a tener que ser usados desde fuera
        this.map = new Map();
        this.map.set("bag", false);

        this.talking = false;
    }

    // metodo para generar y coger la instancia
    static create(scene) {
        if (instance === null) {
            instance = new GameManager(scene);
        }
        return instance;
    }

    // metodo para generar y coger la instancia
    static getInstance() {
        return this.create();
    }

    ///////////////////////////////////////
    /// Metodos para cambiar de escena ///
    //////////////////////////////////////
    startGame() {
        // IMPORTANTE: HAY QUE LANZAR PRIMERO EL DIALOGMANAGER PARA QUE LOS 
        // RETRATOS DE LOS PERSONAJES SE PINTEN POR ENCIMA DE LA CAJA DE TEXTO
        let auxDialog = 'DialogManager';
        this.currentScene.scene.launch(auxDialog);
        this.dialogManager = this.currentScene.scene.get(auxDialog);

        let aux = 'Test';
        this.currentScene.scene.start(aux);
        this.currentScene = this.currentScene.scene.get(aux);
    }

    getDialogManager() {
        return this.dialogManager;
    }

    startLangMenu() {
        let aux = 'LanguageMenu';
        this.currentScene.scene.start(aux);
        this.currentScene = this.currentScene.scene.get(aux);
    }


    /**
    * Metodo que se llama cuando inicia o termina un dialogo 
    * @param {boolean} talking - si hay un dialogo activo o no
    */
    setTalking(talking) {
        this.talking = talking;
    }

    /**
    * @returns {boolean} - si el dialogo esta activo o no
    */
    isTalking() {
        return this.talking;
    }


    ///////////////////////////////////////
    ///// Metodos para la blackboard /////
    //////////////////////////////////////
    /**
    * Devuelve el valor buscado en el mapa de propiedades
    * @returns {object} - el objeto buscado en caso de que exista. En caso contrario, devuelve null
    */
    getValue(key) {
        if (this.map.has(key)) {
            return this.map.get(key);
        }
        return null;
    }

    /**
    * Metodo que setea un valor en el mapa de propiedades
    * @returns {boolean} - indica si se ha sobrescrito un valor o no
    */
    setValue(key, value) {
        let exists = false;
        if (this.map.has(key)) {
            exists = true;
        }
        this.map.set(key, value);
        return exists;
    }

    /**
    * Indica si un valor existe o no en el mapa de propiedades
    * @returns {boolean} - indica si existe el valor
    */
    hasValue(key) {
        return this.map.has(key);
    }

}