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

    preload() {
        // ASSETS
        this.load.setPath('./assets');

        // Caja de texto y de opcion multiple
        /*
        this.load.image('textbox', 'textbox.png');
        this.load.image('textboxName', 'textboxName.png');
        this.load.image('option', 'optionBg.png');
        */
        this.load.image('textboxMask', './UI/dialog/textboxMask.png');

        // comprimir texturas (toma mucha menos memoria, aunque los archivos pueden ocupa mas tam)
        // Se comprueba de arriba a abajo hasta encontrar el primero que funcione en el dispositivo, si no, se usa png
        // formatos de compresion: ETC, ETC1, ATC, ASTC, BPTC, RGTC, PVRTC, S3TC, and S3TCSRB
        // ASTC - MAC
        // PVRTC - iOS y algunos Android
        // S3TCSRB/S3TCSRGB - SOs sobremesa y algunos Android
        // ETC1 - mayoria Android
        this.load.texture('dialog', {
            // 'ASTC': { type: 'PVR', textureURL: 'UI/dialog/dialog-astc4x4/dialog-astc4x4.pvr', atlasURL: 'UI/dialog/dialog-astc4x4/dialog-astc4x4.json' },
            //'PVRTC': { type: 'PVR', textureURL: 'UI/dialog/dialog-pvrtc/dialog-pvrtc.pvr', atlasURL: 'UI/dialog/dialog-pvrtc/dialog-pvrtc.json' },
            // 'S3TCSRGB': { type: 'PVR', textureURL: 'UI/dialog/dialog-dxt5/dialog-dxt5.pvr', atlasURL: 'UI/dialog/dialog-dxt5/dialog-dxt5.json' },
            'IMG': { textureURL: 'UI/dialog/dialog-img/dialog-img.png', atlasURL: 'UI/dialog/dialog-img/dialog-img.json' },
        });

        // Telefono
        this.load.image('phoneIcon', './UI/phone/phoneIcon.png');
        this.load.image('phone', './UI/phone/phone.png');
        this.load.image('alarmBg', './UI/phone/alarmBg.png');
        this.load.image('mainScreenBg', './UI/phone/mainScreenBg.png');
        this.load.image('statusBg', './UI/phone/statusBg.png');
        this.load.image('messagesBg', './UI/phone/messagesBg.png');
        this.load.image('chatBg', './UI/phone/chatBg.png');
        this.load.image('settingsBg', './UI/phone/settingsBg.png');
        this.load.image('chatBgTop', './UI/phone/chatBgTop.png');

        // Botones del telefono
        this.load.image('returnButton', './UI/phone/triangle.png');
        this.load.image('homeButton', './UI/phone/circle.png');
        this.load.image('uselessButton', './UI/phone/square.png');

        this.load.image('statusIcon', './UI/phone/statusIcon.png');
        this.load.image('chatIcon', './UI/phone/chatIcon.png');
        this.load.image('settingsIcon', './UI/phone/settingsIcon.png');
        this.load.image('chatButton', './UI/phone/chatButton.png');
        this.load.image('chatTextBox', './UI/phone/chatTextBox.png');

        this.load.image('myBubble', './UI/phone/9slicePlaeyrs.png');
        this.load.image('othersBubble', './UI/phone/9sliceOthers.png');
        this.load.image('commentBubble', './UI/9sliceComments.png');

        

        // Fondos
        this.load.image('basePC', 'UI/menuBgs/BasePCsq.png');
        this.load.image('PCscreen', 'UI/menuBgs/ScreenWithoutBlack.png');
        this.load.image('bedroomCeiling', 'backgrounds/bedroomCeilingBg.png');


        // Menu principal
        this.load.image('powerOff', 'UI/titleMenu/power_off.png');
        this.load.image('logoWT', 'UI/titleMenu/logoWT.png');

        // Menu de login
        this.load.image('loginBg', 'UI/userInfoMenu/LoginBackground.png');
        this.load.image('backButton', 'UI/userInfoMenu/backChatButton.png');
        this.load.image('boyIcon', 'UI/userInfoMenu/ChicoSelect.png');
        this.load.image('girlIcon', 'UI/userInfoMenu/ChicaSelect.png');

        // Banderas idiomas
        this.load.image('frFlag', 'UI/languageMenu/frFlag.png');
        this.load.image('spFlag', 'UI/languageMenu/spFlag.png');
        this.load.image('ukFlag', 'UI/languageMenu/ukFlag.png');
        this.load.image('ptFlag', 'UI/languageMenu/ptFlag.png');

        // Ordenador
        this.load.image('buttonBg', 'UI/computer/ButtonBg.png');
        this.load.image('postit', 'UI/computer/postit.png')
        this.load.image('closerBrowser', 'UI/computer/closerBrowser.png');
        this.load.image('socialNetLogo', 'UI/computer/SocialNetLogo.png');
        this.load.image('computerMainView', 'UI/computer/MainViewBackground.png');
        this.load.image('buttonBg', 'UI/computer/ButtonBg.png');
        this.load.image('friendsIcon', 'UI/computer/Friends.png');
        this.load.image('dialogBubbleIcon', 'UI/computer/Home.png');
        this.load.image('photosIcon', 'UI/computer/Photos.png');
        this.load.image('pfpM', 'UI/computer/profilePhotoH.png');
        this.load.image('pfpF', 'UI/computer/profilePhotoM.png');
        //this.load.image('buttonAcceptBg', 'UI/computer/buttonAcceptBg.png')
        this.load.image('newFriendBg', 'UI/computer/NewFriendBG.png');
        this.load.image('oldFriendBg', 'UI/computer/OldFriendBG.png');
        this.load.image('block', 'UI/computer/Block.png');

        // Avatares de los personajes
        this.load.image('alexAvatar', 'UI/charactersAvatars/AlexAvatar.png');
        this.load.image('alisonAvatar', 'UI/charactersAvatars/AlisonAvatar.png');
        this.load.image('anaAvatar', 'UI/charactersAvatars/AnaAvatar.png');
        this.load.image('boyAvatar', 'UI/charactersAvatars/BoyAvatar.png');
        this.load.image('girlAvatar', 'UI/charactersAvatars/GirlAvatar.png');
        this.load.image('guilleAvatar', 'UI/charactersAvatars/GuilleAvatar.png');
        this.load.image('joseAvatar', 'UI/charactersAvatars/JoseAvatar.png');
        this.load.image('mariaAvatar', 'UI/charactersAvatars/MariaAvatar.png');
        this.load.image('parentsAvatar', 'UI/charactersAvatars/ParentsAvatar.png');
        this.load.image('teacherAvatar', 'UI/charactersAvatars/TeacherAvatar.png');

        // Test
        this.load.image('bg', 'patio.png');
        this.load.image('testIcon', './UI/AlexAvatar.png');


        // Personajes y sus respectivas animaciones esqueletales de Spine
        // [Idle01, IdleBase, Walk]
        this.load.spine("mom", 'characters/mom/Front.json', 'characters/mom/Front.atlas')
        // [Idle01, IdleBase]
        this.load.spine("dad", 'characters/dad/Front 34.json', 'characters/dad/Front 34.atlas')

        // PLUGINS

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
            ns: ['titleMenu', 'userInfoMenu', 'names', 'phoneInfo', 'transitionScenes',
                'momDialog', 'dadDialog', 'chat1'],   // TEST
            preload: ['en', 'es'],
            // mostrar informacion de ayuda por consola
            debug: false,
            // cargar las traducciones de un servidor especificado en vez de ponerlas directamente
            backend: {
                // La ruta desde donde cargamos las traducciones
                // {{lng}} --> nombre carpeta de cada uno de los idiomas
                // {{ns}} --> nombre carpeta de cada uno de los namespaces
                loadPath: './localization/{{lng}}/{{ns}}.json'
            }
        })

        // ARCHIVOS DE DIALOGOS

        this.load.setPath('./localization');
        this.load.json('momDialog', './momDialog.json');
        this.load.json('dadDialog', './dadDialog.json');
        this.load.json('chat1', './chat1.json');

    }

    create() {
        let gameManager = GameManager.create(this);
        
        // TEST
        let userInfo = {
            name: "Laura",
            username: "lauritaloka",
            password: "hola123",
            gender: "female"
        }
        gameManager.setUserInfo(userInfo);
        // this.scene.start('ComputerScene');
        gameManager.startLangMenu();

    }

}