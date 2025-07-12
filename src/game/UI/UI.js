import BaseUI from "../../framework/UI/baseUI.js";
import ConectadoEventNames from "../eventNames.js";
import ConectadoDialogBox from "./conectadoDialogBox.js";
import Phone from "./phone.js";

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

        this.phone = new Phone(this);
        this.createIcon();
        // TODO: CREAR ICONO DE NOTIFICACIONES

        this.textbox = new ConectadoDialogBox(this);
        
        this.createLids();


        // Configurar eventos
        this.initalScrollX = 0;
        this.alarmScene = null;

        // Al empezar el dia se ocultan el telefono y el icono del telefono y se abren los ojos
        this.dispatcher.add(ConectadoEventNames.startDay, this, () => {
            this.phoneIcon.setVisible(false);
            this.phone.activate(false, 0);
            this.openEyes();
        });

        // Al mostrar la alarma se cambia a dicha pantalla en el movil
        this.dispatcher.add(ConectadoEventNames.showAlarm, this, (params) => {
            this.phone.setAlarm();
            this.phone.toggle(params.animTime);
            this.phone.bgBlock.disableInteractive();
            
            // Se configura el scroll para que el telefono se mueva junto a la camara
            this.alarmScene = params.alarmScene;
            this.initalScrollX = this.alarmScene.cameras.main.scrollX;
        });

        // Al retrasar la alarma se oculta el telefono y se vuelven a cerrar los ojos
        this.dispatcher.add(ConectadoEventNames.delayAlarm, this, (params) => {
            this.phone.toggle(params.animTime);
            this.alarmScene = null;

            setTimeout(() => {
                this.closeEyes(true);
            }, params.animTime + this.SLEEP_DELAY);
        });

        // Al despertar, se oculta el telefono
        this.dispatcher.add(ConectadoEventNames.wakeUp, this, (params) => {
            this.phone.toggle(params.animTime);
            this.alarmScene = null;

            // Una vez se oculta el telefono, se reinicia la posicion de la camara
            setTimeout(() => {
                this.cameras.main.scrollX = 0;
            }, params.animTime);
        });


        // TEST
        let rect = this.add.rectangle(100, 100, 100, 100, 0x0, 1);
        rect.setInteractive();
        rect.on("pointerdown", () => {
            this.dispatcher.dispatch(ConectadoEventNames.tryDelayingAlarm, null);
        });

        rect = this.add.rectangle(100, 300, 100, 100, 0x0, 1);
        rect.setInteractive();
        rect.on("pointerdown", () => {
            this.dispatcher.dispatch(ConectadoEventNames.wakeUp, { animTime: 1500 });
        });
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

        // Anade el icono del telefono
        this.phoneIcon = this.add.image(this.CANVAS_WIDTH - ICON_OFFSET_X, this.CANVAS_HEIGHT - ICON_OFFSET_Y, "phoneElements", "phoneIcon").setScale(ICON_SCALE);
        this.setInteractive(this.phoneIcon);

        // Al pasar el raton por encima del icono, se hace mas grande
        this.phoneIcon.on('pointerover', () => {
            this.tweens.add({
                targets: this.phoneIcon,
                scale: ICON_SCALE * 1.1,
                duration: 0,
                repeat: 0,
            });
        });
        // Al quitar el raton de encima vuelve a su tamano original
        this.phoneIcon.on('pointerout', () => {
            this.tweens.add({
                targets: this.phoneIcon,
                scale: ICON_SCALE,
                duration: 0,
                repeat: 0,
            });
        });
        // Al pulsar, se hace pequeno y grande de nuevo y se activa/desactiva el telefono
        this.phoneIcon.on('pointerdown', () => {
            this.phone.toggle();
            this.tweens.add({
                targets: this.phoneIcon,
                scale: ICON_SCALE,
                duration: 20,
                repeat: 0,
                yoyo: true
            });
        });

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