import Post from './post.js'
import VerticalListView from '../listView/verticalListView.js';

export default class FeedTab extends Phaser.GameObjects.Group {
    /**
     * Pestana donde aparecen los posts de los amigos del personaje
     * @param {SocialNetworkScreen} socialNetScreen - pantalla de la red social 
     */
    constructor(socialNetScreen) {
        super(socialNetScreen.scene);

        // Mensaje informativo que aparece arriba
        let infoTextStyle = { ...this.scene.gameManager.textConfig };
        infoTextStyle.fontFamily = 'AUdimat-regular';
        infoTextStyle.backgroundColor = 'rgba(66, 119, 142, 1)';
        infoTextStyle.padding = {
            left: 40,
            top: 7
        }
        let infoText = this.scene.add.text(3.05 * this.scene.CANVAS_WIDTH / 5, this.scene.CANVAS_HEIGHT / 8,
            "Este es tu tablón, mira lo que tus amigos han compartido", infoTextStyle);
        infoText.setOrigin(0.5, 0);
        this.add(infoText);

        let aux = new Post(this.scene, 0, 0, 1, "AlisonAvatar", "", "photoMatch");
        this.listView = new VerticalListView(this.scene, 3 * this.scene.CANVAS_WIDTH / 5, 1.1 * this.scene.CANVAS_HEIGHT / 5, 1, 45,
            { width: aux.w, height: 467 });
        aux.destroy();
        this.add(this.listView);
    }

    setVisible(visible) {
        super.setVisible(visible);
        this.listView.setVisible(visible);
    }

    createPost(avatar, name, photo, description) {
        let post = new Post(this.scene, 0, 0, 1, avatar, name, photo, description);
        post.setVisible(false);
        return post;
    }

    addPostToFeed(post) {
        post.setVisible(true);
        this.listView.addFirstItem(post, [post.commentButton.hit], [post.listView]);
    }
}