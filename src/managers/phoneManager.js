import Phone from '../UI/phone/phone.js';
import GameManager from './gameManager.js';

export default class PhoneManager {
    /**
    * Gestor del telefono. Se encarga de mostrar/ocultar el telefono y contiene el telefono en si
    */
    constructor(scene) {
        this.scene = scene;
        this.gameManager = GameManager.getInstance();
        
        this.CANVAS_WIDTH = scene.sys.game.canvas.width
        this.CANVAS_HEIGHT = scene.sys.game.canvas.height;
        let OFFSET = 80;
        let ICON_SCALE = 0.3;
        this.TOGGLE_SPEED = 500;
        this.SLEEP_DELAY = 500;

        this.icon = scene.add.image(this.CANVAS_WIDTH - OFFSET, this.CANVAS_HEIGHT - OFFSET, 'phoneIcon').setScale(ICON_SCALE);
        this.icon.setInteractive();

        let notifObj = this.createNotification(this.icon.x + this.icon.displayWidth / 2, this.icon.y - this.icon.displayHeight / 2);
        this.notifications = notifObj.container;
        this.notificationText = notifObj.text;

        this.phone = new Phone(scene, this);
        this.icon.setDepth(this.phone.depth - 1)

        this.bgBlock = scene.add.rectangle(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT, 0xfff, 0).setOrigin(0, 0);
        this.bgBlock.setInteractive();
        this.bgBlock.setDepth(this.icon.depth - 1);

        this.icon.on('pointerover', () => {
            if (!this.scene.getDialogManager().isTalking()) {
                scene.tweens.add({
                    targets: [this.icon],
                    scale: ICON_SCALE * 1.1,
                    duration: 0,
                    repeat: 0,
                });
            }
        });
        this.icon.on('pointerout', () => {
            scene.tweens.add({
                targets: [this.icon],
                scale: ICON_SCALE,
                duration: 0,
                repeat: 0,
            });
        });
        this.icon.on('pointerdown', (pointer) => {
            if (!this.scene.getDialogManager().isTalking()) {
                this.togglePhone();
                scene.tweens.add({
                    targets: [this.icon],
                    scale: ICON_SCALE,
                    duration: 20,
                    repeat: 0,
                    yoyo: true
                });
            }
        });

        this.activeTween = null;
        this.toggling = false;
        
        // this.togglePhone();
        // this.toggling = false;
        // this.phone.visible = false;
        // this.bgBlock.disableInteractive();
        this.setNotifications(0);
    }

    // Muestra/oculta el telefono
    togglePhone() {
        // Si no hay una animacion reproduciendose
        if (!this.toggling) {
            // Se indica que va a empezar una
            this.toggling = true;

            // Si el telefono es visible
            if (this.phone.visible) {

                // Se mueve hacia abajo a la izquierda
                let deactivate = this.scene.tweens.add({
                    targets: [this.phone],
                    x: - this.CANVAS_WIDTH * 0.75,
                    y: this.CANVAS_HEIGHT,
                    duration: this.TOGGLE_SPEED,
                    repeat: 0,
                });
                this.activeTween = deactivate;

                // Una vez terminada la animacion, se oculta el telefono, se indica que ya ha 
                // terminado y se reactiva la interaccion con los elementos del fondo
                deactivate.on('complete', () => {
                    this.phone.visible = false;
                    this.toggling = false;
                    this.bgBlock.disableInteractive();
                });
            }
            // Si el telefono no es visible
            else {
                // Se hace visible, se vuelve a la pantalla de inicio y se
                // bloquea la interaccion con los elementos del fondo
                this.phone.visible = true;
                this.phone.toMainScreen();
                this.bgBlock.setInteractive();

                // Se mueve hacia el centro de la pantalla
                let activate = this.scene.tweens.add({
                    targets: [this.phone],
                    x: 0,
                    y: 0,
                    duration: this.TOGGLE_SPEED,
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

        let notifications = this.scene.add.container(0, 0)
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
     * Cambia el texto del dia y la hora
     * @param {String} hour - Hora
     * @param {String} dayText - Informacion del dia
     */
    setDayInfo(hour, dayText) {
        this.phone.setDayInfo(hour, dayText);
    }

    /**
     * Establece las notificaciones que hay
     * @param {Number} amount - Numero de notificaciones a poner
     */
    setNotifications(amount) {
        // Si son mas de 0, activa las notificaciones y cambia el texto
        if (amount > 0) {
            this.notifications.visible = true;
            this.notificationText.setText(amount);
        }
        // Si no, las desactiva
        else {
            this.notifications.visible = false;
            this.notificationText.setText("");
        }
        this.phone.setNotifications(amount);
    }

    // Funcion llamada al aplazar la alarma
    // (WIP)
    sleep() {
        this.togglePhone();
        if (this.activeTween) {
            this.activeTween.on('complete', () => {
                let i18next = this.gameManager.i18next;

                let hour = "10:20";
                let day = i18next.t("clock.lateTest", { ns: "phone" });

                this.setDayInfo(hour, day)
                setTimeout(() => {
                    this.togglePhone();
                    this.phone.toAlarmScreen();
                }, this.SLEEP_DELAY)

            });
        }
    }

    // Funcion llamada al apagar la alarma y despertarse
    // (WIP)
    wakeUp() {
        console.log("wakeUp");
        this.togglePhone();
    }
}