import GameManager from '../../managers/gameManager.js'
import FriendsScreen from './friendsScreen.js'
import FeedScren from './feedScreen.js'

export default class SocialNetworkScreen extends Phaser.GameObjects.Group {
    constructor(scene) {
        super(scene);

        const CANVAS_WIDTH = this.scene.sys.game.canvas.width;
        const CANVAS_HEIGHT = this.scene.sys.game.canvas.height;

        this.gameManager = GameManager.getInstance();

        // Fondo de login del ordenador
        let mainViewBg = this.scene.add.image(0.23 * CANVAS_WIDTH / 5, 4.1 * CANVAS_HEIGHT / 5, 'computerMainView');
        mainViewBg.setOrigin(0, 1).setScale(0.61);
        mainViewBg.displayWidth += 20;
        this.add(mainViewBg);

        let tabParams = {
            x: 1.07 * CANVAS_WIDTH / 7,
            y: 1.75 * CANVAS_HEIGHT / 4,
            scale: 0.9
        }
        let displayHeight = this.createTab(tabParams.x, tabParams.y, tabParams.scale, 'dialogBubbleIcon', "Tablón", () => {

        });

        this.createTab(tabParams.x, tabParams.y + displayHeight, tabParams.scale, 'friendsIcon', "Amigos", () => {

        });

        this.createTab(tabParams.x, tabParams.y + displayHeight * 2, tabParams.scale, 'photosIcon', "Postear", () => {
            console.log("no tengo nada q publicar")
        });

        let userInfo = this.gameManager.getUserInfo();
        let genderPfp = "";
        if (userInfo.gender === 'male') {
            genderPfp = 'pfpM';
        }
        else if (userInfo.gender === 'female') {
            genderPfp = 'pfpF'
        }
        if (genderPfp !== "") {
            let pfp = this.scene.add.image(tabParams.x, 1.03 * CANVAS_HEIGHT / 7, genderPfp);
            pfp.setOrigin(0.5, 0).setScale(0.7);
            this.add(pfp);

            let nameTextStyle = { ...this.gameManager.textConfig };
            nameTextStyle.fontFamily = 'AUdimat-regular';
            nameTextStyle.fontSize = '27px';
            nameTextStyle.color = '#323232';
            let nameText = this.scene.add.text(CANVAS_WIDTH / 11, pfp.y + pfp.displayHeight + 25, userInfo.name, nameTextStyle);
            nameText.setOrigin(0, 0.5);
            this.add(nameText);
        }

        //this.feedScreen = new FeedScren(this.scene);
        //this.add(this.feedScreen);

        this.friendsScreen = new FriendsScreen(this.scene);
        this.add(this.friendsScreen);

        this.createFriendRequestNotificacion(3 * CANVAS_WIDTH / 5, 4.5 * CANVAS_HEIGHT / 6, 0.9);
    }

    createFriendRequestNotificacion(x, y, scale) {
        let container = this.scene.add.container(x, y);
        let buttonBg = this.scene.add.image(0, 0, 'buttonBg');
        buttonBg.setScale(6, 0.68);
        container.add(buttonBg);

        let style = { ...this.gameManager.textConfig };
        style.fontFamily = 'AUdimat-regular';
        style.fontSize = '28px';
        style.color = '#ff0000';
        let text = this.scene.add.text(0, 0, '¡Tienes nuevas peticiones de amistad!', style);
        text.setOrigin(0.5);
        container.add(text);

        container.setScale(scale);
        this.add(container);
        let iconScale = 0.65;
        let iconOffset = 265;
        let leftIcon = this.scene.add.image(-iconOffset, 0, 'friendsIcon');
        leftIcon.setTint(Phaser.Display.Color.GetColor(255, 0, 0));
        leftIcon.setScale(iconScale);
        container.add(leftIcon);

        let rightIcon = this.scene.add.image(iconOffset, 0, 'friendsIcon');
        rightIcon.setTint(Phaser.Display.Color.GetColor(255, 0, 0));
        rightIcon.setScale(iconScale);
        container.add(rightIcon);
    }

    createTab(x, y, scale, icon, text, fn) {
        let container = this.scene.add.container(x, y);

        let buttonBg = this.scene.add.image(0, 0, 'buttonBg');
        buttonBg.setScale(2, 1);
        let nCol = Phaser.Display.Color.GetColor(255, 255, 255);
        nCol = Phaser.Display.Color.IntegerToRGB(nCol);
        let hCol = Phaser.Display.Color.GetColor(240, 240, 240);
        hCol = Phaser.Display.Color.IntegerToRGB(hCol);
        let pCol = Phaser.Display.Color.GetColor(200, 200, 200);
        pCol = Phaser.Display.Color.IntegerToRGB(pCol);
        buttonBg.setInteractive();

        let tintFadeTime = 25;

        buttonBg.on('pointerover', () => {
            this.scene.tweens.addCounter({
                targets: [buttonBg],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(nCol, hCol, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    buttonBg.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
            });
        });

        buttonBg.on('pointerout', () => {
            this.scene.tweens.addCounter({
                targets: [buttonBg],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(hCol, nCol, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    buttonBg.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
            });
        });

        buttonBg.on('pointerdown', (pointer) => {
            buttonBg.disableInteractive();
            let down = this.scene.tweens.addCounter({
                targets: [buttonBg],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(hCol, pCol, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    buttonBg.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
                yoyo: true,
            });
            down.on('complete', () => {
                buttonBg.setInteractive();
                //fn();
            });
        });
        container.add(buttonBg);

        let offset = -5;
        let iconImg = this.scene.add.image(offset, 0, icon);
        iconImg.setScale(0.85);
        iconImg.setOrigin(1, 0.5);
        container.add(iconImg);

        let style = { ...this.gameManager.textConfig };
        style.fontFamily = 'AUdimat-regular';
        style.fontSize = '27px';
        style.color = '#323232';
        offset += 8.5;
        let sideText = this.scene.add.text(offset, 0, text, style);
        sideText.setOrigin(0, 0.5);
        container.add(sideText);

        container.setScale(scale);
        this.add(container);

        return buttonBg.displayHeight * scale;
    }

    setVisible(enable) {
        this.feedScreen.setVisible(enable);
        this.friendsScreen.setVisible(enable);
        super.setVisible(enable);
    }

    reset() {
        this.friendsScreen.setVisible(false);
        this.feedScreen.setVisible(true);
    }
}