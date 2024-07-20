import FriendsTab from './friendsTab.js'
import FeedTab from './feedTab.js'

export default class SocialNetworkScreen extends Phaser.GameObjects.Group {
    /**
     * Pantalla de la red social, donde consultar los amigos y sus posts
     * @param {Phaser.scene} computerScene - escena del ordenador
     * @extends Phaser.GameObjects.Group 
     */
    constructor(computerScene) {
        super(computerScene);

        let dialogManager = this.scene.gameManager.dialogManager;
        this.uploadNode = null;

        this.friends = new Set();

        // Fondo de login del ordenador
        let mainViewBg = this.scene.add.image(0.23 * this.scene.CANVAS_WIDTH / 5, 4.1 * this.scene.CANVAS_HEIGHT / 5, 'computerMainView');
        mainViewBg.setOrigin(0, 1).setScale(0.61);
        mainViewBg.displayWidth += 20;
        this.add(mainViewBg);

        // Pestana donde aparecen los posts
        this.feedTab = new FeedTab(this);
        this.add(this.feedTab);
        // Pestana dodne aparecen los amigos
        this.friendsTab = new FriendsTab(this);
        this.add(this.friendsTab);

        // Botones para intercalar entre las diferentes pestanas
        let tabTrans = {
            x: 1.07 * this.scene.CANVAS_WIDTH / 7,
            y: 1.75 * this.scene.CANVAS_HEIGHT / 4,
            scale: 0.9
        }
        // Amigos
        let tab = this.createTab(tabTrans.x, tabTrans.y, tabTrans.scale, 'dialogBubbleIcon', "Tablón", () => {
            this.accessFeedTab();
        });

        // Posts
        this.createTab(tabTrans.x, tabTrans.y + tab.h, tabTrans.scale, 'friendsIcon', "Amigos", () => {
            this.accessFriendsTab();
        });
        // Subir una foto
        // (Durante todo el juego no se puede subir ninguna foto, por lo tanto, al clicar este boton
        // solo aparece un cometnario del personaje)
        this.createTab(tabTrans.x, tabTrans.y + tab.h * 2, tabTrans.scale, 'photosIcon', "Postear", () => {
            if (this.uploadNode) {
                dialogManager.setNode(this.uploadNode);
            }
        });

        // Crer la foto de perfil junto con el usuario del personaje
        this.createProfilePhoto(tabTrans.x, 0.93 * this.scene.CANVAS_HEIGHT / 4, 0.71);

        // Crear el mensaje que aparece cuando hay invitaciones de amistad pendientes
        this.friendRequestNot = this.createFriendRequestNotificacion(3 * this.scene.CANVAS_WIDTH / 5, 4.5 * this.scene.CANVAS_HEIGHT / 6, 0.9);
        this.friendRequestNot.setVisible(false);

        //this.test();
    }

    createProfilePhoto(x, y, scale) {
        let container = this.scene.add.container(x, y);

        // Foto de perfil dl jugador (varia en funcion de si es chico o chica)
        let userInfo = this.scene.gameManager.getUserInfo();
        let genderPfp = null;
        if (userInfo.gender === 'male') {
            genderPfp = 'pfpM';
        }
        else if (userInfo.gender === 'female') {
            genderPfp = 'pfpF'
        }
        if (genderPfp) {
            let pfp = this.scene.add.image(0, 0, genderPfp);
            container.add(pfp);

            // Texto con el nombre del jugador
            let nameTextStyle = { ...this.scene.gameManager.textConfig };
            nameTextStyle.fontFamily = 'AUdimat-regular';
            nameTextStyle.fontSize = '35px';
            nameTextStyle.color = '#323232';
            let nameText = this.scene.add.text(-pfp.displayHeight / 2 + 3, pfp.y + pfp.displayHeight / 2 + 28, userInfo.username, nameTextStyle);
            nameText.setOrigin(0, 0.5);
            container.add(nameText);
        }

        container.setScale(scale);
        this.add(container);
    }

    createFriendRequestNotificacion(x, y, scale) {
        let container = this.scene.add.container(x, y);
        // Background
        let buttonBg = this.scene.add.image(0, 0, 'buttonBg');
        buttonBg.setScale(6, 0.68);
        container.add(buttonBg);

        // Texto que aparece en el centro
        let style = { ...this.scene.gameManager.textConfig };
        style.fontFamily = 'AUdimat-regular';
        style.fontSize = '28px';
        style.color = '#ff0000';
        let text = this.scene.add.text(0, 0, '¡Tienes nuevas peticiones de amistad!', style);
        text.setOrigin(0.5);
        container.add(text);

        let iconScale = 0.65;
        let iconOffset = 265;
        // Carita que aparece a la izquierda
        let leftIcon = this.scene.add.image(-iconOffset, 0, 'friendsIcon');
        leftIcon.setTint(Phaser.Display.Color.GetColor(255, 0, 0));
        leftIcon.setScale(iconScale);
        container.add(leftIcon);

        // Carita que aparece a la derecha
        let rightIcon = this.scene.add.image(iconOffset, 0, 'friendsIcon');
        rightIcon.setTint(Phaser.Display.Color.GetColor(255, 0, 0));
        rightIcon.setScale(iconScale);
        container.add(rightIcon);

        container.setScale(scale);
        this.add(container);

        return container;
    }

    createTab(x, y, scale, icon, text, fn) {
        let container = this.scene.add.container(x, y);

        // Fondo
        let buttonBg = this.scene.add.image(0, 0, 'buttonBg');
        buttonBg.setScale(2, 1);
        let nCol = Phaser.Display.Color.GetColor(255, 255, 255);
        nCol = Phaser.Display.Color.IntegerToRGB(nCol);
        let hCol = Phaser.Display.Color.GetColor(240, 240, 240);
        hCol = Phaser.Display.Color.IntegerToRGB(hCol);
        let pCol = Phaser.Display.Color.GetColor(200, 200, 200);
        pCol = Phaser.Display.Color.IntegerToRGB(pCol);
        buttonBg.setInteractive();

        let tintFadeTime = 25;

        // Interacciones con el fondo
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

        buttonBg.on('pointerdown', (pointer) => {
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
        let iconImg = this.scene.add.image(offset, 0, icon);
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

        // Se establece una propiedad como la altura del contenedor para que los tres iconos
        // de las pestanas se puedan colocar correctamente
        container.h = buttonBg.displayHeight * scale;

        return container;
    }

    test() {
        this.addFriendRequest("Maria", "Hola me llamo maria");
        this.addFriendRequest("Alison", "Hola me llamo maria");
        this.addFriendRequest("Alex", "Hola me llamo maria");
        this.addFriendRequest("Guille", "Hola me llamo maria");

        this.addPost("Alison", "photoMatch", "Hola jajaja");
        this.addPost("Alex", "photoMatch", "Hola jajaja");
        this.addPost("Guille", "photoMatch", "Hola jajaja");
    }

    tryToCreateFriendInfo(character) {
        if (!this.friends.has(character)) {
            let friendInfo = {
                request: null,
                pendingPosts: [],
                nPosts: 0,
                posts: new Set()
            };
            this.friends.set(character, friendInfo);
        }
    }

    addFriendRequest(character) {
        this.tryToCreateFriendInfo();

        let avatar = character + "Avatar";
        let name = this.scene.gameManager.i18next.t(character, { ns: "names" });
        let bio = this.scene.gameManager.i18next.t(character, { ns: "socialNetBios" });
        let friendRequest = this.friendsTab.addFriendRequest(character, avatar, name, bio);

        let friendInfo = this.friends.get(character);
        friendInfo.request = friendRequest;
    }

    addPost(character, photo, description) {
        this.tryToCreateFriendInfo(character);

        let avatar = character + "Avatar";
        let name = this.scene.gameManager.i18next.t(character, { ns: "names" });
        let post = this.feedTab.createPost(avatar, name, photo, description);

        let check = this.tryToAddPostToFeed(character, post);
        if (!check) {
            let friendInfo = this.friends.get(character);
            friendInfo.pendingPosts.push(post);
        }

    }

    tryToAddPostToFeed(character, post) {
        let friendInfo = this.friends.get(character);
        if (friendInfo.request) {
            if (friendInfo.request.isAccepted) {
                this.feedTab.addPostToFeed(post);
                friendInfo.posts.set(friendInfo.nPosts, post);
                ++friendInfo.nPosts;
                return true;
            }
        }
        return false;
    }

    addPendingPosts(character) {
        let friendInfo = this.friends.get(character);
        friendInfo.pendingPosts.forEach((post) => {
            this.tryToAddPostToFeed(character, post);
        });
        friendInfo.pendingPosts = [];
    }

    eraseFriend(character) {
        if (this.friends.has(character)) {
            this.friends.delete(character);
        }
    }

    addCommentToPost(character, postNumber, text) {
        if (this.friends.has(character)) {
            let friendInfo = this.friends.get(character);
            if (friendInfo.posts.has(postNumber)) {
                let name = this.scene.gameManager.i18next.t(character, { ns: "names" });
                friendInfo.posts.get(postNumber).addMessage(text, character, name);
            }
        }
    }

    changeFriendRequestNotState() {
        this.friendRequestNot.setVisible(false);
        if (!this.friendsTab.emptyFriendRequests()) {
            this.friendRequestNot.setVisible(true);
        }
    }

    start() {
        this.setVisible(true);
        // se comprueba si hay peticiones de amistad pendiente o no para saber si activar la notificacion o no
        this.changeFriendRequestNotState();
        this.accessFeedTab();
    }

    accessFriendsTab() {
        this.feedTab.setVisible(false);
        this.friendsTab.start();
        //this.friendsTab.setVisible(true);
    }

    accessFeedTab() {
        this.friendsTab.setVisible(false);
        this.feedTab.setVisible(true);
    }

    setVisible(visible) {
        // El setVisible de un grupo solo pone el parametro visible a false de los items del grupo,
        // pero no llama al setVisible de cada uno de los items
        // Sin embargo, en este caso es necesario llamar al setVisible de la listview
        super.setVisible(visible);
        this.feedTab.setVisible(visible);
        this.friendsTab.setVisible(visible);
    }

    setUploadNode(node) {
        this.uploadNode = node;
    }
}