import GameManager from '../managers/gameManager.js';

export default class BootScene extends Phaser.Scene {
    /**
    * Escena inicial en la que se cargan todos los recursos
    * @extends Phaser.Scene
    */
    constructor() {
        super({
            key: 'BootScene',
            // Se caraga el plugin i18next
            pack: {
                files: [{
                    type: 'plugin',
                    key: 'rextexttranslationplugin',
                    url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexttranslationplugin.min.js',
                    start: true,
                    mapping: 'translation'  // Add text-translation plugin to `scene.translation`
                }]
            }
        });
    }

    loadComputersAssets() {
        this.load.setPath('./assets/UI/computer');

        // Fondos del ordenador
        this.load.image('basePC', 'backgrounds/BasePCsq.png');
        this.load.image('PCscreen', 'backgrounds/ScreenWithoutBlack.png');
        this.load.image('loginBg', 'backgrounds/LoginBackground.png');
        this.load.image('computerMainView', 'backgrounds/MainViewBackground.png');

        // Elementos del menu principal
        this.load.image('powerOff', 'titleMenu/power_off.png');
        this.load.image('logoWT', 'titleMenu/logoWT.png');

        // Elementos del menu de login
        this.load.image('backButton', 'loginMenu/backChatButton.png');
        this.load.image('boyIcon', 'loginMenu/ChicoSelect.png');
        this.load.image('girlIcon', 'loginMenu/ChicaSelect.png');

        // Elementos del menu del ordenador
        this.load.image('buttonBg', 'ButtonBg.png');
        this.load.image('buttonAcceptBg', 'buttonAcceptBg.png');
        this.load.image('postit', 'postit.png')
        this.load.image('closerBrowser', 'closerBrowser.png');
        this.load.image('socialNetLogo', 'SocialNetLogo.png');
        this.load.image('buttonBg', 'ButtonBg.png');
        this.load.image('friendsIcon', 'Friends.png');
        this.load.image('dialogBubbleIcon', 'Home.png');
        this.load.image('photosIcon', 'Photos.png');
        this.load.image('pfpM', 'profilePhotoH.png');
        this.load.image('pfpF', 'profilePhotoM.png');
        this.load.image('newFriendBg', 'NewFriendBG.png');
        this.load.image('oldFriendBg', 'OldFriendBG.png');
        this.load.image('block', 'Block.png');
        this.load.image('commentBubble', '9sliceComments.png');
    }

    loadPhoneAssets() {
        this.load.setPath('./assets/UI/phone');

        // Telefono
        this.load.image('phoneIcon', 'phoneIcon.png');
        this.load.image('phone', 'phone.png');
        this.load.image('alarmBg', 'alarmBg.png');
        this.load.image('mainScreenBg', 'mainScreenBg.png');
        this.load.image('statusBg', 'statusBg.png');
        this.load.image('messagesBg', 'messagesBg.png');
        this.load.image('chatBg', 'chatBg.png');
        this.load.image('settingsBg', 'settingsBg.png');
        this.load.image('chatBgTop', 'chatBgTop.png');

        // Botones del telefono
        this.load.image('returnButton', 'triangle.png');
        this.load.image('homeButton', 'circle.png');
        this.load.image('uselessButton', 'square.png');

        this.load.image('statusIcon', 'statusIcon.png');
        this.load.image('chatIcon', 'chatIcon.png');
        this.load.image('settingsIcon', 'settingsIcon.png');
        this.load.image('chatButton', 'chatButton.png');
        this.load.image('chatTextBox', 'chatTextBox.png');

        this.load.image('myBubble', '9slicePlayer.png');
        this.load.image('othersBubble', '9sliceOthers.png');
    }

    loadFlags() {
        this.load.setPath('./assets/UI/flags');

        // Banderas idiomas
        this.load.image('frFlag', 'frFlag.png');
        this.load.image('spFlag', 'spFlag.png');
        this.load.image('ukFlag', 'ukFlag.png');
        this.load.image('ptFlag', 'ptFlag.png');
    }

    loadAvatars() {
        this.load.setPath('./assets/UI/avatars');

        // Avatares de los personajes
        this.load.image('AlexAvatar', 'AlexAvatar.png');
        this.load.image('AlisonAvatar', 'AlisonAvatar.png');
        this.load.image('AnaAvatar', 'AnaAvatar.png');
        this.load.image('boyAvatar', 'BoyAvatar.png');
        this.load.image('girlAvatar', 'GirlAvatar.png');
        this.load.image('GuilleAvatar', 'GuilleAvatar.png');
        this.load.image('JoseAvatar', 'JoseAvatar.png');
        this.load.image('MariaAvatar', 'MariaAvatar.png');
        this.load.image('parentsAvatar', 'ParentsAvatar.png');
        this.load.image('teacherAvatar', 'TeacherAvatar.png');
    }

    loadPlugins() {
        // Se inicializa el plugin i18next
        // Inicialmente solo se carga el idioma inicial y los de respaldo
        // Luego, conforme se usan tambien se cargan el resto
        this.plugins.get('rextexttranslationplugin').initI18Next(this, {
            // idioma inicial
            lng: 'en',
            // solo se mantiene cargado el idioma que se usa (mejora el rendimiento del server)
            //load: 'current',
            // en caso de que no se encuentra una key en otro idioma se comprueba en los siguientes en orden
            fallbackLng: 'en',
            // idiomas permitidos
            // Sin esta propiedad a la hora de buscar las traducciones se podria buscar
            // en cualquier idioma (aunque o existiese)
            supportedLngs: ['en', 'es'],
            // namespaces que se cargan para cada uno de los idiomas
            ns: ['titleMenu', 'userInfoMenu', 'names', 'phoneInfo', 
                'transitionScenes', 'day1/bedroomMorningDay1',
                'momDialog', 'dadDialog', 'chat1', 'computer'],   // TEST
            preload: ['en', 'es'],
            // mostrar informacion de ayuda por consola
            debug: true,
            // cargar las traducciones de un servidor especificado en vez de ponerlas directamente
            backend: {
                // La ruta desde donde cargamos las traducciones
                // {{lng}} --> nombre carpeta de cada uno de los idiomas
                // {{ns}} --> nombre carpeta de cada uno de los namespaces
                loadPath: './localization/{{lng}}/{{ns}}.json'
            }
        })
    }

    loadDialogs() {
        this.load.setPath('./assets/UI/dialog');

        // Assets de la caja de texto y de opcion multiple
        this.load.image('textboxMask', 'textboxMask.png');

        // comprimir texturas (toma mucha menos memoria, aunque los archivos pueden ocupa mas tam)
        // Se comprueba de arriba a abajo hasta encontrar el primero que funcione en el dispositivo, si no, se usa png
        // formatos de compresion: ETC, ETC1, ATC, ASTC, BPTC, RGTC, PVRTC, S3TC, and S3TCSRB
        // ASTC - MAC
        // PVRTC - iOS y algunos Android
        // S3TCSRB/S3TCSRGB - SOs sobremesa y algunos Android
        // ETC1 - mayoria Android
        this.load.texture('dialog', {
            // 'ASTC': { type: 'PVR', textureURL: 'dialog-astc4x4/dialog-astc4x4.pvr', atlasURL: 'dialog-astc4x4/dialog-astc4x4.json' },
            // 'PVRTC': { type: 'PVR', textureURL: 'dialog-pvrtc/dialog-pvrtc.pvr', atlasURL: 'dialog-pvrtc/dialog-pvrtc.json' },
            // 'S3TCSRGB': { type: 'PVR', textureURL: 'dialog-dxt5/dialog-dxt5.pvr', atlasURL: 'dialog-dxt5/dialog-dxt5.json' },
            'IMG': { textureURL: 'dialog-img/dialog-img.png', atlasURL: 'dialog-img/dialog-img.json' },
        });

        // Archivos de dialogos (estructura)
        this.load.setPath('./localization');

        this.load.json('momDialog', './momDialog.json');
        this.load.json('dadDialog', './dadDialog.json');
        this.load.json('chat1', './chat1.json');
        this.load.json('computer', './computer.json');
        this.load.json('bedroomMorningDay1', './day1/bedroomMorningDay1.json');
    }

    loadSpinalAnims() {
        this.load.setPath('./assets/characters');

        // Personajes y sus respectivas animaciones esqueletales de Spine
        // [Idle01, IdleBase, Walk]
        this.load.spine("mom", 'mom/Front.json', 'mom/Front.atlas')
        // [Idle01, IdleBase]
        this.load.spine("dad", 'dad/Front 34.json', 'dad/Front 34.atlas')
    }

    loadBackgrounds() {
        this.load.setPath('./assets/backgrounds');

        // Habitacion
        this.load.image('bedroomCeiling', 'bedroom/bedroomCeiling.png');
        this.load.image('bedroomBg', 'bedroom/bedroomBase.png');
        this.load.image('bed', 'bedroom/bed.png');
        this.load.image('bag', 'bedroom/bag.png');
        this.load.image('bedroomChair', 'bedroom/bedroomChair.png');
        this.load.image('bedroomDoorClosed', 'bedroom/bedroomDoorClosed.png');
        this.load.image('bedroomDoorOpened', 'bedroom/bedroomDoorOpened.png');
        this.load.image('bedroomJacket', 'bedroom/bedroomJacket.png');
        this.load.image('clothes1', 'bedroom/clothes1.png');
        this.load.image('clothes2', 'bedroom/clothes2.png');
        this.load.image('clothes3', 'bedroom/clothes3.png');
        this.load.image('wardrobeDoor1Closed', 'bedroom/wardrobeDoor1Closed.png');
        this.load.image('wardrobeDoor1Opened', 'bedroom/wardrobeDoor1Opened.png');
        this.load.image('wardrobeDoor2Closed', 'bedroom/wardrobeDoor2Closed.png');
        this.load.image('wardrobeDoor2Opened', 'bedroom/wardrobeDoor2Opened.png');
        this.load.image('wardrobeDoor3Closed', 'bedroom/wardrobeDoor3Closed.png');
        this.load.image('wardrobeDoor3Opened', 'bedroom/wardrobeDoor3Opened.png');

    }

    preload() {
        this.loadComputersAssets();
        this.loadPhoneAssets();
        this.loadFlags();
        this.loadAvatars();
        this.loadDialogs();
        this.loadSpinalAnims();
        this.loadBackgrounds();

        this.load.setPath('./assets');


        // Test
        this.load.image('bg', 'patio.png');
        this.load.image('testIcon', './UI/AlexAvatar.png');
        this.load.image('computerImg', 'Computer.png');

        this.loadPlugins();
    }

    create() {
        let gameManager = GameManager.create(this);

        gameManager.startLangMenu();
    }
}