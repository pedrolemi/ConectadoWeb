import FriendsTab from './friendsTab.js'
import FeedTab from './feedTab.js'
import Post from './post.js';

export default class SocialNetworkScreen extends Phaser.GameObjects.Group {
    /**
     * Pantalla de la red social, donde consultar los amigos y sus posts
     * @param {Phaser.scene} computerScene - escena del ordenador
     * @extends Phaser.GameObjects.Group 
     */
    constructor(computerScene) {
        super(computerScene);

        // Nodo del dialog manager que se reproduce cuando se clica en el boton de subir una publicacion
        this.ownPostNode = null;

        // Archivo json con los posts de cada persona
        this.posts = this.scene.cache.json.get('posts');

        // Administrar todo lo relacionado con los amigos
        // Solicitud de amistad, posts que van a aparecer si se acepta la solicitud...
        this.friends = new Map();

        this.screenName = 'socialNetScreen';

        let dialogManager = this.scene.gameManager.UIManager.dialogManager;

        // Fondo de login del ordenador
        let mainViewBg = this.scene.add.image(0.23 * this.scene.CANVAS_WIDTH / 5, 4.1 * this.scene.CANVAS_HEIGHT / 5, 'computerMainView');
        mainViewBg.setOrigin(0, 1).setScale(0.61);
        mainViewBg.displayWidth += 20;
        this.add(mainViewBg);

        // Pestana donde aparecen los posts
        this.feedTab = new FeedTab(this);
        this.add(this.feedTab);
        // Pestana donde aparecen los amigos
        this.friendsTab = new FriendsTab(this);
        this.add(this.friendsTab);

        // Botones para intercalar entre las diferentes pestanas
        let tabTrans = {
            x: 1.07 * this.scene.CANVAS_WIDTH / 7,
            y: 1.75 * this.scene.CANVAS_HEIGHT / 4,
            scale: 0.9
        }
        let tabTextsTranslation = this.scene.i18next.t(this.screenName + ".tabTexts", { ns: this.scene.namespace, returnObjects: true });
        // Amigos
        let tab = this.createTab(tabTrans.x, tabTrans.y, tabTrans.scale, 'bubbleIcon', tabTextsTranslation.feed, () => {
            this.accessFeedTab();
        });

        // Posts
        tab = this.createTab(tabTrans.x, tab.y + tab.h, tabTrans.scale, 'friendsIcon', tabTextsTranslation.friends, () => {
            this.accessFriendsTab();
        });
        // Subir una foto
        // Nota: durante todo el juego no se puede subir ninguna foto. Al clicar este boton solo aparece un dialogo
        this.createTab(tabTrans.x, tab.y + tab.h, tabTrans.scale, 'photosIcon', tabTextsTranslation.upload, () => {
            // Nodo con el dialogo
            if (this.ownPostNode) {
                dialogManager.setNode(this.ownPostNode);
            }
        });

        // Crer la foto de perfil junto con el nombe de usuario del personaje
        this.createProfilePhoto(tabTrans.x, 0.93 * this.scene.CANVAS_HEIGHT / 4, 0.71);

        // Crear el mensaje que aparece cuando hay invitaciones de amistad pendientes
        this.friendRequestNot = this.createFriendRequestNotificacion(3 * this.scene.CANVAS_WIDTH / 5, 4.5 * this.scene.CANVAS_HEIGHT / 6, 0.9);
        this.friendRequestNot.setVisible(false);

        // Cuando se elimina una solicitud de amistad por medio de un nodo
        this.scene.gameManager.dispatcher.add("eraseFriendRequest", this, (friendReqInfo) => {
            // Si existe el personaje
            if (this.friends.has(friendReqInfo.character)) {
                let friendInfo = this.friends.get(friendReqInfo.character);
                if (friendInfo.request) {
                    this.friendsTab.refuseFriendRequest(friendInfo.request);
                    // Tiene que ir despues
                    this.eraseFriend(friendReqInfo.character);
                }
            }
        }, true);

        // Cuando se elimina un post por medio de un nodo
        this.scene.gameManager.dispatcher.add("erasePost", this, (postInfo) => {
            // Si existe el personaje
            if (this.friends.has(postInfo.character)) {
                let friendInfo = this.friends.get(postInfo.character);
                if (friendInfo.posts.has(postInfo.postName)) {
                    let post = friendInfo.posts.get(postInfo.postName);
                    this.feedTab.erasePost(post);
                    // Tiene que ir despues
                    this.erasePost(postInfo.character, postInfo.postName);
                }
            }
        }, true);

        //new Post(this.scene, this.scene.CANVAS_WIDTH / 2, this.scene.CANVAS_HEIGHT / 2 - 250, 1, "Alison", "Alison", "photoMatch", "hola jajaj");
    }

    ///////////////////////////////////////
    ///////// Elementos de la UI //////////
    //////////////////////////////////////

    /**
     * Crear la foto de perfil del jugador con el nombre de usuario
     */
    createProfilePhoto(x, y, scale) {
        let container = this.scene.add.container(x, y);

        // Foto de perfil del jugador (varia en funcion del genero)
        let genderPfp = null;
        if (this.scene.userInfo.gender === 'male') {
            genderPfp = 'profilePhotoM';
        }
        else if (this.scene.userInfo.gender === 'female') {
            genderPfp = 'profilePhotoF'
        }
        if (genderPfp) {
            let pfp = this.scene.add.image(0, 0, 'computerElements', genderPfp);
            container.add(pfp);

            // Texto con el nombre del jugador
            let nameTextStyle = { ...this.scene.gameManager.textConfig };
            nameTextStyle.fontFamily = 'AUdimat-regular';
            nameTextStyle.fontSize = '35px';
            nameTextStyle.color = '#323232';
            let nameText = this.scene.add.text(-pfp.displayHeight / 2 + 3, pfp.y + pfp.displayHeight / 2 + 28, this.scene.userInfo.username, nameTextStyle);
            nameText.setOrigin(0, 0.5);
            container.add(nameText);
        }

        container.setScale(scale);
        this.add(container);
    }

    /**
     * Crear la notificacion que se muestra para indicar si hay solicitudes de amistad sin revisar
     */
    createFriendRequestNotificacion(x, y, scale) {
        let container = this.scene.add.container(x, y);
        // Background
        let buttonBg = this.scene.add.image(0, 0, 'computerElements', 'buttonBg');
        buttonBg.setScale(6, 0.68);
        container.add(buttonBg);

        // Texto que aparece en el centro
        let style = { ...this.scene.gameManager.textConfig };
        style.fontFamily = 'AUdimat-regular';
        style.fontSize = '28px';
        style.color = '#ff0000';
        let friendRequestNotTrans = this.scene.i18next.t(this.screenName + ".friendRequestNot", { ns: this.scene.namespace });
        let text = this.scene.add.text(0, 0, friendRequestNotTrans, style);
        text.setOrigin(0.5);
        container.add(text);

        let iconScale = 0.65;
        let iconOffset = 265;
        // Carita que aparece a la izquierda
        let leftIcon = this.scene.add.image(-iconOffset, 0, 'computerElements', 'friendsIcon');
        leftIcon.setTint(Phaser.Display.Color.GetColor(255, 0, 0));
        leftIcon.setScale(iconScale);
        container.add(leftIcon);

        // Carita que aparece a la derecha
        let rightIcon = this.scene.add.image(iconOffset, 0, 'computerElements', 'friendsIcon');
        rightIcon.setTint(Phaser.Display.Color.GetColor(255, 0, 0));
        rightIcon.setScale(iconScale);
        container.add(rightIcon);

        container.setScale(scale);
        this.add(container);

        return container;
    }

    /**
     * Cambiar la visiblidad de la notificacion de la solicitud de amistad
     * en funcion de si quedan solicitudes de amistad sin revisar pendientes o no
     */
    changeFriendRequestNotState() {
        this.friendRequestNot.setVisible(false);
        if (!this.friendsTab.emptyPendingRequests()) {
            this.friendRequestNot.setVisible(true);
        }
    }

    /**
     * Crear icono para intercalar entre las diferentes pestanas/opciones de la red social
     */
    createTab(x, y, scale, icon, text, fn) {
        let container = this.scene.add.container(x, y);

        // Fondo
        let buttonBg = this.scene.add.image(0, 0, 'computerElements', 'buttonBg');
        buttonBg.setScale(2, 1);
        let nCol = Phaser.Display.Color.GetColor(255, 255, 255);
        nCol = Phaser.Display.Color.IntegerToRGB(nCol);
        let hCol = Phaser.Display.Color.GetColor(240, 240, 240);
        hCol = Phaser.Display.Color.IntegerToRGB(hCol);
        let pCol = Phaser.Display.Color.GetColor(200, 200, 200);
        pCol = Phaser.Display.Color.IntegerToRGB(pCol);
        buttonBg.setInteractive();

        let tintFadeTime = 25;

        // Animaciones del boton
        buttonBg.on('pointerover', () => {
            this.scene.tweens.addCounter({
                targets: [buttonBg],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(nCol, hCol, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    buttonBg.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
            });
        });

        buttonBg.on('pointerout', () => {
            this.scene.tweens.addCounter({
                targets: [buttonBg],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(hCol, nCol, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    buttonBg.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
            });
        });

        buttonBg.on('pointerdown', () => {
            buttonBg.disableInteractive();
            let down = this.scene.tweens.addCounter({
                targets: [buttonBg],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(hCol, pCol, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    buttonBg.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
                yoyo: true,
            });
            down.on('complete', () => {
                buttonBg.setInteractive();
                fn();
            });
        });
        container.add(buttonBg);

        // Icono de la izquierda
        let offset = -5;
        let iconImg = this.scene.add.image(offset, 0, 'computerElements', icon);
        iconImg.setScale(0.85);
        iconImg.setOrigin(1, 0.5);
        container.add(iconImg);

        // Texto de la derecha
        let style = { ...this.scene.gameManager.textConfig };
        style.fontFamily = 'AUdimat-regular';
        style.fontSize = '27px';
        style.color = '#323232';
        offset += 8.5;
        let sideText = this.scene.add.text(offset, 0, text, style);
        sideText.setOrigin(0, 0.5);
        container.add(sideText);

        container.setScale(scale);
        this.add(container);

        // Se establece una propiedad que corresponde con la altura del contenedor para que los tres iconos
        // de las pestanas se puedan colocar correctamente
        container.h = buttonBg.displayHeight * scale;

        return container;
    }

    ///////////////////////////////////////
    ///// Funciones de la red social //////
    //////////////////////////////////////

    /**
     * Traatar de crear la informacion de un personaje en el caso de que no exista
     * @param {String} character - personaje del que se va a crear la informacion
     */
    tryToCreateFriendInfo(character) {
        if (!this.friends.has(character)) {
            let friendInfo = {
                request: null,
                posts: new Map(),
                pendingPosts: []
            };
            this.friends.set(character, friendInfo);
        }
    }

    /**
     * PUBLICO
     * Establecer el nodo del dialogmanaager que aparece cuando se quiere publicar algo
     * @param {Node} node 
     */
    setOwnPostNode(node) {
        this.ownPostNode = node;
    }

    // SOLICITUDES DE AMISTAD //


    /**
     * PUBLICO
     * Agregar una solicitud de amistad de un personaje
     * @param {String} character 
     */
    addFriendRequest(character) {
        // Se trata de crear su info
        this.tryToCreateFriendInfo(character);

        // Se anade la solicitud
        let friendRequest = this.friendsTab.addFriendRequest(character);

        let friendInfo = this.friends.get(character);
        friendInfo.request = friendRequest;
    }

    /**
     * Se utiliza cuando se deniega una solicitud de amistad para limpiar la
     * estructura que almacena la informacion de todos los usuarios que son posibles amigos
     * @param {String} character 
     */
    eraseFriend(character) {
        if (this.friends.has(character)) {
            let friendInfo = this.friends.get(character);
            // Se eliminan todos los posts que el usuario tenian subidos,
            // aunque no se habian mostrado porque el jugador no acepto la solicitud
            friendInfo.posts.forEach((post, num) => {
                post.destroy();
            })
            this.friends.delete(character);
        }
    }

    /**
     * PUBLICO
     * Establecer el nodo del dialogmanager que aparece cuando se se trata de rechazar una solicitud de amistad
     * Nota: tiene que existir la peticion de amistad del personaje
     * @param {Node} node
     */
    setRefuseNode(character, node) {
        // Existe el personaje
        if (this.friends.has(character)) {
            let friendInfo = this.friends.get(character);
            // Existe la peticion
            if (friendInfo.request) {
                friendInfo.request.setRefuseNode(node);
            }
        }
    }

    // ANADIR/ELIMINAR PUBLICACION //

    /**
     * PUBLICO
     * Se anade un post
     * @param {String} character - personaje
     * @param {String} postName - nombre del post
     *                              Nota: los posts se crean en un json
     */
    createPost(character, postName) {
        // Se trata de crear la info del personaje si no existe
        // Nota: de esta manera se pueden anadir publicaciones antes hacer anadido la solicitud de amistad
        this.tryToCreateFriendInfo(character);

        // Informacion del post
        let friendInfo = this.friends.get(character);
        if (!friendInfo.posts.has(postName)) {
            let postInfo = this.posts[character][postName];
            let photo = postInfo.photo;
            // La foto que se sube varia en funcion del genero del jugador
            let check = photo instanceof String;
            if (!check) {
                photo = postInfo.photo[this.scene.userInfo.gender];
            }
            let friendshipRequired = postInfo.friendshipRequired;
            let description = this.scene.i18next.t(character + "." + postName, { ns: "posts" });

            // Se crea el post
            let post = this.feedTab.createPost(character, photo, description);

            // Se anade a la lista de posts del usuario
            friendInfo.posts.set(postName, post);
            // Se comprueba si el jugador ha aceptado la solicitud
            // y, entonces se puede anadir el post al tablon
            this.tryToAddPost(character, post, friendshipRequired);
        }
    }

    /**
     * Tratar de mostrar un post en el tablon
     * @param {String} character - personaje al que pertenece el post
     * @param {Post} post - post a anadir
     * @param {Boolean} friendShipRequired - si es necesario que el personaje que sube el post sea tu amigo
     *                                          (tp es necesario siquiera que haya enviado una solicitud de amistad)
     */
    tryToAddPost(character, post, friendShipRequired) {
        let pendingPost = true;

        if (this.friends.has(character)) {
            let friendInfo = this.friends.get(character);
            // Si existe la solicitud de amistad
            if (friendInfo.request) {
                // Si se ha aceptado
                if (friendInfo.request.isAccepted) {
                    // Se anade directamente a la listview
                    pendingPost = false;
                    this.feedTab.addPostToList(post);
                }
            }

            // Se muestra directamente la publicacion (personaje u otro personaje)
            // Nota: aunque un personaje haya enviado una solicitud de amistad, puede
            // seguir mostrando publicacion directas
            if (character == "player" || (friendShipRequired !== undefined && friendShipRequired === false)) {
                // Se ana directamente a la listview
                pendingPost = false;
                this.feedTab.addPostToList(post);
            }

            // El personaje ha subido una publicacion, pero no se va a mostrar
            // hasta que se acepte la solicitud de amistad
            if (pendingPost) {
                friendInfo.pendingPosts.push(post);
            }
        }
    }

    /**
     * Una vez aceptada la solicitud de amistad, anadir todos los posts pendientes al tablon
     * @param {String} character - personaje 
     */
    addPendingPosts(character) {
        let friendInfo = this.friends.get(character);
        // Los posts pendientes que no se han anadido son los que habia hasta el momento en el map
        friendInfo.pendingPosts.forEach((post, num) => {
            this.feedTab.addPostToList(post);
        });
        friendInfo.pendingPosts = [];
    }

    /**
     * Eliminar un post (independientemente de si se ha aceptado la solicitud de amistad o no)
     * @param {String} character - personaje
     * @param {String} postName - post
     */
    erasePost(character, postName) {
        // Si existe el personaje
        if (this.friends.has(character)) {
            let friendInfo = this.friends.get(character);
            // Si existe ese post
            if (friendInfo.posts.has(postName)) {
                // Entonces, se anade a la listview
                friendInfo.posts.delete(postName);
            }
        }
    }

    // COMENTAR PUBLICACION //

    /**
     * PUBLICO (DESDE EL DIALOG MANAGER)
     * Anadir comentario a una publicacion (tiene que existir la publicacion previamente)
     * @param {String} user - personaje que ha subido la publicacion
     * @param {String} postName - nombre de la publicacion 
     * @param {String} character - personaje que responde la publicacion
     * @param {String} name - nombre del personaje que responde la publicacion
     * @param {String} text - texto con el comentario
     */
    addCommentToPost(user, postName, character, name, text) {
        // Existe el usuario
        if (this.friends.has(user)) {
            let friendInfo = this.friends.get(user);
            // Existe el post
            if (friendInfo.posts.has(postName)) {
                friendInfo.posts.get(postName).addMessage(text, character, name);
            }
        }
    }

    /**
     * PUBLICO
     * Establecer un nodo del dialogmanager que aparece al clicar el boton de comentario de un post
     * @param {String} character - personaje 
     * @param {String} postName - post
     * @param {Node} node - texto 
     */
    setPostNode(character, postName, node) {
        // Existe el usuario
        if (this.friends.has(character)) {
            let friendInfo = this.friends.get(character);
            // Existe el post
            if (friendInfo.posts.has(postName)) {
                friendInfo.posts.get(postName).setCommentNode(node);
            }
        }
    }

    ///////////////////////////////////////
    //////////// Transiciones /////////////
    //////////////////////////////////////

    start() {
        // Al igual que en la pestana de login, como esta totalmente invisible,
        // se vuelve completamente invisible
        this.setVisible(true);
        // Se si hay peticiones de amistad pendiente o no para saber si activar la notificacion o no
        this.changeFriendRequestNotState();
        // Se accede a la pestana con los posts
        this.accessFeedTab();
    }

    /**
     * Cambiar a la pestana donde aparecen las solicitudes de amistad
     */
    accessFriendsTab() {
        this.feedTab.setVisible(false);
        this.friendsTab.start();
    }

    /**
     * Cambiar a la pestana donde aparecen los posts de los amigos
     */
    accessFeedTab() {
        this.friendsTab.setVisible(false);
        this.feedTab.setVisible(true);
    }

    ///////////////////////////////////////
    ////////////// Overrides /////////////
    //////////////////////////////////////

    setVisible(visible) {
        // El setVisible de un grupo solo pone el parametro visible a false de los items del grupo,
        // pero no llama al setVisible de cada uno de los items
        // Sin embargo, en este caso es necesario hacer override del setVisible para poder
        // hacer invisibles las listviews
        super.setVisible(visible);
        this.feedTab.setVisible(visible);
        this.friendsTab.setVisible(visible);
    }
}