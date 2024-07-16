import Phone from '../UI/phone/phone.js';
import GameManager from './gameManager.js';

export default class PhoneManager {
    /**
    * Gestor del telefono. Se encarga de mostrar/ocultar el telefono y contiene el telefono en si
    */
    constructor(scene) {
        this.scene = scene;
        this.gameManager = GameManager.getInstance();
        this.i18next = this.gameManager.i18next;

        // Configuracion de las posiciones y animaciones
        this.OFFSET = 80;
        this.ICON_SCALE = 0.3;
        this.TOGGLE_SPEED = 500;
        this.SLEEP_DELAY = 500;

        // Crea el icono del telefono y lo guarda en la variable this.icon
        this.createIcon();

        // Anade el icono de las notificaciones
        let notifObj = this.createNotification(this.icon.x + this.icon.displayWidth / 2, this.icon.y - this.icon.displayHeight / 2);
        this.notifications = notifObj.container;
        this.notificationText = notifObj.text;

        // Anade el telefono 
        this.phone = new Phone(scene, this);

        // Anade un rectangulo para bloquear la interaccion con los elementos del fondo
        this.bgBlock = scene.add.rectangle(0, 0, this.scene.CANVAS_WIDTH, this.scene.CANVAS_HEIGHT, 0xfff, 0).setOrigin(0, 0);
        this.bgBlock.setInteractive();
        this.bgBlock.setDepth(this.icon.depth - 1);

        // Si se pulsa fuera del telefono cuando esta sacado, se guarda
        this.bgBlock.on('pointerdown', (pointer) => {
            if (this.phone.visible) {
                this.togglePhone();
            }
        });


        this.activeTween = null;
        this.bgBlock.disableInteractive();
        this.notificationAmount = 0;
        this.setNotifications();


        this.topLid = scene.add.rectangle(0, 0, this.scene.CANVAS_WIDTH, this.scene.CANVAS_HEIGHT / 2, 0x000, 1).setOrigin(0, 0);
        this.topLid.setDepth(100);
        this.bottomLid = scene.add.rectangle(0, this.scene.CANVAS_HEIGHT / 2, this.scene.CANVAS_WIDTH, this.scene.CANVAS_HEIGHT / 2, 0x000, 1).setOrigin(0, 0);
        this.bottomLid.setDepth(100);

        this.sleptVar = "isLate";
        
        if (!this.gameManager.hasValue(this.sleptVar)) {
            this.gameManager.setValue(this.sleptVar, false);
        }

        
        // Crea el mensaje de despertarse y lo guarda en la variable this.wakeUpMessage
        this.createMessage();
        this.wakeUpMessage.visible = false;
    }


    // Crea el icono
    createIcon() {
        // Anade el icono del telefono
        this.icon = this.scene.add.image(this.scene.CANVAS_WIDTH - this.OFFSET, this.scene.CANVAS_HEIGHT - this.OFFSET, 'phoneIcon').setScale(this.ICON_SCALE);
        this.icon.setInteractive();

        // Al pasar el raton por encima del icono, se hace mas grande,
        // al quitar el raton de encima vuelve a su tamano original,
        // y al hacer click, se hace pequeno y grande de nuevo
        this.icon.on('pointerover', () => {
            if (!this.scene.getDialogManager().isTalking()) {
                this.scene.tweens.add({
                    targets: [this.icon],
                    scale: this.ICON_SCALE * 1.1,
                    duration: 0,
                    repeat: 0,
                });
            }
        });
        this.icon.on('pointerout', () => {
            this.scene.tweens.add({
                targets: [this.icon],
                scale: this.ICON_SCALE,
                duration: 0,
                repeat: 0,
            });
        });
        this.icon.on('pointerdown', (pointer) => {
            if (!this.scene.getDialogManager().isTalking()) {
                this.togglePhone();
                this.scene.tweens.add({
                    targets: [this.icon],
                    scale: this.ICON_SCALE,
                    duration: 20,
                    repeat: 0,
                    yoyo: true
                });
            }
        });

    }

    /**
     * Reproduce la animacion de ocultar/mostrar el movil
     * @param {Number} speed - velolcidad a la que se reproduce la animacion (en ms) 
     */
    togglePhone(speed) {
        if (!speed && speed !== 0) {
            speed = this.TOGGLE_SPEED;
        }

        // Si no hay una animacion reproduciendose
        if (!this.toggling) {
            // Se indica que va a empezar una
            this.toggling = true;

            // Si el telefono es visible
            if (this.phone.visible) {
                // Se mueve hacia abajo a la izquierda
                let deactivate = this.scene.tweens.add({
                    targets: [this.phone],
                    x: - this.scene.CANVAS_WIDTH * 0.75,
                    y: this.scene.CANVAS_HEIGHT,
                    duration: speed,
                    repeat: 0,
                });
                this.activeTween = deactivate;

                // Una vez terminada la animacion, se oculta el telefono, se indica que ya ha terminado, se 
                // reactiva la interaccion con los elementos del fondo y vuelve a la pantalla de inicio
                deactivate.on('complete', () => {
                    this.phone.visible = false;
                    this.toggling = false;
                    this.bgBlock.disableInteractive();
                    this.phone.toMainScreen();

                });
            }
            // Si el telefono no es visible
            else {
                // Se hace visible y se bloquea la interaccion con los elementos del fondo
                this.phone.visible = true;
                this.bgBlock.setInteractive();

                let x = 0;
                let y = 0;
                this.phone.setScale(1);

                // Si el telefono esta en la pantalla de alarma, se hace mas pequeno
                // y se ajusta el movimiento para que el movil quede en el centro
                if (this.phone.currScreen === this.phone.alarmScreen) {
                    this.phone.setScale(0.8);
                    x += this.phone.phone.displayWidth * 0.15;
                    y += this.phone.phone.displayHeight * 0.1;
                }

                // Se mueve hacia el centro de la pantalla
                let activate = this.scene.tweens.add({
                    targets: [this.phone],
                    x: x,
                    y: y,
                    duration: speed,
                    repeat: 0,
                });
                this.activeTween = activate;

                // Una vez terminada la animacion, se indica que ya ha terminado
                activate.on('complete', () => {
                    this.toggling = false;
                });
            }
        }
    }

    
    // Crea el mensaje de despertarse
    createMessage() {
        let textConfig = { ...this.scene.textConfig };
        textConfig.fontFamily = 'gidole-regular';
        textConfig.fontSize = 40 + 'px';
        textConfig.fontStyle = 'normal'
        textConfig.strokeThickness = 0;
        textConfig.align = 'center';
        
        let text = this.i18next.t("alarm.message", { ns: "phoneInfo" })
        let wakeUpText = this.scene.createText(this.scene.CANVAS_WIDTH / 2, 0, text, textConfig).setOrigin(0.5, 0.5);
        wakeUpText.y += wakeUpText.displayHeight;

        let bgCol = 0xFFB61E1E;
        let borderCol = 0x000000;
        let borderThickness = 2;

        let w = wakeUpText.displayWidth * 1.15;
        let h = wakeUpText.displayHeight * 1.5;
        let min = Math.min(w, h);
        let radius = min * 0.1;

        let bgGraphics = this.scene.make.graphics().fillStyle(bgCol, 1).fillRoundedRect(0, 0, w, h, radius).lineStyle(borderThickness, borderCol, 1).strokeRoundedRect(0, 0, w, h, radius)
        bgGraphics.generateTexture('alarmMsgBg', w, h);
        let bg = this.scene.add.image(wakeUpText.x, wakeUpText.y, 'alarmMsgBg').setOrigin(0.5, 0.5);

        this.wakeUpMessage = this.scene.add.container(0, 0);
        this.wakeUpMessage.add(wakeUpText);
        this.wakeUpMessage.add(bg);
        this.wakeUpMessage.bringToTop(wakeUpText);
    }

    /**
     * Crea el icono de las notificaciones
     * @param {Number} x - posicion x del icono 
     * @param {Number} y - posicion y del icono
     * @returns {Object} - objeto con el contenedor y el objeto de texto
     */
    createNotification(x, y) {
        let notificationColor = 0xf55d5d

        let fillImg = this.scene.add.image(0, 0, this.gameManager.roundedSquare.fillName);
        fillImg.setTint(notificationColor);
        let edgeImg = this.scene.add.image(0, 0, this.gameManager.roundedSquare.edgeName);

        // Configuracion de texto para las notificaciones
        let notifTextConfig = { ...this.scene.textConfig };
        notifTextConfig.fontFamily = 'arial';
        notifTextConfig.fontSize = 60 + 'px';
        notifTextConfig.strokeThickness = 0;

        let textObj = this.scene.createText(0, 0, "", notifTextConfig).setOrigin(0.5, 0.5);

        let notifications = this.scene.add.container(0, 0);
        notifications.add(fillImg);
        notifications.add(edgeImg);
        notifications.add(textObj);
        notifications.setScale(0.3);
        notifications.x = x;
        notifications.y = y;

        return {
            container: notifications,
            text: textObj
        };
    }

    /**
     * Activa/desactiva el telefono de manera inmediata
     * @param {Boolean} active - true si se va a activar, false en caso contrario
     */
    activate(active) {
        if ((this.phone.visible && !active) || (!this.phone.visible && active)) {
            this.toggling = false;
            this.togglePhone(0);
        }
    }


    /**
     * Anade notificaciones a las que ya habia
     * @param {Number} amount - cantidad de notificaciones que anadir a la cantidad actual 
     */
    addNotifications(amount) {
        this.notificationAmount += amount;
        this.setNotifications();
    }

    // Establece las notificaciones que hay
    setNotifications() {
        // Si son mas de 0, activa las notificaciones y cambia el texto
        if (this.notificationAmount > 0) {
            this.notifications.visible = true;
            this.notificationText.setText(this.notificationAmount);
        }
        // Si no, las desactiva
        else {
            this.notifications.visible = false;
            this.notificationText.setText("");
        }
        this.phone.setNotifications(this.notificationAmount);
    }

    // Funcion llamada al aplazar la alarma. Si no se ha dormido antes, guarda el telefono
    // y al terminar la animacion, vuelve a reproducir la animacion de cerrar los ojos
    sleep() {
            if (!this.gameManager.getValue(this.sleptVar)) {
            this.togglePhone(1500);
            if (this.activeTween) {
                this.activeTween.on('complete', () => {
                    setTimeout(() => {
                        this.gameManager.setValue(this.sleptVar, true);
                        this.closeEyesAnimation();
                    }, this.SLEEP_DELAY);
    
                });
            }
        }
        else {
            this.wakeUpMessage.visible = true;
        }

    }

    // Funcion llamada al apagar la alarma y despertarse. Se guarda el telefono y
    // cuando termina de guardarse el telefono, se hace activo el icono
    wakeUp() {
        this.togglePhone(1500);
        if (this.activeTween) {
            this.activeTween.on('complete', () => {
                this.wakeUpMessage.visible = false;
                this.icon.visible = true;
                this.notifications.visible = true;
            });
        }
    }

    // Animacion de abrir los ojos. Mueve los parpados varias
    // veces y cuando termina, saca el movil con la alarma
    openEyesAnimation() {
        this.icon.visible = false;
        this.notifications.visible = false;
        this.activate(false);

        let speed = 1000;
        let lastTopPos = this.topLid.y;
        let lastBotPos = this.bottomLid.y;
        let movement = this.topLid.displayHeight / 4;

        // Abre los ojos
        let anim = this.scene.tweens.add({
            targets: [this.topLid],
            y: { from: lastTopPos, to: lastTopPos - movement },
            duration: speed,
            repeat: 0,
        });
        this.scene.tweens.add({
            targets: [this.bottomLid],
            y: { from: lastBotPos, to: lastBotPos + movement },
            duration: speed,
            repeat: 0,
        });

        anim.on('complete', () => {
            speed = 500
            lastTopPos = this.topLid.y;
            lastBotPos = this.bottomLid.y;
            movement = this.topLid.displayHeight / 10;

            // Cierra un poco los ojos
            anim = this.scene.tweens.add({
                targets: [this.topLid],
                y: { from: lastTopPos, to: lastTopPos + movement },
                duration: speed,
                repeat: 0,
            });
            this.scene.tweens.add({
                targets: [this.bottomLid],
                y: { from: lastBotPos, to: lastBotPos - movement },
                duration: speed,
                repeat: 0,
            });

            anim.on('complete', () => {
                speed = 500
                lastTopPos = this.topLid.y;
                lastBotPos = this.bottomLid.y;
                movement = this.topLid.displayHeight / 9;

                // Vuelve a abrir los ojos
                anim = this.scene.tweens.add({
                    targets: [this.topLid],
                    y: { from: lastTopPos, to: lastTopPos - movement },
                    duration: speed,
                    repeat: 0,
                });
                this.scene.tweens.add({
                    targets: [this.bottomLid],
                    y: { from: lastBotPos, to: lastBotPos + movement },
                    duration: speed,
                    repeat: 0,
                });

                anim.on('complete', () => {
                    speed = 500
                    lastTopPos = this.topLid.y;
                    lastBotPos = this.bottomLid.y;
                    movement = this.topLid.displayHeight / 5;

                    // Cierra los ojos un poco mas
                    anim = this.scene.tweens.add({
                        targets: [this.topLid],
                        y: { from: lastTopPos, to: lastTopPos + movement },
                        duration: speed,
                        repeat: 0,
                    });
                    this.scene.tweens.add({
                        targets: [this.bottomLid],
                        y: { from: lastBotPos, to: lastBotPos - movement },
                        duration: speed,
                        repeat: 0,
                    });

                    anim.on('complete', () => {
                        speed = 1500
                        lastTopPos = this.topLid.y;
                        lastBotPos = this.bottomLid.y;

                        // Abre los ojos completamente
                        anim = this.scene.tweens.add({
                            targets: [this.topLid],
                            y: { from: lastTopPos, to: -this.scene.CANVAS_HEIGHT / 2 },
                            duration: speed,
                            repeat: 0,
                        });
                        this.scene.tweens.add({
                            targets: [this.bottomLid],
                            y: { from: lastBotPos, to: this.scene.CANVAS_HEIGHT },
                            duration: speed,
                            repeat: 0,
                        });

                        anim.on('complete', () => {
                            this.phone.toAlarmScreen();
                            this.togglePhone(1500);
                        });

                    });
                });
            });
        });
    }

    // Animacion de cerrar los ojos. Cierra los parpados y cuando termina, vuelve a 
    // reproducir la animacion de abrir los ojos y cambia la hora del telefono
    closeEyesAnimation() {
        let speed = 2000;
        let lastTopPos = this.topLid.y;
        let lastBotPos = this.bottomLid.y;

        let anim = this.scene.tweens.add({
            targets: [this.topLid],
            y: { from: lastTopPos, to: 0 },
            duration: speed,
            repeat: 0,
        });
        this.scene.tweens.add({
            targets: [this.bottomLid],
            y: { from: lastBotPos, to: this.scene.CANVAS_HEIGHT / 2 },
            duration: speed,
            repeat: 0,
        });
        
        anim.on('complete', () => {
            setTimeout(() => {
                this.openEyesAnimation();
                let hour = this.i18next.t("clock.alarmLateHour", { ns: "phoneInfo" });
                this.phone.setDayInfo(hour, "");
            }, this.SLEEP_DELAY * 2);

        });
    }


}