import GameManager from '../../managers/gameManager.js';
import ListViewButton from '../listView/listViewButton.js';
import VerticalListView from '../listView/verticalListView.js';
import MessageBox from '../messageBox.js'

export default class Post extends Phaser.GameObjects.Container {
    constructor(scene, x, y, scale, avatar, name, photo, description) {
        super(scene, x, y);

        this.scene.add.existing(this);

        let gameManager = GameManager.getInstance();

        this.setScale(scale);

        this.commentNode = null;
        let elements = [];

        // Imagen con el avatar de la persona
        let avatarIcon = this.scene.add.image(-150, 0, avatar);
        elements.push(avatarIcon);
        avatarIcon.setOrigin(0.5, 0).setScale(0.14);
        this.add(avatarIcon);

        // Nombre del usuario
        let nameTextStyle = { ...gameManager.textConfig };
        nameTextStyle.fontStyle = 'bold';
        nameTextStyle.fontSize = '25px';
        nameTextStyle.color = '#323232';
        let nameText = this.scene.add.text(avatarIcon.x + avatarIcon.displayWidth / 2 + 20, avatarIcon.y + avatarIcon.displayHeight / 2, name, nameTextStyle);
        nameText.setOrigin(0, 0.5);
        elements.push(nameText);
        this.add(nameText);

        let photoBg = this.scene.add.image(0, avatarIcon.y + avatarIcon.displayHeight + 10, 'photosBg');
        photoBg.setOrigin(0.5, 0).setScale(0.8);
        elements.push(photoBg);
        this.add(photoBg);

        let offset = 20;
        let photoPost = this.scene.add.image(photoBg.x - photoBg.displayWidth / 2 + offset, photoBg.y + offset, photo);
        photoPost.setOrigin(0).setScale(0.77);
        elements.push(photoPost);
        this.add(photoPost);

        let descripTextStyle = { ...gameManager.textConfig };
        descripTextStyle.fontFamily = 'AUdimat-regular';
        descripTextStyle.fontSize = '20px';
        descripTextStyle.color = '#323232';
        descripTextStyle.wordWrap = {
            width: photoPost.displayWidth,
            useAdvancedWrap: true
        }
        let descriptText = this.scene.add.text(photoPost.x, photoPost.y + photoPost.displayHeight + 10, description, descripTextStyle);
        elements.push(descriptText);
        this.add(descriptText);

        // Boton para comentar en el post
        offset = 10;
        this.commentButton = new ListViewButton(this.scene, photoBg.x + photoBg.displayWidth / 2 - offset, photoBg.y + offset, 0.65, () => {
            if (this.commentNode !== null) {
                gameManager.dialogManager.setNode(this.commentNode);
            }
        }, 'addComment', { x: 1, y: 1 }, { R: 255, G: 255, B: 255 }, { R: 200, G: 200, B: 200 }, { R: 150, G: 150, B: 150 });
        this.commentButton.x -= this.commentButton.w / 2;
        elements.push(this.commentButton);
        this.add(this.commentButton);

        this.chatWidth = 200;
        this.listView = new VerticalListView(this.scene, photoBg.x + photoBg.displayWidth / 2 + this.chatWidth / 2, photoBg.y, 1, 10,
            { width: this.chatWidth, height: photoBg.displayHeight }, { sprite: 'buttonBg', alpha: 0.5 });
        elements.push(this.listView);
        this.add(this.listView);

        let aux = photoBg.y - (avatarIcon.y + avatarIcon.displayHeight);
        this.h = (avatarIcon.displayHeight + photoBg.displayHeight + aux) * scale;
        this.w = (photoBg.displayWidth + this.chatWidth) * scale;

        let oldCenter = photoBg.displayWidth / 2;
        let newCenter = oldCenter - (photoBg.displayWidth + this.chatWidth) / 2;
        elements.forEach((element) => {
            element.x += newCenter;
        });

        this.commentButton.hit.resetToBoundingRect();
        this.listView.init();
    }

    addMessage(text, character, name) {
        let msg = new MessageBox(this.scene, text, character, name, 1, this.chatWidth);
        this.listView.addLastItem(msg);
    }

    setCommentNode(node) {
        this.commentNode = node;
    }

    destroy() {
        this.listView.destroy();
        this.commentButton.destroy();
        super.destroy();
    }

    setVisible(visible) {
        this.listView.setVisible(visible);
        this.commentButton.setVisible(visible);
        super.setVisible(visible);
    }
}