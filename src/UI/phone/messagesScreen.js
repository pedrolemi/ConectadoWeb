import BaseScreen from "./baseScreen.js";

export default class MessagesScreen extends BaseScreen {
    constructor(scene, phone, bgImage, prevScreen) {
        super(scene, phone, bgImage, prevScreen);

        // Configuracion de texto para la el texto de ll titulo
        let textConfig = { ...scene.textConfig };
        textConfig.fontFamily = 'arial';
        textConfig.fontSize = 25 + 'px';
        textConfig.color = '#000';
        textConfig.strokeThickness = 0;

        // Se coge el texto del archivo de traducciones y se pone en pantalla 
        let text = this.i18next.t("textMessages.title", { ns: "phone" })
        let titleText = scene.createText(this.BG_X, this.BG_Y * 0.365, text, textConfig).setOrigin(0.5, 0.5);

        this.chatNum = 0;
        let chatTextConfig = { ...textConfig }
        // chatTextConfig.fontFamily = 'gidole-regular';
        chatTextConfig.fontSize = 20 + 'px';
        chatTextConfig.style = 'normal';

        this.createChat("testIcon", "AAA", chatTextConfig, () => { console.log("aaa")}) ;
        this.createChat("testIcon", "BBB", chatTextConfig);
        this.createChat("testIcon", "CCC", chatTextConfig);
        this.createChat("testIcon", "DDD", chatTextConfig);
        this.createChat("testIcon", "EEE", chatTextConfig);
        this.createChat("testIcon", "FFF", chatTextConfig);

        this.add(titleText);
    }


    createChat(icon, name, textConfig, onClick) {
        let button = this.scene.add.image(this.BG_X, this.BG_Y * 0.5, 'chatButton').setScale(0.6);
        button.y += (button.displayHeight + 7) * this.chatNum;
        button.setInteractive();

        let nameText = this.scene.createText(button.x - button.displayWidth / 3.5, button.y, name, textConfig).setOrigin(0, 0.5);
        let iconImage = this.scene.add.image(button.x - button.displayWidth / 2, button.y, icon);
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
        button.on('pointerdown', (pointer) => {
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
            if (fadeColor && onClick !== null && typeof onClick === 'function') {
                fadeColor.on('complete', () => {
                    onClick();
                });
            }
        });

        this.chatNum++;
        this.add(button);
        this.add(nameText);
        this.add(iconImage);
    }


}