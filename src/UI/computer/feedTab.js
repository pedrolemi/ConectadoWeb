import Post from './post.js'
import VerticalListView from '../listView/verticalListView.js';

export default class FeedTab extends Phaser.GameObjects.Group {
    /**
     * Pestana donde aparecen los posts de los amigos del personaje
     * @param {SocialNetworkScreen} socialNetScreen - pantalla de la red social 
     */
    constructor(socialNetScreen) {
        super(socialNetScreen.scene);

        this.socialNetScreen = socialNetScreen;

        // Mensaje informativo que aparece arriba
        let infoTextStyle = { ...this.scene.gameManager.textConfig };
        infoTextStyle.fontFamily = 'AUdimat-regular';
        infoTextStyle.backgroundColor = 'rgba(66, 119, 142, 1)';
        infoTextStyle.padding = {
            left: 40,
            top: 7
        }
        this.infoTranslation = this.scene.i18next.t(this.socialNetScreen.screenName + ".informationText", { ns: this.scene.namespace });
        let infoText = this.scene.add.text(3.05 * this.scene.CANVAS_WIDTH / 5, this.scene.CANVAS_HEIGHT / 8,
            this.infoTranslation, infoTextStyle);
        infoText.setOrigin(0.5, 0);
        this.add(infoText);

        // Se crea un post que se va a destruir de inmediato para poder calcular el ancho de la listview
        let aux = new Post(this.scene, 0, 0, 1);
        this.listView = new VerticalListView(this.scene, 3 * this.scene.CANVAS_WIDTH / 5, 1.1 * this.scene.CANVAS_HEIGHT / 5, 1, 45,
            { width: aux.w, height: 467 });
        aux.destroy();
        this.add(this.listView);
    }

    /**
     * Se crea un post pero no se agrega al tablon
     * Se hace de esta manera porque el jugador solo va a poder ver los posts de los usuarios que sean sus amigos
     * Sin embargo, un usuario puede haber subido un post antes de que el jugador lo acepte como amigo y hasta que el
     * jugador no lo acepte como amigo no va a poder verlo
     * @param {String} character - personaje 
     * @param {String} photo - texto que acompana a la foto
     * @param {String} description - descripcion del personaje
     * @returns {Post}
     */
    createPost(character, photo, description) {
        // Obtener la info del personaje
        let avatar = character;
        if (character === "player") {
            avatar = this.scene.userInfo.gender;
        }
        let name = this.scene.i18next.t(character, { ns: "names" });

        let post = new Post(this.scene, 0, 0, 1, avatar, name, photo, description);
        post.setVisible(false);
        return post;
    }

    /**
     * Agregar un post creado a la listview
     * Se hace con los posts que habia guardados cuando se acepta una solicitud de amistad
     * y con los siguientes posts que llegan
     * @param {Post} post 
     */
    addPostToList(post) {
        post.setVisible(true);
        // Los posts se van anadiendo al principio
        this.listView.addFirstItem(post, [post.commentButton.hit], [post.listView]);
    }

    /**
     * Eliminar un post
     * @param {Post} post 
     */
    erasePost(post) {
        this.listView.removeItem(post);
    }

    setVisible(visible) {
        super.setVisible(visible);
        // Nota: hay que sobrescribir el metodo para poder cambiar la visibilidad de la listview correctamente
        this.listView.setVisible(visible);
    }
}