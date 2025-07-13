import BaseUI from "../../framework/UI/baseUI.js";
import GameManager from "../managers/gameManager.js";

import ConectadoEventNames from "../eventNames.js";
import ConectadoDialogBox from "./conectadoDialogBox.js";
import Phone from "./phone/phone.js";
import { growAnimation } from "../../framework/utils/graphics.js";

export default class UI extends BaseUI {
    constructor() {
        super("UI", "UI");
    }

    init(params) {
        super.init(params);

        this.textConfig = {
            fontFamily: "Arial",
            fontSize: 27,
            fontStyle: 600
        }
        this.optionBoxConfig = {
            boxSpacing: 10,
            textPaddingX: 70,
            textPaddingY: 10,
            textOffsetX: 0,
            textOffsetY: 0,
        }
        this.optionsTextConfig = { ... this.textConfig };
        this.optionsTextConfig.fontSize = 35;
        this.optionsTextConfig.align = "center";
        this.optionsTextConfig.wordWrap = {
            width: 1,
            useAdvancedWrap: true
        }
    }

    create(params) {
        super.create(params);
        this.textbox.destroy();

        this.gameManager = GameManager.getInstance();

        this.phone = new Phone(this);
        this.createIcon();
        // TODO: CREAR ICONO DE NOTIFICACIONES

        this.textbox = new ConectadoDialogBox(this);
        
        this.createLids();


        this.configureAlarmEvents();
    }

    update(t, dt) {
        if (this.alarmScene != null) {
            this.cameras.main.scrollX = this.alarmScene.cameras.main.scrollX - this.initalScrollX;
        }
    }


    createIcon() {
        let ICON_OFFSET_X = 70;
        let ICON_OFFSET_Y = 75;
        let ICON_SCALE = 0.3;
        let ICON_GROW_SCALE = 1.1;

        // Anade el icono del telefono
        this.phoneIcon = this.add.image(this.CANVAS_WIDTH - ICON_OFFSET_X, this.CANVAS_HEIGHT - ICON_OFFSET_Y, "phoneElements", "phoneIcon").setScale(ICON_SCALE);
        growAnimation(this.phoneIcon, this.phoneIcon, () => {
            this.phone.toggle();
        }, ICON_GROW_SCALE, false, 20);
        
        this.phoneIcon.setVisible(false);
    }

    createNotificationIcon() {
        // TODO
    }

    createLids() {
        this.CLOSED_TOP_LID_Y = 0;
        this.CLOSED_BOT_LID_Y = this.CANVAS_HEIGHT / 2;
        this.OPENED_TOP_LID_Y = - this.CANVAS_HEIGHT / 2;
        this.OPENED_BOT_LID_Y = this.CANVAS_HEIGHT;
        
        // Crea los parpados para la animacion de abrir y cerrar los ojos
        this.topLid = this.add.rectangle(0, this.OPENED_TOP_LID_Y, this.CANVAS_WIDTH, this.CANVAS_HEIGHT / 2, 0x000, 1).setOrigin(0, 0);
        this.topLid.setDepth(100).setScrollFactor(0);
        this.botLid = this.add.rectangle(0, this.OPENED_BOT_LID_Y, this.CANVAS_WIDTH, this.CANVAS_HEIGHT / 2, 0x000, 1).setOrigin(0, 0);
        this.botLid.setDepth(100).setScrollFactor(0);

        this.SLEEP_DELAY = 500;
    }


    configureAlarmEvents() {
        // Configurar eventos
        let WAKE_TOGGLE_TIME = 1500;
        this.initalScrollX = 0;
        this.alarmScene = null;

        // Al empezar el dia se ocultan el telefono y el icono del telefono y se abren los ojos
        this.dispatcher.add(ConectadoEventNames.startDay, this, (alarmScene) => {
            this.phoneIcon.setVisible(false);
            this.phone.activate(false, 0);
            this.openEyes();

            // Se configura el scroll para que el telefono se mueva junto a la camara
            this.alarmScene = alarmScene;
            this.initalScrollX = this.alarmScene.cameras.main.scrollX;
        });

        // Al terminar de abrir los ojos se activa la alarma y se muestra el movil
        this.dispatcher.add(ConectadoEventNames.eyesOpened, this, () => {
            this.phone.setAlarm();
            this.phone.toggle(WAKE_TOGGLE_TIME);
            this.phone.bgBlock.disableInteractive();
        });

        // Al retrasar la alarma se oculta el telefono y se vuelven a cerrar los ojos
        this.dispatcher.add(ConectadoEventNames.delayAlarm, this, (params) => {
            this.phone.toggle(WAKE_TOGGLE_TIME);

            // Se anade el evento solo una vez para que no se cierren los ojos cada vez que se cierra el movil
            this.dispatcher.addOnce(ConectadoEventNames.phoneClosed, this, () => {
                this.dispatcher.dispatch(ConectadoEventNames.changeHour, "alarmLateHour");
                this.closeEyes(true);
            });
        });

        // Al despertar, se oculta el telefono
        this.dispatcher.add(ConectadoEventNames.wakeUp, this, (params) => {
            this.phone.toggle(WAKE_TOGGLE_TIME);
            this.alarmScene = null;

            // Una vez se oculta el telefono, se reinicia la posicion de la camara
            this.dispatcher.addOnce(ConectadoEventNames.phoneClosed, this, () => {
                this.cameras.main.scrollX = 0;
                this.phoneIcon.setVisible(true);
                this.phone.toMainScreen();
            });
        });
    }


    /**
    * Animacion de abrir los ojos. Mueve los parpados varias veces hasta abrirlos del todo
    */
    openEyes() {
        // Recoloca los parpados para que esten cerrados
        this.topLid.y = this.CLOSED_TOP_LID_Y;
        this.botLid.y = this.CLOSED_BOT_LID_Y;
        this.cameras.main.scrollX = 0;
        this.bgBlock.setInteractive();

        let speed = 1000;
        let lastTopPos = this.topLid.y;
        let lastBotPos = this.botLid.y;
        let movement = this.topLid.displayHeight / 4;

        // Abre los ojos
        let anim = this.tweens.add({
            targets: this.topLid,
            y: { from: lastTopPos, to: lastTopPos - movement },
            duration: speed,
            repeat: 0,
        });
        this.tweens.add({
            targets: this.botLid,
            y: { from: lastBotPos, to: lastBotPos + movement },
            duration: speed,
            repeat: 0,
        });

        // Cierra un poco los ojos
        anim.on("complete", () => {
            speed = 500
            lastTopPos = this.topLid.y;
            lastBotPos = this.botLid.y;
            movement = this.topLid.displayHeight / 10;

            anim = this.tweens.add({
                targets: this.topLid,
                y: { from: lastTopPos, to: lastTopPos + movement },
                duration: speed,
                repeat: 0,
            });
            this.tweens.add({
                targets: this.botLid,
                y: { from: lastBotPos, to: lastBotPos - movement },
                duration: speed,
                repeat: 0,
            });

            // Vuelve a abrir los ojos
            anim.on("complete", () => {
                speed = 500
                lastTopPos = this.topLid.y;
                lastBotPos = this.botLid.y;
                movement = this.topLid.displayHeight / 9;

                anim = this.tweens.add({
                    targets: this.topLid,
                    y: { from: lastTopPos, to: lastTopPos - movement },
                    duration: speed,
                    repeat: 0,
                });
                this.tweens.add({
                    targets: this.botLid,
                    y: { from: lastBotPos, to: lastBotPos + movement },
                    duration: speed,
                    repeat: 0,
                });

                // Cierra los ojos un poco mas
                anim.on("complete", () => {
                    speed = 500
                    lastTopPos = this.topLid.y;
                    lastBotPos = this.botLid.y;
                    movement = this.topLid.displayHeight / 5;

                    anim = this.tweens.add({
                        targets: this.topLid,
                        y: { from: lastTopPos, to: lastTopPos + movement },
                        duration: speed,
                        repeat: 0,
                    });
                    this.tweens.add({
                        targets: this.botLid,
                        y: { from: lastBotPos, to: lastBotPos - movement },
                        duration: speed,
                        repeat: 0,
                    });

                    // Abre los ojos completamente
                    anim.on("complete", () => {
                        speed = 1500
                        lastTopPos = this.topLid.y;
                        lastBotPos = this.botLid.y;

                        anim = this.tweens.add({
                            targets: this.topLid,
                            y: { from: lastTopPos, to: -this.CANVAS_HEIGHT / 2 },
                            duration: speed,
                            repeat: 0,
                        });
                        this.tweens.add({
                            targets: this.botLid,
                            y: { from: lastBotPos, to: this.CANVAS_HEIGHT },
                            duration: speed,
                            repeat: 0,
                        });

                        // Cuando termina la animacion de desactivarse, se lanza el evento de que se han abierto los ojos
                        anim.on("complete", () => {
                            this.dispatcher.dispatch(ConectadoEventNames.eyesOpened, this);
                        });

                    });
                });
            });
        });
    }
    
    /**
    * Animacion de cerrar los ojos. Cierra los parpados de golpe
    * @param {Boolean} openAgain - true si se va a reproducir la animacion de abrir los ojos cuando termine, false en caso contrario 
    */
    closeEyes(openAgain = true) {
        // Recoloca los parpados para que esten abiertos
        this.topLid.y = this.OPENED_TOP_LID_Y;
        this.botLid.y = this.OPENED_BOT_LID_Y;
        this.bgBlock.setInteractive();

        let speed = 2000;
        let lastTopPos = this.topLid.y;
        let lastBotPos = this.botLid.y;
        
        let anim = this.tweens.add({
            targets: this.topLid,
            y: { from: lastTopPos, to: 0 },
            duration: speed,
            repeat: 0,
        });
        this.tweens.add({
            targets: this.botLid,
            y: { from: lastBotPos, to: this.CANVAS_HEIGHT / 2 },
            duration: speed,
            repeat: 0,
        });

        // Cuando termina, se lanza el evento de que se han abierto los ojos 
        anim.on("complete", () => {
            this.dispatcher.dispatch(ConectadoEventNames.eyesClosed, this);

            // Si se establece, se vuelve a reproducir la animacion de abrir los ojos
            if (openAgain) {
                setTimeout(() => {
                    this.openEyes();
                }, this.SLEEP_DELAY * 2);
            }
        });
    }
}