import BaseScene from "../../framework/scenes/baseScene.js"
import ConectadoEventNames from "../eventNames.js";
import GameManager from "./../managers/gameManager.js";
import SpineCharacter from "./spineCharacter.js"

export default class ConectadoBaseScene extends BaseScene {  
    constructor(name, atlasName) {
        super(name, atlasName);
    }

    create(params) {
        super.create(params);

        this.gameManager = GameManager.getInstance();

        this.characters = new Map();

        // Parametros del fondo y la camara para el scroll
        this.bg = null;
        this.bgScale = 1;
        this.leftBound = 0;
        this.rightBound = this.CANVAS_WIDTH;
        this.START_SCROLLING = 30;
        this.CAMERA_SPEED = 0.7;

        // Posibles valores de la posicion inicial de la camara
        this.CAM_POS_LEFT = 0;
        this.CAM_POS_RIGHT = 1;
        this.CAM_POS_CENTER = 0.5;
        
        // Configuraciones de profundidad para los elementos del fondo
        this.BG_DEPTH = 0;
        this.INTERACTABLES_DEPTH = 3;
        this.TOGGLES_DEPTH = 5;
        
        // Nodo con los dialogos de todos los dias
        this.everydayNodes = this.cache.json.get("everydayDialog");
    }

    /**
    * Metodo que se llama al terminar de crear la escena. Se encarga de llamar initialSetup
    * @param {Object} params - objeto con los parametros que pasarle a initialSetup 
    */
    onCreate(params) {
        super.onCreate(params);
        this.initialSetup(params);
    }

    /**
    * Metodo que se llama al despertar la escena. Se encarga de llamar initialSetup
    * @param {Object} params - objeto con los parametros que pasarle a initialSetup 
    */
    onWake(params) {
        super.onWake(params);
        this.initialSetup(params);
    }

    shutdown(params) {
        super.shutdown(params);
        this.dispatcher.dispatch(ConectadoEventNames.stopScene, this.characters);
    }

    initialSetup(params) {
        this.dispatcher.dispatch(ConectadoEventNames.changeScene, this.characters);

        // Por defecto se pone la camara en el centro y si hay parametros que indiquen
        // donde colocar la camara, se coloca a la izquierda o a la derecha
        if (params == null) {
            params = {
                camPos: this.CAM_POS_CENTER 
            };
        }
        else if (params.camPos == null) {
            params.camPos = this.CAM_POS_CENTER;
        }
        if (params.camPos != null) {
            let camOffset = this.CANVAS_WIDTH * params.camPos;
            let startOffset = (this.rightBound - this.leftBound) * (1 - params.camPos);
            this.cameras.main.scrollX = this.rightBound - camOffset - startOffset;
        }
    }

    update(t, dt) {
        super.update(t, dt);
        
        // Si se esta usando un dispositivo con input de teclado y raton (no es tactil) o
        // si el input es tactil *Y* se esta pulsando la pantalla, se mueve la camara:
        // Si el puntero esta a la izquierda y el scroll de la camara no es inferior al del
        // extremo izquierdo, la mueve hacia la izquierda y lo mismo para el extremo derecho
        if (!IS_TOUCH || (IS_TOUCH && this.input.activePointer.isDown)) {
            // Si se esta usando un dispositivo con input tactil, se ajusta el limite para empezar a mover la camara
            let threshold = this.START_SCROLLING;
            if (IS_TOUCH) {
                threshold *= 1.5;
            }

            if (this.game.input.activePointer.x < threshold && this.cameras.main.scrollX > this.leftBound + this.CAMERA_SPEED * dt) {
                this.cameras.main.scrollX -= this.CAMERA_SPEED * dt;
            }
            else if (this.game.input.activePointer.x > this.CANVAS_WIDTH - threshold
                && this.cameras.main.scrollX < this.rightBound - this.CANVAS_WIDTH - this.CAMERA_SPEED * dt) {
                this.cameras.main.scrollX += this.CAMERA_SPEED * dt;
            }
        }
    }

    /**
    * Hace un objeto interactivo y configura la llamada al tracker para su interaccion con este
    * @param {String} name - nombre del objeto con el que se interactua
    * @param {Phaser.GameObject} obj - objeto a hacer interactivo
    * @param {Function} onClick -  funcion a la que se llamara al pulsar sobre el
    */
    setInteractive(name, obj, onClick = () => {}) {
        super.setInteractive(obj);
        obj.setInteractive();

        // Se recoloca el objeto
        obj.setDepth(this.INTERACTABLES_DEPTH);
        
        obj.on("pointerdown", () => {
            // TODO: TRACKER EVENT: Enviar interaccion con el elemento

            onClick();
        });
    }

    /**
    * Crea la imagen de fondo y le aplica la escala necesaria para ocupar todo el alto de la pantalla
    * @param {String} img - id de la imagen de fondo
    * @param {Number} x - posicion x de la imagen de fondo
    * @param {Number} y - posicion y de la imagen de fondo
    * @param {Number} originX - origen x de la imagen de fondo
    * @param {Number} originY - origen y de la imagen de fondo
    */
    createBg(img, x = 0, y = 0, originX = 0, originY = 0) {
        this.bg = this.add.image(x, y, img).setOrigin(originX, originY).setDepth(this.BG_DEPTH);
        this.bgScale = this.CANVAS_HEIGHT / this.bg.height;
        this.bg.setScale(this.bgScale);

        this.leftBound = this.bg.x - this.bg.displayWidth * originX;
        this.rightBound = this.bg.x + this.bg.displayWidth * (1 - originX);
    }

    /**
    * Hace interactivos los objetos indicados y los configura para cambiar entre uno y otro al interactuar con ellos
    * @param {Phaser.GameObject} initialStateObj - objeto que representa el estado incial del toggle
    * @param {String} initialStateName - nombre del objeto inicial
    * @param {Phaser.GameObject} endStateObj - objeto que representa el estado final del toggle
    * @param {String} endStateName - nombre del objeto final
    * @param {Boolean} permanent - true si el toggle se queda activo/inactivo hasta que se vuelve a interactuar 
    *                              con el, false si cambia en cuanto se termina la interaccion
    * @param {Function} onClick - funcion a llamar al pulsar sobre el objeto en su estado final
    */
    createToggle(initialStateObj, initialStateName, endStateObj, endStateName, permanent, onClick = () => {}) {
        this.setInteractive(initialStateName, initialStateObj);
        this.setInteractive(endStateName, endStateObj);
        initialStateObj.setDepth(this.TOGGLES_DEPTH);
        endStateObj.setDepth(this.TOGGLES_DEPTH);
        
        // Oculta el estado final del elemento
        endStateObj.setVisible(false);
        
        // Establece el tipo de evento de puntero segun si el toggle es permanente
        let initialEvt = "pointerdown";
        let endEvt = "pointerdown";
        if (!permanent) {
            initialEvt = "pointerover",
            endEvt = "pointerout"
        }

        // Al producir el evento de puntero del estado inicial, se oculta y se muestra el estado final
        initialStateObj.on(initialEvt, () => {
            initialStateObj.setVisible(false);
            endStateObj.setVisible(true);
        });

        // Al producir el evento de puntero del estado final, se oculta y se muestra el estado inicial
        endStateObj.on(endEvt, () => {
            initialStateObj.setVisible(true);
            endStateObj.setVisible(false);
        });

        endStateObj.on("pointerdown", () => {
            onClick();

            initialStateObj.setVisible(true);
            endStateObj.setVisible(false);
        });

        if (!permanent) {
            // Al pulsar el estado inicial, si se esta usando input tactil, se muestra el estado final por 
            // un momento, se produce el evento indicado, y luego se muestra el estado inicial de vuelta
            initialStateObj.on("pointerdown", () => {
                if (IS_TOUCH) {
                    initialStateObj.setVisible(false);
                    endStateObj.setVisible(true);

                    setTimeout(() => {
                        onClick();

                        initialStateObj.setVisible(true);
                        endStateObj.setVisible(false);
                    }, 100);
                }
            });
        }
    }

    createImageCharacter(x, y, imgKey, scale, characterKey = imgKey, depth = this.INTERACTABLES_DEPTH) {
        let char = this.add.image(x, y, imgKey).setScale(scale).setOrigin(0.5, 1).setDepth(depth);
        this.characters.set(characterKey, char);

        char.key = characterKey = imgKey;
        char.clone = (scene) => {
            let clone = scene.add.image(x, y, imgKey).setScale(scale).setOrigin(0.5, 1).setDepth(depth);
            return clone;
        }
        char.syncAnimation = () => {};

        return char;
    }
    createSpineCharacter(x, y, spineKey, onClick, scale, animationName, characterKey = spineKey, depth = this.INTERACTABLES_DEPTH) {
        let char = new SpineCharacter(this, x, y, spineKey, onClick);
        this.characters.set(characterKey, char);
        
        char.setScale(scale);
        char.setAnimation(animationName);
        char.setDepth(depth);

        return char;
    }
}