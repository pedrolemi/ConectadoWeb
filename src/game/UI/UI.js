import BaseUI from "../../framework/UI/baseUI.js";
import GameManager from "../managers/gameManager.js";

import ConectadoEventNames from "../eventNames.js";
import ConectadoDialogBox from "./conectadoDialogBox.js";
import Phone from "./phone/phone.js";
import { growAnimation, fadeAnimation } from "../../framework/utils/graphics.js";
import NotificationIcon from "./phone/elements/notificationIcon.js";

export default class UI extends BaseUI {
    constructor() {
        super("UI", "UI");
    }

    init(params) {
        super.init(params);
        
        const PADDING =  10;
        const OPTION_BOX_SCALE_X = (this.CANVAS_WIDTH - PADDING * 2) / this.textures.get("dialogs").get("optionBg").width;
        
        this.textConfig = {
            fontFamily: "Arial",
            fontSize: 27,
            fontStyle: 600
        }
        this.optionBoxConfig = {
            imgAtlas: "dialogs",
            img: "optionBg",
            imgScaleX: OPTION_BOX_SCALE_X,
            
            boxSpacing: 0,
            
            textPaddingX: 10,
            textPaddingY: 15,
            
            textOffsetX: 0,
            textOffsetY: 0,

            textOriginX: 0,

            textAlignX: 0,
        }
        this.optionsTextConfig = { ... this.textConfig };
        this.optionsTextConfig.fontSize = 35;
        this.optionsTextConfig.align = "left";
    }

    create(params) {
        super.create(params);
        this.textbox.destroy();

        this.gameManager = GameManager.getInstance();

        this.phone = new Phone(this);
        this.createIcon();
        // TODO: CREAR ICONO DE NOTIFICACIONES
        // TODO: CREAR ICONO DE NOTIFICACIONES EN MAINSCREEN
        // TODO: CREAR ICONO DE NOTIFICACIONES EN MSGLISTSCREEN

        this.activeCharacters = new Map();      // Asocia un Character en una escena con el container de su retrato
        this.portraits = new Map();             // Asocia el nombre de un personaje con su retrato en la escena
        this.PORTRAIT_X = 110;
        this.PORTRAIT_Y = 980;
        this.PORTRAIT_SCALE = 0.1;

        this.textbox = new ConectadoDialogBox(this);
        this.textbox.on("pointerdown", () => { this.skipDialog(); });
        this.portraitMask = this.textbox.createMask();
        
        this.createLids();
        

        this.configureAlarmEvents();
        this.configureGameEvents();
    }

    update(t, dt) {
        if (this.alarmScene != null) {
            this.cameras.main.scrollX = this.alarmScene.cameras.main.scrollX - this.initalScrollX;
        }
    }

    startTextNode(node) {
        super.startTextNode(node);
        
        // Si la caja es visible y el personaje que habla cambia
        if (this.textbox.visible && this.textbox.lastCharacter != node.character) {
            // Si el personaje anterior tiene retrato, se oculta
            if (this.portraits.has(this.textbox.lastCharacter)) {
                fadeAnimation(this.portraits.get(this.textbox.lastCharacter).list, false);
            }
            // Si el personaje actual tiene retrato, se muestra
            if (this.portraits.has(node.character)) {
                fadeAnimation(this.portraits.get(node.character).list, true);
            }
        }
        // Si no, si el personaje actual tiene retrato, se muestra
        else {
            if (this.portraits.has(node.character)) {
                fadeAnimation(this.portraits.get(node.character).list, true);
            }
        }
    }
    
    endDialogNodes() {
        super.endDialogNodes();

        // Se ocultan todos los retratos
        this.portraits.forEach((portrait, key) =>{
            fadeAnimation(portrait.list, false);
        });
    }


    createIcon() {
        const ICON_OFFSET_X = 70;
        const ICON_OFFSET_Y = 75;
        const ICON_SCALE = 0.3;
        const ICON_GROW_SCALE = 1.1;

        const NOTIFICATION_OFFSET_X = 15;
        const NOTIFICATION_OFFSET_Y = 40;

        // Anade el icono del telefono
        this.phoneIcon = this.add.image(this.CANVAS_WIDTH - ICON_OFFSET_X, this.CANVAS_HEIGHT - ICON_OFFSET_Y, "phoneElements", "phoneIcon").setScale(ICON_SCALE);
        this.notifications = new NotificationIcon(this, this.phoneIcon.x + NOTIFICATION_OFFSET_X, this.phoneIcon.y - NOTIFICATION_OFFSET_Y);

        growAnimation(this.phoneIcon, this.phoneIcon, () => {
            this.phone.toggle();
        }, true, false, ICON_GROW_SCALE, false, 20);
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
        const WAKE_TOGGLE_TIME = 1500;
        this.initalScrollX = 0;
        this.alarmScene = null;

        // Al empezar el dia se ocultan el telefono y el icono del telefono y se abren los ojos
        this.dispatcher.add(ConectadoEventNames.startDay, this, (alarmScene) => {
            this.phoneIcon.setVisible(false);
            this.phone.activate(false, 0);
            this.openEyesAnimation();

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
            this.bgBlock.disableInteractive();
            this.phone.toggle(WAKE_TOGGLE_TIME);
            this.alarmScene = null;

            // Una vez se oculta el telefono, se reinicia la posicion de la camara
            this.dispatcher.addOnce(ConectadoEventNames.phoneClosed, this, () => {
                this.cameras.main.scrollX = 0;
                this.phoneIcon.setVisible(true);
                this.phone.disableAlarm();
                // this.phone.toMainScreen();
            });
        });
    }

    configureGameEvents() {
        this.dispatcher.add("sleep", this, () => {
            this.closeEyes(false);
        });

        this.dispatcher.add(ConectadoEventNames.startNightmare, this, () => {
            this.openEyesAnimation(true);
        });

        // Al cambiar de escena
        this.dispatcher.add(ConectadoEventNames.changeScene, this, (characters) => {
            // Se recorren todos los personajes de la escena
            characters.forEach((character, key) => {
                // Si el personaje no esta guardado
                if (!this.activeCharacters.has(character)) {
                    // Se clona el personaje
                    let char = character.clone(this);
                    char.setScale(this.PORTRAIT_SCALE);
                    char.setPosition(this.PORTRAIT_X, this.PORTRAIT_Y);
                    char.setVisible(false);
                    
                    // Se mete el personaje en un container y se le aplica la mascara de la caja de texto
                    let container = this.add.container(0, 0);
                    container.add(char);
                    container.setMask(this.portraitMask);
                    
                    // Se guarda el personaje, su container y su id
                    this.activeCharacters.set(character, container);
                    this.portraits.set(key, container);
                    this.textbox.addPortrait(key);
                }
                // Si esta guardado, se obtiene el Character de su container y se sincroniza la animacion
                // del retrato (ya que al cambiar de escena, la animacion de los personajes se pausa, pero
                // la animacion del retrato sigue ejecutandose)
                else {
                    let char = this.activeCharacters.get(character);
                    char = char.list[0];
                    char.syncAnimation(character);
                }
            });
        });

        // Al eliminar una escena, se eliminan todos sus personajes de la UI y se eliminan sus retratos
        this.dispatcher.add(ConectadoEventNames.stopScene, this, (characters) => {
            characters.forEach((character, key) => {
                if (this.activeCharacters.has(character)) {
                    this.activeCharacters.get(character).destroy();
                    this.activeCharacters.delete(character);
                    this.textbox.removePortrait(key);
                }
            });
        });
    }

    /**
    * Animacion de abrir los ojos. Mueve los parpados varias veces hasta abrirlos del todo
    */
    openEyesAnimation(instant = false) {
        if (instant) {
            // Recoloca los parpados para que esten abiertos
            this.topLid.y = this.OPENED_TOP_LID_Y;
            this.botLid.y = this.OPENED_BOT_LID_Y;
            return;
        }
        
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
                    this.openEyesAnimation();
                }, this.SLEEP_DELAY * 2);
            }
        });
    }

    
}