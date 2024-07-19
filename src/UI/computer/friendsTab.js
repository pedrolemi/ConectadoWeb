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

        let friendReqTextStyle = friendsTextStyle;
        friendReqTextStyle.color = '#FFA400'
        this.friendRequestsText = this.scene.add.text(3 * this.scene.CANVAS_WIDTH / 5, offsetY, "", friendReqTextStyle);
        // Se establece este origen para que a la hora de cambiar el valor, no se mueva todo el texto, solo el numero
        this.friendRequestsText.setOrigin(0, 0.5);
        this.setFriendRequests();
        this.add(this.friendRequestsText);

        // Se crea una para poder calcular el ancho del listview
        let aux = new FriendRequest(this.scene, 0, 0, 1);
        this.listView = new VerticalListView(this.scene, 2.2 * this.scene.CANVAS_WIDTH / 4, 1.2 * this.scene.CANVAS_HEIGHT / 5, 1, 0, { width: aux.w, height: 350 }, null, false);
        aux.destroy();
    }

    test() {
        this.addFriendRequest("Maria", "Hola me llamo maria");
        this.addFriendRequest("Alison", "Hola me llamo maria");
        this.addFriendRequest("Alex", "Hola me llamo maria");
        this.addFriendRequest("Guille", "Hola me llamo maria");
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

    addFriendRequest(character, bio) {
        let friendRequest = new FriendRequest(this.scene, 0, 0, 1, character, bio,
            () => {
                console.log("cancelado");
                this.declineFriendRequest(friendRequest);
            },
            () => {
                console.log("aceptado");
                this.decreaseFriendRequests();
                this.increaseFriends();
            },
            () => {
                console.log("bloqueado");
            });
        this.listView.addLastItem(friendRequest, friendRequest.hits);
        this.listView.cropItems();

        this.friendsSet.add(friendRequest);

        // aumentar el numero de peticiones
        this.increaseFriendRequests();
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