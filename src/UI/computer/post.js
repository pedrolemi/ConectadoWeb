import GameManager from '../../managers/gameManager.js';
import ListViewButton from '../listView/listViewButton.js';
import VerticalListView from '../listView/verticalListView.js';
import MessageBox from '../messageBox.js'

export default class Post extends Phaser.GameObjects.Container {
    /**
     * Post que ha subido un personaje
     * Esta pensando para ser un item de una listview
     * @param {Phaser.scene} scene 
     * @param {Number} x - posicion x (si se agrega a una listview, no sirve para nada)
     * @param {Number} y - posicion y (si se agrega a una listview, no sirve para nada)
     * @param {Number} scale - escala
     * @param {String} avatar - icono del personaje
     * @param {String} name - nombre del personaje
     * @param {String} photo - foto que sube el personaje
     * @param {String} description - descripcion que aparece al lado de la foto
     */
    constructor(scene, x, y, scale, avatar, name, photo, description) {
        super(scene, x, y);

        this.scene.add.existing(this);

        let gameManager = GameManager.getInstance();

        this.setScale(scale);

        // Nodo del dialogo que reproduce el dialogmanager al clicar en el boton para responder al post
        this.commentNode = null;

        // Se almacenan todos los elementos para luego poder centrarlos
        let elements = [];

        // Numero de comentarios que hay
        this.nMessages = 0;

        // Imagen con el avatar del personaje
        let avatarIcon = this.scene.add.image(-150, 0, 'avatars', avatar);
        elements.push(avatarIcon);
        avatarIcon.setOrigin(0.5, 0).setScale(0.14);
        this.add(avatarIcon);

        // Nombre del personaje
        let nameTextStyle = { ...gameManager.textConfig };
        nameTextStyle.fontStyle = 'bold';
        nameTextStyle.fontSize = '25px';
        nameTextStyle.color = '#323232';
        let nameText = this.scene.add.text(avatarIcon.x + avatarIcon.displayWidth / 2 + 20, avatarIcon.y + avatarIcon.displayHeight / 2, name, nameTextStyle);
        nameText.setOrigin(0, 0.5);
        elements.push(nameText);
        this.add(nameText);

        // Background donde aparece la foto
        let photoBg = this.scene.add.image(0, avatarIcon.y + avatarIcon.displayHeight + 10, 'computerElements', 'photosBg');
        photoBg.setOrigin(0.5, 0).setScale(0.8);
        elements.push(photoBg);
        this.add(photoBg);

        // Foto
        let offset = 20;
        let photoPost = this.scene.add.image(photoBg.x - photoBg.displayWidth / 2 + offset, photoBg.y + offset, 'photos', photo);
        photoPost.setOrigin(0).setScale(0.77);
        elements.push(photoPost);
        this.add(photoPost);

        // Descripcion que aparece debajo de la foto
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
                gameManager.UIManager.dialogManager.setNode(this.commentNode);
            }
        }, { atlas: 'computerElements', frame: 'addComment' }, { x: 1, y: 1 }, { R: 255, G: 255, B: 255 }, { R: 200, G: 200, B: 200 }, { R: 150, G: 150, B: 150 });
        this.commentButton.x -= this.commentButton.w / 2;
        elements.push(this.commentButton);
        this.add(this.commentButton);

        // Listview con los comentarios, que aparece a la derecha de la foto
        this.chatWidth = 200;
        this.listView = new VerticalListView(this.scene, photoBg.x + photoBg.displayWidth / 2 + this.chatWidth / 2, photoBg.y, 1, 10,
            { width: this.chatWidth, height: photoBg.displayHeight }, { atlas: 'computerElements', sprite: 'buttonBg', alpha: 0.5 });
        elements.push(this.listView);
        this.add(this.listView);

        // Texto con el numero de comentarios
        let nMessagesTextStyle = { ...gameManager.textConfig };
        nMessagesTextStyle.fontFamily = 'AUdimat-regular';
        nMessagesTextStyle.fontSize = '23px';
        nMessagesTextStyle.color = '#323232';
        this.nMessagesTranslation = gameManager.i18next.t("commentsNumberText", { ns: "computer" });
        this.nMessagesText = this.scene.add.text(this.listView.x, this.listView.y - 25, "", nMessagesTextStyle);
        this.nMessagesText.setOrigin(0.5);
        this.setMessagesNum();
        elements.push(this.nMessagesText);
        this.add(this.nMessagesText);

        // Tams del container
        this.w = (photoBg.displayWidth + this.chatWidth) * scale;                   // se usa para el ancho de la listivew
        let aux = photoBg.y - (avatarIcon.y + avatarIcon.displayHeight);
        this.h = (avatarIcon.displayHeight + photoBg.displayHeight + aux) * scale;  // se usa para colocar los items en la listview correctamente

        // Se reajustan todos los elementos del container para que este centrado
        // Posicion del centro actual --> el 0,y esta en el medio de la imagen del fondo
        let oldCenter = photoBg.displayWidth / 2;
        // Posicion del nuevo centro --> tiene que estar ubicado en el medio del ancho
        let newCenter = (photoBg.displayWidth + this.chatWidth) / 2;
        // Se calcula la diferencia (lo que tienen que moverse los elementos para colocarse en el nuevo centro)
        let diff = oldCenter - newCenter;
        elements.forEach((element) => {
            // Se recoloca cada elemento
            element.x += diff;
        });

        // Se reajusta el collider para que se coloque en la nueva pos del boton
        this.commentButton.hit.resetToBoundingRect();
        // Se inicializa la listview para que todas sus areas se ajusten a la nueva pos
        // Nota: las nuevas pos son las de meterlos en el container
        this.listView.init();
    }

    /**
     * Anadir un mensaje
     * @param {String} text 
     * @param {String} character 
     * @param {String} name 
     */
    addMessage(text, character, name) {
        let msg = new MessageBox(this.scene, text, character, name, 1, this.chatWidth);
        this.increaseMessagesNum();
        // Se anade al final
        this.listView.addLastItem(msg);
    }

    setCommentNode(node) {
        this.commentNode = node;
    }

    increaseMessagesNum() {
        ++this.nMessages;
        this.setMessagesNum();
    }

    setMessagesNum() {
        this.nMessagesText.setText(this.nMessages + " " + this.nMessagesTranslation);
    }

    setVisible(visible) {
        super.setVisible(visible);
        this.listView.setVisible(visible);
        this.commentButton.setVisible(visible);
    }

    destroy() {
        super.destroy();
        this.listView.destroy();
        this.commentButton.destroy();
    }
}