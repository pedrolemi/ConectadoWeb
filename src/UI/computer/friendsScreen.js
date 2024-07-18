import FriendRequest from './friendRequest.js'
import VerticalListView from '../verticalListView.js'
import GameManager from '../../managers/gameManager.js';

export default class FriendsScreen extends Phaser.GameObjects.Group {
    constructor(scene) {
        super(scene);

        const CANVAS_WIDTH = this.scene.sys.game.canvas.width;
        const CANVAS_HEIGHT = this.scene.sys.game.canvas.height;

        this.numFriends = 0;
        this.numFriendsRequests = 0;

        let gameManager = GameManager.getInstance();

        let friendsTextStyle = { ...gameManager.textConfig };
        friendsTextStyle.fontFamily = 'AUdimat-regular';
        friendsTextStyle.fontSize = '30px';
        friendsTextStyle.color = '#3558C1';
        let y = CANVAS_HEIGHT / 6;
        this.friendsText = this.scene.add.text(1.2 * CANVAS_WIDTH / 4, y, "", friendsTextStyle);
        this.friendsText.setOrigin(0, 0.5);
        this.setFriends();
        this.add(this.friendsText);

        let friendsRequestsStyle = friendsTextStyle;
        friendsRequestsStyle.color = '#FFA400'
        this.friendsRequestsText = this.scene.add.text(3 * CANVAS_WIDTH / 5, y, "", friendsRequestsStyle);
        this.friendsRequestsText.setOrigin(0, 0.5);
        this.setFriendsRequests();
        this.add(this.friendsText);

        let friendRequest = new FriendRequest(this.scene, 2.754 * CANVAS_WIDTH / 5, CANVAS_HEIGHT / 2, 1, 'alisonAvatar', "Alison");
        let friendRequestWidth = friendRequest.getWidth();
        console.log(friendRequestWidth);

        let listView = new VerticalListView(this.scene, 2.2 * CANVAS_WIDTH / 4, 1.2 * CANVAS_HEIGHT / 5, 1, 0, { width: friendRequestWidth, height: 300 });
        listView.addItem(friendRequest, friendRequest.hits);

        friendRequest = new FriendRequest(this.scene, 2.754 * CANVAS_WIDTH / 5, CANVAS_HEIGHT / 2, 1, 'alisonAvatar', "Alison");
        listView.addItem(friendRequest, friendRequest.hits);
        friendRequest = new FriendRequest(this.scene, 2.754 * CANVAS_WIDTH / 5, CANVAS_HEIGHT / 2, 1, 'alisonAvatar', "Alison");
        listView.addItem(friendRequest, friendRequest.hits);
        friendRequest = new FriendRequest(this.scene, 2.754 * CANVAS_WIDTH / 5, CANVAS_HEIGHT / 2, 1, 'alisonAvatar', "Alison");
        listView.addItem(friendRequest, friendRequest.hits);
        friendRequest = new FriendRequest(this.scene, 2.754 * CANVAS_WIDTH / 5, CANVAS_HEIGHT / 2, 1, 'alisonAvatar', "Alison");
        listView.addItem(friendRequest, friendRequest.hits);
        listView.cropItems();
        this.add(listView);
    }

    setFriends() {
        this.friendsText.setText("Amigos: " + this.numFriends);
    }

    setFriendsRequests() {
        this.friendsRequestsText.setText("Peticiones pendientes: " + this.numFriendsRequests);
    }
}