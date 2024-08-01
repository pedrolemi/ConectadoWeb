import BaseScreen from "./baseScreen.js";
import ChatScreen from "./chatScreen.js";

export default class MessagesScreen extends BaseScreen {
    constructor(scene, phone, prevScreen) {
        super(scene, phone, 'messagesBg', prevScreen);

        // Configuracion de texto para la el texto de ll titulo
        let textConfig = { ...scene.gameManager.textConfig };
        textConfig.fontStyle = 'bold';
        textConfig.color = '#000';

        // Se coge el texto del archivo de traducciones y se pone en pantalla 
        let text = this.i18next.t("textMessages.title", { ns: "phoneInfo" });
        let titleText = this.scene.add.text(this.BG_X, this.BG_Y * 0.365, text, textConfig).setOrigin(0.5, 0.5);

        this.chatNum = 0;
        this.chatTextConfig = { ...textConfig }
        // chatTextConfig.fontFamily = 'gidole-regular';
        this.chatTextConfig.fontSize = 20 + 'px';
        this.chatTextConfig.style = 'normal';

        this.add(titleText);
    }

    /**
     * Crea el boton para acceder al chat
     * @param {String} icon - nombre de la imagen que se va a poner de icono
     * @param {String} name - nombre del chat
     * @param {Object} textConfig - configuracion de texto para el nombre
     * @param {Function} onClick - funcion que se llamara al hacer click en el boton
     * @returns {Object} - objeto con el contenedor y el objeto de texto de las notificaciones
     */
    createChatButton(icon, name, textConfig, onClick) {
        // Anade la imagen del boton. Dependiendo del numero de chats que haya, se iran creando abajo
        let button = this.scene.add.image(this.BG_X, this.BG_Y * 0.5, 'phoneElements', 'chatButton').setScale(0.6);
        button.y += (button.displayHeight + 7) * this.chatNum;
        button.setInteractive({ useHandCursor: true });

        // Anade el texto
        let nameText = this.scene.add.text(button.x - button.displayWidth / 3.5, button.y, name, textConfig).setOrigin(0, 0.5);
        let iconImage = this.scene.add.image(button.x - button.displayWidth / 2, button.y, 'avatars', icon);
        iconImage.setScale(button.displayHeight / iconImage.displayHeight);
        iconImage.x += iconImage.displayWidth / 2;

        // Configuracion de las animaciones
        let tintFadeTime = 50;
        let noTint = Phaser.Display.Color.HexStringToColor('#ffffff');
        let pointerOverColor = Phaser.Display.Color.HexStringToColor('#c9c9c9');

        // Hace fade del color de la caja al pasar o quitar el raton por encima
        button.on('pointerover', () => {
            this.scene.tweens.addCounter({
                targets: [button],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(noTint, pointerOverColor, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    button.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
            });
        });
        button.on('pointerout', () => {
            this.scene.tweens.addCounter({
                targets: [button],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(pointerOverColor, noTint, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    button.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
            });
        });

        // Al hacer click, vuelve a cambiar el color de la caja al original
        button.on('pointerdown', () => {
            let fadeColor = this.scene.tweens.addCounter({
                targets: [button],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(noTint, pointerOverColor, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    button.setTint(colInt);
                    yoyo: true
                },
                duration: tintFadeTime,
                repeat: 0,
            });
            // Si la funcion onClick es valida y se ha hecho la 
            // animacion, al terminar la animacion llama a la funcion
            if (fadeColor) {
                fadeColor.on('complete', () => {
                    if (onClick !== null && typeof onClick === 'function') {
                        onClick();
                    }
                });

            }
        });

        // Aumenta el numero de chats que hay
        this.chatNum++;

        this.add(button);
        this.add(nameText);
        this.add(iconImage);

        // Crea el icono de las notificaciones
        let notifObj = this.phone.phoneManager.createNotification(this.BG_X + this.bg.displayWidth * 0.4, button.y, true);
        this.add(notifObj.container);
        notifObj.container.visible = false;

        return notifObj;
    }


    /**
     * Anade la pantalla del chat al telefono y anade el boton 
     * para entrar a ese chat en esta pantalla 
     * @param {String} name - nombre del contacto
     * @param {String} icon - id de la imagen con la foto de perfil del contacto
     */
    addChat(name, icon) {
        // Crea la pantalla
        let screen = new ChatScreen(this.scene, this.phone, this, name, icon);

        // Anade la pantalla al contenedor del telefono y la hace invisible
        this.phone.add(screen);
        screen.visible = false;
        this.phone.bringToTop(this.phone.phone);

        // Crea el boton del chat y su icono de notificaciones en esta pantalla 
        let notifObj = this.createChatButton(icon, name, this.chatTextConfig, () => {
            // Al pulsar el boton, se cambiara a la pantalla creada
            this.phone.toChatScreen(name);
        });

        // Establece el objeto notifications de la pantalla creada
        screen.notifications = notifObj;

        // Anade la pantalla al mapa de chats del telefono con la key del nombre del chat
        this.phone.chats.set(name, screen);
    }

}