import BaseScene from "../../framework/scenes/baseScene.js"
import DialogManager from "./../managers/dialogManager.js";
import GameManager from "./../managers/gameManager.js";

export default class ConectadoBaseScene extends BaseScene {
    constructor(name) {
        super(name);
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
        this.cameras.main.scrollX = this.rightBound / 2 - this.CANVAS_WIDTH / 2;
        if (params) {
            if (params.camPos === "left") {
                this.cameras.main.scrollX = this.leftBound;
            }
            else if (params.camPos === "right") {
                this.cameras.main.scrollX = this.rightBound - this.CANVAS_WIDTH;
            }
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
}