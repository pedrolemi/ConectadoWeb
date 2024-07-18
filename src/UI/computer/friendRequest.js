import HitListElementButton from '../hitListElementButton.js';
import GameManager from '../../managers/gameManager.js';

export default class FriendRequest extends Phaser.GameObjects.Container {
    constructor(scene, x, y, scale, character, charName, bio, denyFn, acceptFn, blockFn) {
        super(scene, x, y);

        this.scene.add.existing(this);

        let gameManager = GameManager.getInstance();

        this.scale = scale;
        this.setScale(scale);

        this.hits = [];

        let bgScale = {
            x: 1.1,
            y: 0.8
        }
        this.newFriendBg = this.scene.add.image(0, 0, 'newFriendBg');
        this.newFriendBg.setScale(bgScale.x, bgScale.y).setOrigin(0.5, 0);
        this.add(this.newFriendBg);

        let oldFriendBg = this.scene.add.image(0, 0, 'oldFriendBg');
        oldFriendBg.setScale(bgScale.x, bgScale.y).setOrigin(0.5, 0);
        oldFriendBg.setVisible(false);
        this.add(oldFriendBg);

        this.h = this.newFriendBg.displayHeight * scale;

        let avatarIcon = this.scene.add.image(-257, 75, character);
        avatarIcon.setScale(0.265);
        this.add(avatarIcon);

        let nameTextStyle = { ...gameManager.textConfig };
        nameTextStyle.fontFamily = 'AUdimat-regular';
        nameTextStyle.fontSize = '33px';
        //nameTextStyle.fontStyle = 'normal';
        nameTextStyle.color = '#323232';
        let nameText = this.scene.add.text(-180, 45, charName, nameTextStyle);
        nameText.setOrigin(0, 0.5);
        this.add(nameText);

        let bioTextStyle = { ...gameManager.textConfig };
        bioTextStyle.fontFamily = 'AUdimat-regular';
        bioTextStyle.fontSize = '26px';
        bioTextStyle.color = '#323232';
        bioTextStyle.align = 'justify';
        bioTextStyle.wordWrap = {
            width: 480,
            useAdvancedWrap: true
        }
        let bioText = this.scene.add.text(nameText.x, nameText.y + 20, "Hola me llamo juan, como te llamas tu mi un dos jajaj, te amo tanto", bioTextStyle);
        bioText.setOrigin(0);
        this.add(bioText);

        this.createBlockButton(287, 17, 0.73);
    }

    createBlockButton(x, y, scale, blockFn) {
        let img = this.scene.add.image(x, y, 'block');
        img.setScale(scale);
        this.add(img);

        let hit = new HitListElementButton(this.scene, img, { R: 255, G: 255, B: 255 }, { R: 200, G: 200, B: 200 }, { R: 150, G: 150, B: 150 },
            () => {
                console.log("holaaa");
            });

        this.hits.push(hit);
    }

    getWidth() {
        return this.newFriendBg.displayWidth * this.scale;
    }
}