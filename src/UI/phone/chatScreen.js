import BaseScreen from "./baseScreen.js";

export default class ChatScreen extends BaseScreen {
    /**
     * Pantalla base para los chats. Tiene metodos para actualizar
     * el numero de notificaciones del telefono en base a las
     * notificaciones que haya en el chat
     * @extends {BaseScreen}
     * @param {Phaser.Scene} scene - escena a la que pertenece (UIManager)
     * @param {Phone} phone - telefono
     * @param {BaseScreen} prevScreen - pantalla anterior
     * @param {String} name - nombre del contacto
     * @param {String} icon - icono del contacto
     */
    constructor(scene, phone, prevScreen, name, icon) {
        super(scene, phone, 'chatBG', prevScreen);

        // Quita los botones de la parte inferior
        this.remove(this.returnButton);
        this.remove(this.homeButton);
        this.remove(this.uselessButton);
        this.returnButton.destroy();
        this.homeButton.destroy();
        this.uselessButton.destroy();

        // Crea la caja de respuesta y el boton de volver hacia atras
        this.createTextBox();
        this.createReturnButton();

        // Configuracion de texto para la el texto de el titulo
        let textConfig = { ...scene.textConfig };
        textConfig.fontFamily = 'arial';
        textConfig.fontSize = 25 + 'px';
        textConfig.color = '#000';
        textConfig.strokeThickness = 0;

        // Crea el texto del nombre de la persona
        this.nameText = scene.createText(this.BG_X - this.bg.displayWidth * 0.15, this.BG_Y * 0.36, name, textConfig).setOrigin(0, 0.5);

        // Crea el icono
        this.iconImage = this.scene.add.image(this.nameText.x, this.nameText.y, icon);
        this.iconImage.setScale((this.nameText.displayHeight / this.iconImage.displayHeight) * 1.5);
        this.iconImage.x -= this.iconImage.displayWidth;


        this.notifications = null;
        this.notificationAmount = 0;

        this.node = null;

        this.add(this.nameText);
        this.add(this.iconImage);
    }

    // Crea la caja de respuesta
    createTextBox() {
        // Anade la imagen de la caja
        this.textBox = this.scene.add.image(this.BG_X, this.BG_Y * 1.67, 'chatTextBox').setScale(0.6);
        this.textBox.setInteractive();

        // Configuracion de las animaciones
        let tintFadeTime = 50;
        let noTint = Phaser.Display.Color.HexStringToColor('#ffffff');
        let pointerOverColor = Phaser.Display.Color.HexStringToColor('#c9c9c9');

        // Hace fade del color de la caja al pasar o quitar el raton por encima
        this.textBox.on('pointerover', () => {
            this.scene.tweens.addCounter({
                targets: [this.textBox],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(noTint, pointerOverColor, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    this.textBox.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
            });
        });
        this.textBox.on('pointerout', () => {
            this.scene.tweens.addCounter({
                targets: [this.textBox],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(pointerOverColor, noTint, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    this.textBox.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
            });
        });

        // Al hacer click, vuelve a cambiar el color de la caja al original
        this.textBox.on('pointerdown', (pointer) => {
            let fadeColor = this.scene.tweens.addCounter({
                targets: [this.textBox],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(noTint, pointerOverColor, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    this.textBox.setTint(colInt);
                    yoyo: true
                },
                duration: tintFadeTime,
                repeat: 0,
            });
            // Si se ha hecho la animacion, al terminar la animacion hace que
            // el dialogManager cree las opciones para responder y las active
            if (fadeColor) {
                fadeColor.on('complete', () => {
                    this.gameManager.getDialogManager().setNode(this.node);
                });

            }
        });

        this.add(this.textBox);

    }

    // Crea el boton de volver atras
    createReturnButton() {
        // Anade la imagen del boton
        this.returnButton = this.scene.add.image(this.BG_X * 0.77, this.BG_Y * 0.36, 'backButton').setScale(0.7);
        this.returnButton.setInteractive();

        let originalScale = this.returnButton.scale;

        // Al pasar el raton por encima del icono, se hace mas grande,
        // al quitar el raton de encima vuelve a su tamano original,
        // y al hacer click, se hace pequeno y grande de nuevo
        this.returnButton.on('pointerover', () => {
            this.scene.tweens.add({
                targets: [this.returnButton],
                scale: originalScale * 1.2,
                duration: 0,
                repeat: 0,
            });
        });
        this.returnButton.on('pointerout', () => {
            this.scene.tweens.add({
                targets: [this.returnButton],
                scale: originalScale,
                duration: 0,
                repeat: 0,
            });
        });
        this.returnButton.on('pointerdown', (pointer) => {
            let anim = this.scene.tweens.add({
                targets: [this.returnButton],
                scale: originalScale,
                duration: 20,
                repeat: 0,
                yoyo: true
            });

            // Cuando termina la animacion, vuelve a la pantalla anterior
            anim.on('complete', () => {
                this.phone.toPrevScreen();
            })
        });

        this.add(this.returnButton);
    }


    // Borra todas las notificaciones de este chat
    // (genera -notificationAmount para quitarlas todas)
    clearNotifications() {
        this.generateNotifications(-this.notificationAmount);
    }

    /**
     * Genera notificaciones para el chat
     * @param {Number} amount - cantidad de notificaciones a generar 
     */
    generateNotifications(amount) {
        // Actualiza la cantidad de notificaciones tanto del chat, como en general
        this.notificationAmount += amount;
        this.phone.phoneManager.addNotifications(amount);

        // Si ya no hay notificaciones, se oculta el icono
        if (this.notificationAmount === 0) {
            this.notifications.container.visible = false;
        }
        // Si hay notificaciones, se muestra el icono y actualiza el texto
        else {
            this.notifications.container.visible = true;
            this.notifications.text.setText(this.notificationAmount);
        }
    }

    /**
     * Cambia el nodo de dialogo
     * @param {DialogNode} node - nodo de dialogo que se va a reproducir
     */
    setNode(node) {
        this.node = node;
    }
}