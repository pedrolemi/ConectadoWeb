import BaseScene from "../../framework/scenes/baseScene.js"
import DialogManager from "./../managers/dialogManager.js";
import GameManager from "./../managers/gameManager.js";

export default class ConectadoBaseScene extends BaseScene {
    // Posibles valores de la posicion inicial de la camara
    static CAM_POS_LEFT = 0;
    static CAM_POS_RIGHT = 1;
    static CAM_POS_CENTER = 0.5;
    
    constructor(name, atlasName) {
        super(name, atlasName);
    }

    create(params) {
        super.create(params);

        this.gameManager = GameManager.getInstance();
        this.dialogManager = DialogManager.getInstance();

        // Parametros del fondo y la camara para el scroll
        this.bg = null;
        this.bgScale = 1;
        this.leftBound = 0;
        this.rightBound = this.CANVAS_WIDTH;
        this.START_SCROLLING = 30;
        this.CAMERA_SPEED = 0.7;

        this.BG_DEPTH = 0;
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

    initialSetup(params) {
        super.initialSetup(params);

        // Por defecto se pone la camara en el centro y si hay parametros que indiquen
        // donde colocar la camara, se coloca a la izquierda o a la derecha
        if (params == null) {
            params = {
                camPos: ConectadoBaseScene.CAM_POS_CENTER 
            };
        }
        else if (params.camPos == null) {
            params.camPos = ConectadoBaseScene.CAM_POS_CENTER;
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


    setInteractive(name, obj, onClick = () => {}) {
        super.setInteractive(obj);
        obj.setInteractive();
        
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
        this.bg = this.add.image(x, y, img).setOrigin(originX, originY);
        this.bgScale = this.CANVAS_HEIGHT / this.bg.height;
        this.bg.setScale(this.bgScale);

        this.leftBound = this.bg.x - this.bg.displayWidth * originX;
        this.rightBound = this.bg.x + this.bg.displayWidth * (1 - originX);
    }

    createToggle(elemInitialState, elemEndState, permanent, onClick = () => {}) {
        // Oculta el estado final del elemento
        elemEndState.setVisible(false);
        
        // Establece el tipo de evento de puntero segun si el toggle es permanente
        let initialEvt = "pointerdown";
        let endEvt = "pointerdown";
        if (!permanent) {
            initialEvt = "pointerover",
            endEvt = "pointerour"
        }

        // Al producir el evento de puntero del estado inicial, se oculta y se muestra el estado final
        elemInitialState.on(initialEvt, () => {
            elemInitialState.setVisible(false);
            elemEndState.setVisible(true);
        });

        // Al producir el evento de puntero del estado final, se oculta y se muestra el estado inicial
        elemEndState.on(endEvt, () => {
            elemInitialState.setVisible(true);
            elemEndState.setVisible(false);
        });

        elemEndState.on("pointerdown", () => {
            onClick();
        });

        // Al pulsar el estado inicial, si se esta usando input tactil, se muestra el estado final por 
        // un momento, se produce el evento indicado, y luego se muestra el estado inicial de vuelta
        elemInitialState.on("pointerdown", () => {
            if (IS_TOUCH) {
                elemInitialState.setVisible(false);
                elemEndState.visible(true);

                setTimeout(() => {
                    onClick();
                    if (!permanent) {
                        elemInitialState.setVisible(true);
                        elemEndState.visible(false);
                    }
                }, 100);
            }
        });
    }
}