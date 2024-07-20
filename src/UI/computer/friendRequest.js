import ListViewButton from '../listView/listViewButton.js';
import GameManager from '../../managers/gameManager.js';

export default class FriendRequest extends Phaser.GameObjects.Container {
    constructor(scene, x, y, scale, avatar, name, bio, refuseFn, acceptFn, blockFn) {
        super(scene, x, y);

        this.scene.add.existing(this);

        this.isAccepted = false;

        let gameManager = GameManager.getInstance();

        this.setScale(scale);

        this.hitButtons = [];

        // Fondos
        let bgScale = {
            x: 1.1,
            y: 0.8
        }
        // Fondo cuando se recibe la solicitud
        this.newFriendBg = this.scene.add.image(0, 0, 'newFriendBg');
        this.newFriendBg.setScale(bgScale.x, bgScale.y).setOrigin(0.5, 0);
        this.add(this.newFriendBg);

        this.w = this.newFriendBg.displayWidth * scale;
        this.h = this.newFriendBg.displayHeight * scale;

        // Fondo cuando se acepta la solicitud
        this.oldFriendBg = this.scene.add.image(0, 0, 'oldFriendBg');
        this.oldFriendBg.setScale(bgScale.x, bgScale.y).setOrigin(0.5, 0);
        this.oldFriendBg.setVisible(false);
        this.add(this.oldFriendBg);

        // Nombre del usuario
        let nameTextPos = {
            x: -185,
            y: 47
        }
        let nameTextStyle = { ...gameManager.textConfig };
        nameTextStyle.fontFamily = 'AUdimat-regular';
        nameTextStyle.fontSize = '37px';
        nameTextStyle.color = '#323232';
        let nameText = this.scene.add.text(nameTextPos.x, nameTextPos.y, name, nameTextStyle);
        nameText.setOrigin(0, 0.5);
        this.add(nameText);

        // Imagen con el avatar de la persona
        let avatarTrans = {
            x: -257,
            y: 75,
            scale: 0.265
        }
        let avatarIcon = this.scene.add.image(avatarTrans.x, avatarTrans.y, avatar);
        avatarIcon.setScale(avatarTrans.scale);
        this.add(avatarIcon);

        // Descripcion del usuario
        let bioTextStyle = { ...gameManager.textConfig };
        bioTextStyle.fontFamily = 'AUdimat-regular';
        bioTextStyle.fontSize = '23px';
        bioTextStyle.color = '#323232';
        bioTextStyle.align = 'justify';
        bioTextStyle.wordWrap = {
            width: this.newFriendBg.displayWidth - avatarIcon.displayWidth / 2,
            useAdvancedWrap: true
        }
        this.bioText = this.scene.add.text(nameText.x, nameText.y + 23, bio, bioTextStyle);
        this.bioText.setVisible(false);
        this.bioText.setOrigin(0);
        this.add(this.bioText);

        // Boton para bloquear al usuario
        // (no se permite esta accion y se va a mostrar un mensaje en pantalla para informar de ello)
        let blockButtonTrans = {
            x: 287,
            y: 17,
            scale: 0.73
        }
        this.blockButton = new ListViewButton(this.scene, blockButtonTrans.x, blockButtonTrans.y, blockButtonTrans.scale, () => {
            blockFn();
        }, 'block', { x: 1, y: 1 }, { R: 255, G: 255, B: 255 }, { R: 200, G: 200, B: 200 }, { R: 150, G: 150, B: 150 });
        this.blockButton.setVisible(false);
        this.addListViewButton(this.blockButton);

        let size = 1.2;
        let fontSize = 24;
        // Boton para aceptar la peticion de amistad
        this.acceptButton = new ListViewButton(this.scene, 208, 97, size, () => {
            this.isAccepted = true;
            this.changeState();
            acceptFn();
        }, 'buttonAcceptBg', { x: 1, y: 1 }, { R: 255, G: 255, B: 255 }, { R: 235, G: 235, B: 235 }, { R: 200, G: 200, B: 200 },
            "Aceptar solicitud", { font: 'AUdimat-regular', size: fontSize, style: 'normal', color: '#ffffff' });
        this.addListViewButton(this.acceptButton);

        // Boton para aceptar la peticion de amistad
        this.refuseButton = new ListViewButton(this.scene, this.acceptButton.x - this.acceptButton.w, this.acceptButton.y, size, () => {
            refuseFn();
        }, 'buttonBg', { x: 2, y: 0.38 }, { R: 255, G: 255, B: 255 }, { R: 235, G: 235, B: 235 }, { R: 200, G: 200, B: 200 },
            "Denegar solicitud", { font: 'AUdimat-regular', size: fontSize, style: 'normal', color: '#42778E' });
        this.addListViewButton(this.refuseButton);
    }

    changeStateAux(enable) {
        this.newFriendBg.setVisible(!enable);
        this.oldFriendBg.setVisible(enable);
        this.bioText.setVisible(enable);
        this.blockButton.setVisible(enable);
        this.acceptButton.setVisible(!enable);
        this.refuseButton.setVisible(!enable);
    }

    changeState() {
        this.changeStateAux(this.isAccepted);
    }

    addListViewButton(button) {
        this.add(button);
        this.hitButtons.push(button);
        // Como el boton luego de crearse se mete en el container cambia su pos
        // Hay que resetear el collider para que vuelva a coincidir con el boton
        button.hit.resetToBoundingRect();
    }

    getHits() {
        let hits = [];
        this.hitButtons.forEach((button) => {
            hits.push(button.hit);
        });
    }

    destroy() {
        this.hitButtons.forEach((button) => {
            button.destroy();
        });
        super.destroy();
    }
}