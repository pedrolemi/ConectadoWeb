import EventDispatcher from "../eventDispatcher.js";

// Variable de nivel de modulo
// - Se puede acceder desde cualquier parte del modulo, pero no es visible
// al no pertencen a la clase y no ser exportada
// - No cambia con las instancia puesto que no pertenece a la clase, sino

// al modulo y solo existe un modulo
let instance = null;

export default class GameManager {
    /**
    * Maneja el flujo de juego y variables de uso comun
    * @param {Scene} - se necesita una escena para poder acceder al ScenePlugin y cambiar de escena
    */
    constructor(scene) {
        // no deberia suceder, pero por si acaso se hace el new de la clase desde fuera
        if (instance === null) {
            instance = this;
        }
        else {
            throw new Error('GameManager is a Singleton class!');
        }

        // Se necesita una escena para poder acceder al ScenePlugin y cambiar de escena
        // Por lo tanto, se aprovecha para mantener la escena actual
        // El SceneManager tb incluye el cambio de escena, pero no es recomendable segun
        // la docu manejarlo a traves de el
        this.currentScene = scene;

        this.i18next = this.currentScene.plugins.get('rextexttranslationplugin');
        this.dispatcher = EventDispatcher.getInstance();

        // Indica el dia del juego
        this.day = 1;

        // Blackboard
        this.map = new Map();
        this.map.set("bag", false);

        this.isLate = "isLate";
        this.map.set(this.isLate, false);

        this.generateTextures();

        this.userInfo = null;

        // Configuracion de texto por defecto
        this.textConfig = {
            fontFamily: 'Arial',        // Fuente (tiene que estar precargada en el html o el css)
            fontSize: 25 + 'px',        // Tamano de la fuente del dialogo
            fontStyle: 'normal',        // Estilo de la fuente
            backgroundColor: null,      // Color del fondo del texto
            color: '#ffffff',           // Color del texto
            stroke: '#000000',          // Color del borde del texto
            strokeThickness: 0,         // Grosor del borde del texto 
            align: 'left',              // Alineacion del texto ('left', 'center', 'right', 'justify')
            wordWrap: null,
            padding: null               // Separacion con el fondo (en el caso de que haya fondo)
        }
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

    /**
     * Se utiliza para generar las diferentes texturas que se van a usar en los menus y poder
     * tener un sencillo acceso a los diferentes parametros de cada una (nombre, tam...)
     */
    generateTextures() {
        // Se genera una textura en forma de circulo
        // Es necesario porque el emisor de particulas solo admite texturas, pero no shapes
        this.circleParticle = {
            name: 'circleParticle',
            radius: 50,
            color: 0xFF0808
        }
        // Se crea un render texture para poder generar texturas dinamicante a
        // partir de casi cualquier objeto
        // (x, y, width, height) --> 
        // --> el render texture se coloca en el centro del circulo y con el tam del circulo para que la textura resultante sea del tam del circulo
        let rt = this.currentScene.add.renderTexture(this.circleParticle.radius, this.circleParticle.radius, this.circleParticle.radius * 2, this.circleParticle.radius * 2);
        // Se crea un circlo
        let circle = this.currentScene.add.circle(0, 0, this.circleParticle.radius, this.circleParticle.color);
        // (entry, x, y) --> se dibuja el circulo
        rt.draw(circle, this.circleParticle.radius, this.circleParticle.radius);
        // Se guarda la textura con el nombre correspondiente
        rt.saveTexture(this.circleParticle.name);
        // Se destruye el circulo
        circle.destroy();

        // Se crea un objeto grafico, que sirve para formas primitivas (resulta muy util para dibujar elementos con bordes redondeados)
        // Ademas, si el objeto grafico no va a modificar durante el tiempo es recomendable convertirlo en una textura y usarla
        // para mejorar el rendimiento
        this.graphics = this.currentScene.add.graphics();

        // Se crea un cuadrado con bordes redondeados
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

        // Se crea un rectangulo con bordes redondeados que sirve para una caja de texto
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

        // Se crea un rectangulo alargado con bordes redondeados que sirve para una caja donde introducir input
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

        // Se destruyen tanto el render texture como el graphics puesto que ya no se van a usar mas
        rt.destroy();
        this.graphics.destroy();
    }

    /**
     * Sirve para crear una forma primitva usando el objeto grafico creado anteriormente
     * Se van a crear tanto la parte interior como el borde de la forma
     * IMPORTANTE:
     * - La forma primitva no se puede crear pegada a uno de los bordes de la pantalla porque sino hay ciertos detalles que se pierden
     * - La textura generada a partir de la forma primitiva no puede ser exactamente del mismo detalle que la forma porque sino hay
     *      ciertos detalles que se pierden.
     * Por los motivos nombrados arriba se utiliza un pequeño offset. Sin embargo, esto va a provocar que la caja de colision
     * textura sea un poquito mas grande que la textura en si
     * Nota: a la hora de crear una forma primitiva con un objeto grafico, el (0, 0) esta arriba a la izquierda
     */
    generateBox(boxParams) {
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

        sceneName = 'UIManager';
        this.currentScene.scene.stop(sceneName);
        this.map.clear();
    }

    startTitleMenu() {
        let sceneName = 'TitleMenu';
        this.changeScene(sceneName);
    }

    startUserInfoMenu() {
        let sceneName = 'UserInfoMenu';
        this.changeScene(sceneName);
    }

    startGame(userInfo) {
        this.setUserInfo(userInfo);

        // IMPORTANTE: Hay que lanzar primero el UIManager para que se inicialice
        // el DialogManager y las escenas puedan crear los dialogos correctamente
        let sceneName = 'UIManager';
        this.currentScene.scene.launch(sceneName);
        this.UIManager = this.currentScene.scene.get(sceneName);

        // Pasa a la escena inicial con los parametros text, onComplete y onCompleteDelay
        // sceneName = 'TextOnlyScene';
        // this.changeScene(sceneName, {
        //     // El texto de se coge del a archivo de traducciones
        //     text: this.i18next.t("day1.start", { ns: "transitionScenes", returnObjects: true }),
        //     onComplete: () => {
        //         // Al llamar a onComplete, se cambiara a la escena de la alarma
        //         // Con el parametro day, que se coge del archivo de traducciones
        //         let days = this.i18next.t("clock.days", { ns: "phoneInfo", returnObjects: true });
        //         this.changeScene('AlarmScene', {
        //             day: days[0],
        //             nextScene: 'Test'
        //         });
        //     },
        //     onCompleteDelay: 500
        // });

        sceneName = 'Test';
        this.changeScene(sceneName);
    }

    setUserInfo(userInfo) {
        this.userInfo = userInfo;
    }

    /**
    * Metodo para cambiar de escena 
    * @param {String} scene - key de la escena a la que se va a pasar
    * @param {Object} - informacion que pasar a la escena (opcional)
    */
    changeScene(scene, params) {
        this.currentScene.scene.stop();
        this.currentScene.scene.start(scene, params);
        this.currentScene = this.currentScene.scene.get(scene);

        if (this.UIManager && this.UIManager.dialogManager) {
            this.UIManager.dialogManager.clearPortraits();
        }
    }

    switchToComputer() {
        // se duerme la escena actual (se deja de actualizar y renderizar)
        // (luego se va a poder despertar)
        this.currentScene.scene.sleep();
        // se cambia a la escena del ordenador
        // run tiene 3 opciones:
        // - si esta pausada (no se actualiza), se reanuda
        // - si esta dormida (no se actualiza ni renderiza), se despierta
        // - si no esta corriendo, se inicia
        // La primera vez sucede que se inicio y luego, se va a despertar
        this.currentScene.scene.run('ComputerScene');
    }

    leaveComputer() {
        this.currentScene.scene.sleep('ComputerScene');
        this.currentScene.scene.wake();
    }

    // tiene los campos: name, username, password, gender
    getUserInfo() {
        return this.userInfo;
    }

    ///////////////////////////////////////
    ///// Metodos para la blackboard /////
    //////////////////////////////////////
    /**
    * Devuelve el valor buscado en la blackboard
    * @returns {object} - el objeto buscado en caso de que exista. null en caso contrario
    */
    getValue(key) {
        if (this.map.has(key)) {
            return this.map.get(key);
        }
        return null;
    }

    /**
    * Metodo que setea un valor en la blackboard
    * @returns {boolean} - true si se ha sobrescrito un valor. false en caso contrario
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
    * Indica si un valor existe o no en la blackboard
    * @returns {boolean} - true si existe el valor. false en caso contrario
    */
    hasValue(key) {
        return this.map.has(key);
    }

}