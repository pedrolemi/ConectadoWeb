import FriendRequest from './friendRequest.js'
import VerticalListView from '../listView/verticalListView.js'

export default class FriendsTab extends Phaser.GameObjects.Group {
    /**
     * Pestana donde aparecen las peticiones de amistad de la red social
     * @param {SocialNetworkScreen} socialNetScreen - pantalla de la red social 
     */
    constructor(socialNetScreen) {
        super(socialNetScreen.scene);

        // Pantalla de la red social
        this.socialNetScreen = socialNetScreen;
        // Numero de amigos
        this.nFriends = 0;
        // Numero de peticiones de amistad sin revisar
        this.nFriendRequests = 0;
        this.friendsSet = new Set();

        // Texto con el numero de amigos
        let friendsTextStyle = { ...this.scene.gameManager.textConfig };
        friendsTextStyle.fontFamily = 'AUdimat-regular';
        friendsTextStyle.fontSize = '30px';
        friendsTextStyle.color = '#3558C1';
        let offsetY = this.scene.CANVAS_HEIGHT / 6;
        this.friendsText = this.scene.add.text(1.2 * this.scene.CANVAS_WIDTH / 4, offsetY, "", friendsTextStyle);
        // Se establece este origen para que a la hora de cambiar el valor, no se mueva todo el texto, solo el numero
        this.friendsText.setOrigin(0, 0.5);
        this.setFriends();
        this.add(this.friendsText);

        // Texto con el numero de peticiones de amistad pendientes
        let friendReqTextStyle = friendsTextStyle;
        friendReqTextStyle.color = '#FFA400'
        this.friendRequestsText = this.scene.add.text(3 * this.scene.CANVAS_WIDTH / 5, offsetY, "", friendReqTextStyle);
        // Se establece este origen para que a la hora de cambiar el valor, no se mueva todo el texto, solo el numero
        this.friendRequestsText.setOrigin(0, 0.5);
        this.setFriendRequests();
        this.add(this.friendRequestsText);

        // Se crea una para poder calcular el ancho del listview
        let aux = new FriendRequest(this.scene, 0, 0, 1, "AlisonAvatar");
        this.listView = new VerticalListView(this.scene, 2.2 * this.scene.CANVAS_WIDTH / 4, 1.1 * this.scene.CANVAS_HEIGHT / 5, 1, 0, { width: aux.w, height: 467 }, null, false);
        this.listView.init();
        aux.destroy();

        this.blockNot = this.createBlockNotification(3 * this.scene.CANVAS_WIDTH / 5, 1.8 * this.scene.CANVAS_HEIGHT / 4, 25);
    }

    createBlockNotification(x, y, fontSize) {
        let textStyle = { ...this.scene.gameManager.textConfig };
        textStyle.fontFamily = 'AUdimat-regular';
        textStyle.fontStyle = 'bold';
        textStyle.fontSize = fontSize + 'px';
        textStyle.backgroundColor = 'rgba(255, 0, 0, 0.85)';
        textStyle.padding = {
            left: 20,
            top: 35
        }
        let text = this.scene.add.text(x, y, "¡NO ESTÁ PERMITIDO BLOQUEAR USUARIOS!", textStyle);
        text.setScale(0).setOrigin(0.5);

        this.add(text);

        this.blockNotTween = null;

        return text;
    }

    setFriends() {
        this.friendsText.setText("Amigos: " + this.nFriends);
    }

    increaseFriends() {
        ++this.nFriends;
        this.setFriends();
    }

    setFriendRequests() {
        this.friendRequestsText.setText("Peticiones pendientes: " + this.nFriendRequests);
    }

    increaseFriendRequests() {
        ++this.nFriendRequests;
        this.setFriendRequests();
        this.socialNetScreen.changeFriendRequestNotState();
    }

    decreaseFriendRequests() {
        --this.nFriendRequests;
        this.setFriendRequests();
        this.socialNetScreen.changeFriendRequestNotState();
    }

    emptyFriendRequests() {
        return this.nFriendRequests <= 0;
    }

    start() {
        this.setVisible(true);
        this.friendsSet.forEach((friend) => {
            friend.changeState();
        });
    }

    setVisible(visible) {
        super.setVisible(visible);
        this.listView.setVisible(visible);
    }

    addFriendRequest(character, avatar, name, bio) {
        let friendRequest = new FriendRequest(this.scene, 0, 0, 1, avatar, name, bio,
            () => {
                console.log("cancelado");
                this.socialNetScreen.eraseFriend(character);
                this.declineFriendRequest(friendRequest);
            },
            () => {
                console.log("aceptado");
                this.socialNetScreen.addPendingPost(character);
                this.decreaseFriendRequests();
                this.increaseFriends();
            },
            () => {
                if (!this.blockNotTween) {
                    console.log("bloqueado");
                    this.blockNotTween = this.scene.tweens.add({
                        targets: this.blockNot,
                        scale: 1,
                        yoyo: true,
                        duration: 200,
                        hold: 1500,      // tiempo que se pausa el tween hasta que se realiza el yoyo
                        repeat: 0,
                    });
                    this.blockNotTween.on('complete', () => {
                        this.blockNotTween = null;
                    });
                }
            });
        this.listView.addLastItem(friendRequest, friendRequest.getHits());

        this.friendsSet.add(friendRequest);

        // aumentar el numero de peticiones
        this.increaseFriendRequests();

        return friendRequest;
    }

    declineFriendRequest(friendRequest) {
        if (this.friendsSet.has(friendRequest)) {
            this.listView.removeItem(friendRequest);
            this.listView.cropItems();

            this.friendsSet.delete(friendRequest);

            // disminuye el numero de peticiones
            this.decreaseFriendRequests();
        }
    }
}