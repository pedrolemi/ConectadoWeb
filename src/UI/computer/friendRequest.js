import ListViewButton from '../listView/listViewButton.js';
import GameManager from '../../managers/gameManager.js';

export default class FriendRequest extends Phaser.GameObjects.Container {
    /**
     * Panel con la solicitud de amistad de un personaje
     * Esta pensando para ser un item de una listview
     * @param {Phaser.scene} scene - escena
     * @param {Number} x - posicion x (si se usa como item de una listview, no se va a usar)
     * @param {Number} y - posicion y (si se usa como item de una listview, no se va a usar)
     * @param {Number} scale - escala
     * @param {String} avatar - icono del personaje
     * @param {String} name - nombre del personaje
     * @param {String} bio - texto que aparece cuando se acepta la solicitud de amistad
     * @param {Function} defaultRefuseFn - funcion que se reproduce al denegar la solicitud si no hay un nodo seleccionado
     * @param {Function} acceptFn - funcion que se reproduce al aceptar la solicitud 
     * @param {Function} blockFn - funcion que se reproduce al tratar de bloquear una solicitud aceptada
     */
    constructor(scene, x, y, scale, avatar, name, bio, defaultRefuseFn, acceptFn, blockFn) {
        super(scene, x, y);

        this.scene.add.existing(this);

        // Indica si la solicitud ha sido aceptada o no
        this.isAccepted = false;
        // Nodo que reproduce el dialogmanager al tratar de rechazar la solicitud de amistad
        // Si no hay ninguno seleccionado, se ejecuta la funcion refuseFn
        this.refuseNode = null;

        let gameManager = GameManager.getInstance();

        this.setScale(scale);

        // Botones cuyas areas de colision son listViewHit
        this.hitButtons = [];

        // Fondos
        let bgScale = {
            x: 1.1,
            y: 0.8
        }
        // Fondo cuando se recibe la solicitud
        this.newFriendBg = this.scene.add.image(0, 0, 'computerElements', 'newFriendBg');
        this.newFriendBg.setScale(bgScale.x, bgScale.y).setOrigin(0.5, 0);
        this.add(this.newFriendBg);

        // Tams del container
        this.w = this.newFriendBg.displayWidth * scale;     // se usa para calcular el ancho de la listivew
        this.h = this.newFriendBg.displayHeight * scale;    // se usa para colocar los items

        // Fondo cuando se acepta la solicitud
        this.oldFriendBg = this.scene.add.image(0, 0, 'computerElements', 'oldFriendBg');
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
        let avatarIcon = this.scene.add.image(avatarTrans.x, avatarTrans.y, 'avatars', avatar);
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
        let blockButtonTrans = {
            x: 287,
            y: 17,
            scale: 0.73
        }
        this.blockButton = new ListViewButton(this.scene, blockButtonTrans.x, blockButtonTrans.y, blockButtonTrans.scale, () => {
            blockFn();
        }, { atlas: 'computerElements', frame: 'block' }, { x: 1, y: 1 }, { R: 255, G: 255, B: 255 }, { R: 200, G: 200, B: 200 }, { R: 150, G: 150, B: 150 });
        this.blockButton.setVisible(false);
        this.addListViewButton(this.blockButton);

        let size = 1.2;
        let fontSize = 24;
        let buttonsTranslations = gameManager.i18next.t('friendRequestButtons', { ns: "computerInfo", returnObjects: true });
        // Boton para aceptar la peticion de amistad
        this.acceptButton = new ListViewButton(this.scene, 208, 97, size, () => {
            this.setOldFriendRequest(true);
            acceptFn();
        }, { atlas: 'computerElements', frame: 'buttonAcceptBg' }, { x: 1, y: 1 }, { R: 255, G: 255, B: 255 }, { R: 235, G: 235, B: 235 }, { R: 200, G: 200, B: 200 },
            buttonsTranslations.acceptText, { font: 'AUdimat-regular', size: fontSize, style: 'normal', color: '#ffffff' });
        this.addListViewButton(this.acceptButton);

        // Boton para aceptar la peticion de amistad
        this.refuseButton = new ListViewButton(this.scene, this.acceptButton.x - this.acceptButton.w, this.acceptButton.y, size, () => {
            if (this.refuseNode !== null) {
                gameManager.UIManager.dialogManager.setNode(this.refuseNode);
            }
            else {
                defaultRefuseFn();
            }
        }, { atlas: 'computerElements', frame: 'buttonBg' }, { x: 2, y: 0.38 }, { R: 255, G: 255, B: 255 }, { R: 235, G: 235, B: 235 }, { R: 200, G: 200, B: 200 },
            buttonsTranslations.denyText, { font: 'AUdimat-regular', size: fontSize, style: 'normal', color: '#42778E' });
        this.addListViewButton(this.refuseButton);
    }

    /**
     * Establecer si la solicitud esta aceptada o pendiente de revisar
     * @param {Boolean} enable - true si esta aceptada, false en caso contrario  
     */
    setOldFriendRequest(enable) {
        this.newFriendBg.setVisible(!enable);
        this.oldFriendBg.setVisible(enable);
        this.bioText.setVisible(enable);
        this.blockButton.setVisible(enable);
        this.acceptButton.setVisible(!enable);
        this.refuseButton.setVisible(!enable);
        this.isAccepted = enable;
    }

    /**
     * Aplicar el estado a la solicitud que verdaderamente tiene
     * Nota: se necesita este metodo porque cada vez que se accede a la red social
     * la pantalla de solicitudes se hace visible complemetamente. Entonces, se muestran 
     * todos los elementos y no solos los que corresponden con su estado
     */
    applyState() {
        this.setOldFriendRequest(this.isAccepted);
    }

    /**
     * Establecer el nodo que se reproduce cuando se rechaza la solicitud
     * Si no hay ningun nodo, se ejecuta la funcion por defecto
     */
    setRefuseNode(node) {
        this.refuseNode = node
    }

    /**
     * Agregar el boton a la estructuras de datos pertienentes
     * @param {ListViewButton} button 
     */
    addListViewButton(button) {
        this.add(button);
        this.hitButtons.push(button);
        // El boton se agrega a un contenedor luego de crearse, por lo tanto,
        // su pos global cambia
        // Hay que llamar al siguiente metodo para que el collider vuelva a coincidr
        // con la imagen del boton
        button.hit.resetToBoundingRect();
    }

    /**
     * Obtener las listViewHits de este objeto
     */
    getHits() {
        let hits = [];
        this.hitButtons.forEach((button) => {
            hits.push(button.hit);
        });
        return hits;
    }

    /**
     * Destruir al objeto
     * Nota: se necesita sobrescribir este metodo para poder borrar tambien
     * las areas de colision, que pertenecen a la escena
     */
    destroy() {
        super.destroy();
        this.hitButtons.forEach((button) => {
            button.destroy();
        });
    }
}