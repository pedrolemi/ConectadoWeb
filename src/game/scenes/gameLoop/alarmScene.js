import TextArea from "../../../framework/UI/textArea.js";
import { createRectTexture } from "../../../framework/utils/graphics.js";
import ConectadoEventNames from "../../eventNames.js";
import ConectadoBaseScene from "../conectadoBaseScene.js";

export default class AlarmScene extends ConectadoBaseScene {
    constructor(name) {
        super("AlarmScene");
    }

    create(params) {
        super.create();

        // Reinicia la variable de llegar tarde y de haber cogido la mochila
        this.gameManager.blackboard.set("isLate", false);
        this.gameManager.blackboard.set("bagPicked", false);

        // Actualiza el dia en el gameManager y cambia el dia y la hora del telefono
        this.gameManager.day++;


        // Pone la imagen de fondo con las dimensiones del canvas
        this.bg = this.add.image(0, 0, "bedroomCeiling").setOrigin(0.5, 0);
        this.bgScale = this.CANVAS_HEIGHT / this.bg.height;
        this.bg.setScale(this.bgScale);

        // Centra la imagen de fondo
        this.bg.x += this.CANVAS_WIDTH / 2;
        this.leftBound = this.bg.x - this.bg.displayWidth / 2;
        this.rightBound = this.bg.x + this.bg.displayWidth / 2;
        
        // Pone la velocidad de scroll inicial a 0
        let ORIGINAL_CAMERA_SPEED = this.CAMERA_SPEED;
        this.CAMERA_SPEED = 0;
        

        let WARN_OFFSET = 20;
        
        let sleepWarning = this.add.container(0, 0);

        createRectTexture(this, "warnRect", 407, 124, 0xFFB61E1E, 1, 1, 0x0, 1, 15);
        let warnRect = this.add.image(this.CANVAS_WIDTH / 2, WARN_OFFSET, "warnRect").setOrigin(0.5, 0);

        let TEXT_PADDING = 10;
        let TEXT_CONFIG = {
            fontFamily: "gidole-regular",
            fontSize: 40,
            align: "center",
            wordWrap: {
                width: warnRect.displayWidth - TEXT_PADDING * 2,
                useAdvancedWrap: true
            }
        }

        let warnText = new TextArea(this, warnRect.x, warnRect.y + warnRect.displayHeight / 2, warnRect.displayWidth - TEXT_PADDING * 2, warnRect.displayHeight - TEXT_PADDING * 2,
            this.localizationManager.translate("alarm.message", "phoneInfo"), TEXT_CONFIG).setOrigin(0.5, 0.5);
        warnText.adjustFontSize();
        
        sleepWarning.add(warnRect);
        sleepWarning.add(warnText);
        sleepWarning.setScrollFactor(0);
        
        sleepWarning.setVisible(false);


        // Eventos
        let delayed = false;
        
        // Se lanza el evento de que ha empezado el dia
        this.dispatcher.dispatch(ConectadoEventNames.startDay, this);
        
        // Cuando el telefono termina de mostrarse, se comienza a poder mover la camara
        this.dispatcher.add(ConectadoEventNames.phoneOpened, this, () => {
            this.CAMERA_SPEED = ORIGINAL_CAMERA_SPEED;
        });

        // Cuando se intenta retrasar la alarma
        this.dispatcher.add(ConectadoEventNames.tryDelayingAlarm, this, (params) => {
            // Si no se ha retrasado antes, desactiva el movimiento de la camara y lanza el evento de retrasarla
            if (!delayed) {
                delayed = true;
                this.CAMERA_SPEED = 0;
                this.dispatcher.dispatch(ConectadoEventNames.delayAlarm, null);
            }
            // Si ya se ha retrasado, muestra el aviso
            else {
                sleepWarning.setVisible(true);
            }
        });

        // Cuando se han cerrado los ojos, se vuelve a colocar la camara en su posicion inicial
        this.dispatcher.add(ConectadoEventNames.eyesClosed, this, () => {
            this.initialSetup();
        });
                
        // Si se va a despertar se desactiva el movimiento de la camara
        this.dispatcher.add(ConectadoEventNames.wakeUp, this, (params) => {
            this.CAMERA_SPEED = 0;

            // Cuando el telefono termina de cerrarse, cambia a la siguiente escena
            this.dispatcher.add(ConectadoEventNames.phoneClosed, this, () => {
                let params = {
                    camPos: "right"
                }
                this.gameManager.changeScene("BedroomMorningDay" + this.gameManager.day, params);
            });
        });
    }
}