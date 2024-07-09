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
        this.currentScene = scene;

        this.i18next = this.currentScene.plugins.get('rextexttranslationplugin');

        // indica el dia del juego
        this.day = 1;

        // almacena los valores que van a tener que ser usados desde fuera
        this.map = new Map();
        this.map.set("bag", false);
        
        this.generateTextures();
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
    /// Metodos para generar texturas ////
    //////////////////////////////////////
    generateTextures(){
        this.circleParticle = {
            name: 'circleParticle',
            radius: 50,
            color: 0xFF0808
        }
        // (x, y, width, height)
        let rt = this.currentScene.add.renderTexture(this.circleParticle.radius, this.circleParticle.radius, this.circleParticle.radius * 2, this.circleParticle.radius * 2);
        let circle = this.currentScene.add.circle(0, 0, this.circleParticle.radius, this.circleParticle.color);
        rt.draw(circle, this.circleParticle.radius, this.circleParticle.radius);
        rt.saveTexture(this.circleParticle.name);
        circle.destroy();

        this.graphics = this.currentScene.add.graphics();

        this.roundedSquare = {
            fillName: 'fillSquare',
            edgeName: 'edgeSquare',
            width: 100,
            height: 100,
            radius: 10,
            fillColor: 0xffffff,
            edgeColor: 0x000000,
            edgeWith: 2.6,
            offset: 10
        }
        this.generateBox(this.roundedSquare);

        this.textBox = {
            fillName: 'fillText',
            edgeName: 'edgeText',
            width: 335,
            height: 80,
            radius: 10,
            fillColor: 0xffffff,
            edgeColor: 0x000000,
            edgeWith: 1,
            offset: 10
        }

        this.generateBox(this.textBox);

        this.inputBox = {
            fillName: 'fillInput',
            edgeName: 'edgeInput',
            width: 420,
            height: 100,
            radius: 10,
            fillColor: 0xffffff,
            edgeColor: 0x000000,
            edgeWith: 2,
            offset: 10
        }

        this.generateBox(this.inputBox);

        rt.destroy();
        this.graphics.destroy();
    }

    generateBox(boxParams){
        // parte interior
        this.graphics.fillStyle(boxParams.fillColor, 1);
        this.graphics.fillRoundedRect(boxParams.offset, boxParams.offset, boxParams.width, boxParams.height, boxParams.radius);
        this.graphics.generateTexture(boxParams.fillName, boxParams.width + boxParams.offset * 2, boxParams.height + boxParams.offset * 2);
        this.graphics.clear();

        // borde
        this.graphics.lineStyle(boxParams.edgeWith, boxParams.edgeColor, 1);
        this.graphics.strokeRoundedRect(boxParams.offset, boxParams.offset, boxParams.width, boxParams.height, boxParams.radius);
        this.graphics.generateTexture(boxParams.edgeName, boxParams.width + boxParams.offset * 2, boxParams.height + boxParams.offset * 2);
        this.graphics.clear();
    }

    ///////////////////////////////////////
    /// Metodos para cambiar de escena ///
    //////////////////////////////////////
    startLangMenu() {
        let sceneName = 'LanguageMenu';
        this.changeScene(sceneName);
        this.currentScene = this.currentScene.scene.get(sceneName);

        sceneName = 'UIManager';
        this.currentScene.scene.stop(sceneName);
    }
    
    startTitleMenu() {
        let sceneName = 'TitleMenu';
        this.changeScene(sceneName);
        this.currentScene = this.currentScene.scene.get(sceneName);
    }
    
    startUserInfoMenu() {
        let sceneName = 'UserInfoMenu';
        this.changeScene(sceneName);
        this.currentScene = this.currentScene.scene.get(sceneName);
    }

    startGame() {
        // IMPORTANTE: Hay que lanzar primero el UIManager para que se inicialice
        // el DialogManager y las escenas puedan crear los dialogos correctamente
        let sceneName = 'UIManager';
        this.currentScene.scene.launch(sceneName);
        this.UIManager = this.currentScene.scene.get(sceneName);
        
        sceneName = 'Test';
        this.changeScene(sceneName);
        this.currentScene = this.currentScene.scene.get(sceneName);
    }

    
    getDialogManager() {
        if (this.UIManager) return this.UIManager.getDialogManager();
        else return null;
    }

    /**
    * Metodo para cambiar de escena 
    * @param {Phaser.Scene / String} scene - nombre o instancia de la escena a la que se va a pasar
    */
    changeScene(scene) {
        if (this.UIManager && this.getDialogManager()) this.getDialogManager().clearPortraits();
        this.currentScene.scene.start(scene);
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
    * @returns {boolean} - true si se ha sobrescrito un valor, false en caso contrario
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
    * @returns {boolean} - true si existe el valor, false en caso contrario
    */
    hasValue(key) {
        return this.map.has(key);
    }

}