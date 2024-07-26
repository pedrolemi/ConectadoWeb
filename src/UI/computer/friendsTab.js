import FriendRequest from './friendRequest.js'
import VerticalListView from '../listView/verticalListView.js'

export default class FriendsTab extends Phaser.GameObjects.Group {
    /**
     * Pestana donde aparecen las peticiones de amistad de la red social
     * @param {SocialNetworkScreen} socialNetScreen - pantalal de la red social
     */
    constructor(socialNetScreen) {
        super(socialNetScreen.scene);

        // Pantalla de la red social
        this.socialNetScreen = socialNetScreen;

        // Numero de amigos
        this.nFriends = 0;
        this.nFriendsTranslation = this.scene.i18next.t(this.socialNetScreen.screenName + ".friendsNumberText", { ns: this.scene.namespace });
        // Numero de peticiones de amistad sin revisar
        this.nPendingRequests = 0;
        this.nPendingRequestsTranslation = this.scene.i18next.t(this.socialNetScreen.screenName + ".pendingRequestsText", { ns: this.scene.namespace });

        // Peticiones de amistad existentes (todas menos las eliminadas)
        // Se usa para actualizar el estado de las peticiones facilmente
        this.existingRequests = new Set();

        // Texto con el numero de amigos
        let friendsTextStyle = { ...this.scene.gameManager.textConfig };
        friendsTextStyle.fontFamily = 'AUdimat-regular';
        friendsTextStyle.fontSize = '30px';
        friendsTextStyle.color = '#3558C1';
        let offsetY = this.scene.CANVAS_HEIGHT / 6;
        this.friendsText = this.scene.add.text(1.2 * this.scene.CANVAS_WIDTH / 4, offsetY, "", friendsTextStyle);
        // Se establece este origen para que a la hora de cambiar el valor, no se mueva todo el texto, solo el numero
        this.friendsText.setOrigin(0, 0.5);
        // Se actualiza el valor
        this.setFriends();
        this.add(this.friendsText);

        // Texto con el numero de peticiones de amistad pendientes
        let friendReqTextStyle = friendsTextStyle;
        friendReqTextStyle.color = '#FFA400'
        this.friendRequestsText = this.scene.add.text(3 * this.scene.CANVAS_WIDTH / 5, offsetY, "", friendReqTextStyle);
        // Se establece este origen para que a la hora de cambiar el valor, no se mueva todo el texto, solo el numero
        this.friendRequestsText.setOrigin(0, 0.5);
        // Se actualiza el valor
        this.setFriendRequests();
        this.add(this.friendRequestsText);

        // Se crea una peticion de amistad que se va a destruir de inmediato para poder calcular el ancho de la listview
        let aux = new FriendRequest(this.scene, 0, 0, 1);
        // IMPORTANTE: NO SE PUEDE ACTIVAR EL CULLING PORQUE COMO HAY COLLIDERS QUE EN CIERTO MOMENTO SE VAN A DEJAR DE MOSTRAR PARA SIEMPRE,
        // SI EL CULLING ESTUVIERA ACTIVADO LOS VOLVERIA A HACER VISIBLES
        this.listView = new VerticalListView(this.scene, 2.2 * this.scene.CANVAS_WIDTH / 4, 1.1 * this.scene.CANVAS_HEIGHT / 5, 1, 0, { width: aux.w, height: 467 }, null, false);
        this.add(this.listView);
        this.listView.init();
        aux.destroy();

        // Se crea la notificacion que aparece si se trata de bloquear una solicitud de amistad aceptada
        this.blockNot = this.createBlockNotification(3 * this.scene.CANVAS_WIDTH / 5, 1.8 * this.scene.CANVAS_HEIGHT / 4, 25);
    }

    /**
     * Texto con animacion que aparece para informar que no se puede bloquear a un amigo
     */
    createBlockNotification(x, y, fontSize) {
        // Indicar si la animacion ha acabado o no
        this.blockNotTween = null;

        let textStyle = { ...this.scene.gameManager.textConfig };
        textStyle.fontFamily = 'AUdimat-regular';
        textStyle.fontStyle = 'bold';
        textStyle.fontSize = fontSize + 'px';
        textStyle.backgroundColor = 'rgba(255, 0, 0, 0.85)';
        textStyle.padding = {
            left: 20,
            top: 35
        }
        let textTranslation = this.scene.i18next.t(this.socialNetScreen.screenName + ".blockNot", { ns: this.scene.namespace });
        let text = this.scene.add.text(x, y, textTranslation, textStyle);
        text.setScale(0).setOrigin(0.5);

        this.add(text);

        return text;
    }

    /**
     * Actualizar el texto con el numero de amigos
     */
    setFriends() {
        this.friendsText.setText(this.nFriendsTranslation + ": " + this.nFriends);
    }

    /**
     * Aumentar el numero de amigos
     */
    increaseFriends() {
        ++this.nFriends;
        this.setFriends();
    }

    /**
     * Actualizar el texto con el numero de peticiones sin revisar
     */
    setFriendRequests() {
        this.friendRequestsText.setText(this.nPendingRequestsTranslation + ": " + this.nPendingRequests);
    }

    /**
     * Aumentar le numero de peticiones sin revisar
     */
    increaseFriendRequests() {
        ++this.nPendingRequests;
        this.setFriendRequests();
        this.socialNetScreen.changeFriendRequestNotState();
    }

    /**
     * Disminuir el numero de peticiones sin revisar
     */
    decreaseFriendRequests() {
        --this.nPendingRequests;
        this.setFriendRequests();
        this.socialNetScreen.changeFriendRequestNotState();
    }

    /**
     * Comprobar si quedan solicitud de amistad pendientes de revisar
     * (para mostrar la notificacion)
     */
    emptyPendingRequests() {
        return this.nPendingRequests <= 0;
    }

    /**
     * Agregar una peticiones de amistad
     * @param {String} character - personaje 
     * @returns {FriendRequest}
     */
    addFriendRequest(character) {
        // Obtener la info del personaje
        let avatar = character;
        let name = this.scene.i18next.t(character, { ns: "names" });
        let bio = this.scene.i18next.t("bio." + character, { ns: this.scene.namespace });

        let friendRequest = new FriendRequest(this.scene, 0, 0, 1, avatar, name, bio,
            // Rechazar
            () => {
                this.socialNetScreen.eraseFriend(character);
                this.refuseFriendRequest(friendRequest);
            },
            // Aceptar
            () => {
                // Cuando se acepta la solicitud, todos los posts pendientes aparecen en el tablon
                this.socialNetScreen.addPendingPosts(character);
                // Se actualiza la UI
                this.decreaseFriendRequests();
                this.increaseFriends();
            },
            // Bloquear
            () => {
                // Se muestra un mensaje indicando que no esta permitido bloquear
                // Solo se muestra si el tween no se esta ya mostrando
                if (!this.blockNotTween) {
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

        // Se agrega la peticion de amistad tanto a la listview como a la lista de peticiones
        this.listView.addLastItem(friendRequest, friendRequest.getHits());
        this.existingRequests.add(friendRequest);

        // Aumenta el numero de peticiones
        this.increaseFriendRequests();

        return friendRequest;
    }

    /**
     * Eliminar una peticion de amistad
     * @param {FriendRequest} friendRequest 
     */
    refuseFriendRequest(friendRequest) {
        if (this.existingRequests.has(friendRequest)) {
            // Se elimina de la listivew
            this.listView.removeItem(friendRequest);

            this.existingRequests.delete(friendRequest);

            // Se disminuye el numero de peticiones
            this.decreaseFriendRequests();
        }
    }

    start() {
        // Se hace completamente visible
        this.setVisible(true);
        // Las peticiones de amistad tienen que mostrar el estado actual
        this.existingRequests.forEach((friend) => {
            friend.applyState();
        });
    }

    setVisible(visible) {
        super.setVisible(visible);
        // Nota: hay que sobrescribir el metodo para poder cambiar la visibilidad de la listview correctamente
        this.listView.setVisible(visible);
    }
}