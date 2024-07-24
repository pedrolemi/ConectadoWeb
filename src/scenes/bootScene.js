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
        this.load.setPath('assets/UI/computer');

        // Fondos del ordenador
        this.load.image('basePC', 'backgrounds/basePCsq.png');
        this.load.image('PCscreen', 'backgrounds/screenWithoutBlack.png');
        this.load.image('loginBg', 'backgrounds/loginBackground.png');
        this.load.image('computerMainView', 'backgrounds/mainViewBackground.png');

        // Elementos del menu principal
        this.load.image('powerOff', 'titleMenu/power_off.png');
        this.load.image('logoWT', 'titleMenu/logoWT.png');

        // Elementos del menu de login
        this.load.image('backButton', 'loginMenu/backChatButton.png');
        this.load.image('boyIcon', 'loginMenu/chicoSelect.png');
        this.load.image('girlIcon', 'loginMenu/chicaSelect.png');

        // Elementos del menu del ordenador
        /*
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
        this.load.image('photosBg', 'PhotosBg.png');
        this.load.image('addComment', 'Add_Comment.png');
        */
        this.load.image('commentBubble', '9sliceComments.png');
        this.load.atlas('computerElements', 'computerElements.png', 'computerElements.json');

        // Posts
        this.load.atlas('photos', 'photos.png', 'photos.json');
    }

    loadPhoneAssets() {
        this.load.setPath('assets/UI/phone');

        // Telefono
        this.load.image('phone', 'phone.png');
        /*
        this.load.image('phoneIcon', 'phoneIcon.png');
        this.load.image('alarmBg', 'alarmBg.png');
        this.load.image('mainScreenBg', 'mainScreenBg.png');
        this.load.image('statusBg', 'statusBg.png');
        this.load.image('messagesBg', 'messagesBg.png');
        this.load.image('chatBg', 'chatBg.png');
        this.load.image('settingsBg', 'settingsBg.png');
        this.load.image('chatBgTop', 'chatBgTop.png');
        */

        // Botones del telefono
        /*
        this.load.image('returnButton', 'triangle.png');
        this.load.image('homeButton', 'circle.png');
        this.load.image('uselessButton', 'square.png');

        this.load.image('statusIcon', 'statusIcon.png');
        this.load.image('chatIcon', 'chatIcon.png');
        this.load.image('settingsIcon', 'settingsIcon.png');
        this.load.image('chatButton', 'chatButton.png');
        this.load.image('chatTextBox', 'chatTextBox.png');
        */

        this.load.atlas('phoneElements', 'phoneElements.png', 'phoneElements.json');

        this.load.image('myBubble', '9slicePlayer.png');
        this.load.image('othersBubble', '9sliceOthers.png');
    }

    loadFlags() {
        this.load.setPath('assets/UI/flags');

        // Banderas idiomas
        /*
        this.load.image('frFlag', 'frFlag.png');
        this.load.image('spFlag', 'spFlag.png');
        this.load.image('ukFlag', 'ukFlag.png');
        this.load.image('ptFlag', 'ptFlag.png');
        */
        this.load.atlas('flags', 'flags.png', 'flags.json');
    }

    loadAvatars() {
        this.load.setPath('assets/UI/avatars');

        // Avatares de los personajes
        /*
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
        */
        this.load.atlas('avatars', 'avatars.png', 'avatars.json');
    }

    loadPlugins() {
        // Se inicializa el plugin i18next
        // Inicialmente solo se carga el idioma inicial y los de respaldo
        // Luego, conforme se usan tambien se cargan el resto
        this.plugins.get('rextexttranslationplugin').initI18Next(this, {
            // Idioma inicial
            lng: 'en',
            // en caso de que no se encuentra una key en otro idioma se comprueba en los siguientes en orden
            fallbackLng: 'en',
            // Idiomas permitidos
            // Sin esta propiedad a la hora de buscar las traducciones se podria buscar
            // en cualquier idioma (aunque o existiese)
            supportedLngs: ['en', 'es'],
            // Namespaces que se cargan para cada uno de los idiomas
            ns: ['titleMenu', 'userInfoMenu', 'names', 'phoneInfo', 'computer',
                'transitionScenes', 'everydayDialog', 'day1\\bedroomMorningDay1', 'day1\\livingroomMorningDay1',
                'momDialog', 'dadDialog', 'chat1'],
            preload: ['en', 'es'],
            // Mostrar informacion de ayuda por consola
            debug: true,
            // Cargar las traducciones de un servidor especificado en vez de ponerlas directamente
            backend: {
                // La ruta desde donde cargamos las traducciones
                // {{lng}} --> nombre carpeta de cada uno de los idiomas
                // {{ns}} --> nombre carpeta de cada uno de los namespaces
                loadPath: 'localization/{{lng}}/{{ns}}.json'
            }
        })
    }

    loadDialogs() {
        this.load.setPath('assets/UI/dialog');

        // Assets de la caja de texto y de opcion multiple
        this.load.image('textboxMask', 'textboxMask.png');

        this.load.atlas('dialogs', 'dialogs.png', 'dialogs.json');

        // comprimir texturas (toma mucha menos memoria, aunque los archivos pueden ocupa mas tam)
        // Se comprueba de arriba a abajo hasta encontrar el primero que funcione en el dispositivo, si no, se usa png
        // formatos de compresion: ETC, ETC1, ATC, ASTC, BPTC, RGTC, PVRTC, S3TC, and S3TCSRB
        // ASTC - MAC
        // PVRTC - iOS y algunos Android
        // S3TCSRB/S3TCSRGB - SOs sobremesa y algunos Android
        // ETC1 - mayoria Android
        /*
        this.load.texture('dialog', {
            'ASTC': { type: 'PVR', textureURL: 'dialog-astc4x4/dialog-astc4x4.pvr', atlasURL: 'dialog-astc4x4/dialog-astc4x4.json' },
            'PVRTC': { type: 'PVR', textureURL: 'dialog-pvrtc/dialog-pvrtc.pvr', atlasURL: 'dialog-pvrtc/dialog-pvrtc.json' },
            'S3TCSRGB': { type: 'PVR', textureURL: 'dialog-dxt5/dialog-dxt5.pvr', atlasURL: 'dialog-dxt5/dialog-dxt5.json' },
            'IMG': { textureURL: 'dialog-img/dialog-img.png', atlasURL: 'dialog-img/dialog-img.json' },
        });
        */

        // Archivos de dialogos (estructura)
        this.load.setPath('localization');

        this.load.json('momDialog', 'momDialog.json');
        this.load.json('dadDialog', 'dadDialog.json');
        this.load.json('chat1', 'chat1.json');
        this.load.json('posts', 'posts.json');

        this.load.json('everydayDialog', 'everydayDialog.json');
        this.load.json('bedroomMorningDay1', 'day1/bedroomMorningDay1.json');
        this.load.json('livingroomMorningDay1', 'day1/livingroomMorningDay1.json');
    }

    loadSpinalAnims() {
        this.load.setPath('assets/characters');

        // Personajes y sus respectivas animaciones esqueletales de Spine
        // [Idle01, IdleBase, Walk]
        this.load.spine('mom', 'mom/Front.json', 'mom/Front.atlas');
        // [Idle01, IdleBase]
        this.load.spine('dad', 'dad/Front 34.json', 'dad/Front 34.atlas');
        // [Idle01, IdleBase]
        this.load.spine('Alex_front', 'Alex/Front 34.json', 'Alex/Front 34.atlas');
        // [IdleBase, Walk]
        this.load.spine('Alex_side', 'Alex/Side.json', 'Alex/Side.atlas');
        // [Idle01, IdleBase]
        this.load.spine('Alison', 'Alison/Front 34.json', 'Alison/Front 34.atlas');
        // [Idle01, IdleBase]
        this.load.spine('Ana', 'Ana/Front 34.json', 'Ana/Front 34.atlas');
        // [Idle01, IdleBase]
        this.load.spine('Guille', 'Guille/Front 34.json', 'Guille/Front 34.atlas');
        // [Idle01, IdleBase]
        this.load.spine('Jose', 'Jose/Front 34.json', 'Jose/Front 34.atlas');
        // [Idle01, IdleBase, IdlePhone]
        this.load.spine('Maria', 'Maria/Front 34.json', 'Maria/Front 34.atlas')
    }

    loadBackgrounds() {
        this.load.setPath('assets/backgrounds');

        // Habitacion
        this.load.image('bedroomCeiling', 'bedroom/bedroomCeiling.png');
        this.load.image('bedroomBg', 'bedroom/bedroomBase.png');
        /*
        this.load.image('bed', 'bedroom/bed.png');
        this.load.image('bag', 'bedroom/bag.png');
        this.load.image('bed_livingDoorClosed', 'bedroom/bedroomDoorClosed.png');
        this.load.image('bed_livingDoorOpened', 'bedroom/bedroomDoorOpened.png');
        this.load.image('bedroomChair', 'bedroom/bedroomChair.png');
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
        */
        this.load.atlas('bedroom', 'bedroom/bedroom.png', 'bedroom/bedroom.json');


        // Salon
        this.load.image('livingroomBg', 'livingroom/livingroomBg.png');
        /*
        this.load.image('living_bedDoorClosed', 'livingroom/bedroomDoorClosed.png');
        this.load.image('living_bedDoorOpened', 'livingroom/bedroomDoorOpened.png');
        this.load.image('living_playDoorClosed', 'livingroom/livingroomDoorClosed.png');
        this.load.image('living_playDoorOpened', 'livingroom/livingroomDoorOpened.png');
        */
        this.load.atlas('livingroom', 'livingroom/livingroom.png', 'livingroom/livingroom.json');

        // Patio
        this.load.image('playgroundClosed', 'playground/playgroundClosed.png');
        this.load.image('playgroundOpened', 'playground/playgroundOpened.png');
        // this.load.image('earring', 'playground/earring.png');

        // Escaleras
        this.load.image('stairsBg', 'stairs/stairsBg.png');
        this.load.image('stairsDoorClosed', 'stairs/stairsDoorClosed.png');
        this.load.image('stairsDoorOpened', 'stairs/stairsDoorOpened.png');

        // Pasillo
        this.load.image('corridorBg', 'corridor/corridorBg.png');
        this.load.atlas('corridor', 'corridor/corridor.png', 'corridor/corridor.json');
        /*
        this.load.image('boysDoorClosed', 'corridor/boysDoorClosed.png');
        this.load.image('boysDoorOpened', 'corridor/boysDoorOpened.png');
        this.load.image('girlsDoorClosed', 'corridor/girlsDoorClosed.png');
        this.load.image('girlsDoorOpened', 'corridor/girlsDoorOpened.png');
        this.load.image('classDoorClosed', 'corridor/classDoorClosed.png');
        this.load.image('classDoorOpened', 'corridor/classDoorOpened.png');
        */

        // Banos
        this.load.image('bathroomBg', 'bathroom/bathroomBg.png');
        this.load.atlas('bathroom', 'bathroom/bathroom.png', 'bathroom/bathroom.json');
        /*
        this.load.image('bathroomDoorClosed', 'bathroom/bathroomDoorClosed.png');
        this.load.image('bathroomDoorOpened', 'bathroom/bathroomDoorOpened.png');
        this.load.image('bathroomStall1Closed', 'bathroom/bathroomStall1Closed.png');
        this.load.image('bathroomStall1Opened', 'bathroom/bathroomStall1Opened.png');
        this.load.image('bathroomStall2Closed', 'bathroom/bathroomstall2Closed.png');
        this.load.image('bathroomStall2Opened', 'bathroom/bathroomstall2Opened.png');
        this.load.image('stall2', 'bathroom/stall2.png');
        this.load.image('stall3', 'bathroom/stall3.png');
        this.load.image('stolenPhone', 'bathroom/stolenPhone.png');
        */

        // Clase desde el frente
        this.load.image('classFrontBg', 'classFront/classFrontBg.png');
        this.load.atlas('classFront', 'classFront/classFront.png', 'classFront/classFront.json');
        // this.load.image('frontChar1', 'classFront/frontChar1.png');
        // this.load.image('frontChar2', 'classFront/frontChar2.png');
        // this.load.image('frontChar3', 'classFront/frontChar3.png');
        // this.load.image('frontChar4', 'classFront/frontChar4.png');
        // this.load.image('frontChar5', 'classFront/frontChar5.png');
        // this.load.image('frontChar6', 'classFront/frontChar6.png');
        // this.load.image('frontChar7', 'classFront/frontChar7.png');
        // this.load.image('frontChar8', 'classFront/frontChar8.png');
        // this.load.image('frontChar9', 'classFront/frontChar9.png');
        // this.load.image('frontChar10', 'classFront/frontChar10.png');
        // this.load.image('frontChar11', 'classFront/frontChar11.png');
        // this.load.image('frontChar12', 'classFront/frontChar12.png');
        // this.load.image('frontChar13', 'classFront/frontChar13.png');
        // this.load.image('frontChar14', 'classFront/frontChar14.png');
        // this.load.image('frontChar15', 'classFront/frontChar15.png');
        this.load.image('frontRow1Chairs', 'classFront/desks/frontRow1Chairs.png');
        this.load.image('frontRow1Tables', 'classFront/desks/frontRow1Tables.png');
        this.load.image('frontRow2Chairs', 'classFront/desks/frontRow2Chairs.png');
        this.load.image('frontRow2Tables', 'classFront/desks/frontRow2Tables.png');
        this.load.image('frontRow3Chairs', 'classFront/desks/frontRow3Chairs.png');
        this.load.image('frontRow3Tables', 'classFront/desks/frontRow3Tables.png');
        this.load.image('frontRow4Chairs', 'classFront/desks/frontRow4Chairs.png');
        this.load.image('frontRow4Tables', 'classFront/desks/frontRow4Tables.png');
        this.load.image('frontRow5Chairs', 'classFront/desks/frontRow5Chairs.png');
        this.load.image('frontRow5Tables', 'classFront/desks/frontRow5Tables.png');

        // Clase desde el fondo
        this.load.image('classBackBg', 'classBack/classBackBg.png');
        this.load.image('backRow1Chairs', 'classBack/desks/backRow1Chairs.png');
        this.load.image('backRow1Tables', 'classBack/desks/backRow1Tables.png');
        this.load.image('backRow2Chairs', 'classBack/desks/backRow2Chairs.png');
        this.load.image('backRow2Tables', 'classBack/desks/backRow2Tables.png');
        this.load.image('backRow3Chairs', 'classBack/desks/backRow3Chairs.png');
        this.load.image('backRow3Tables', 'classBack/desks/backRow3Tables.png');
        this.load.image('backRow4Chairs', 'classBack/desks/backRow4Chairs.png');
        this.load.image('backRow4Tables', 'classBack/desks/backRow4Tables.png');
        this.load.image('backRow5Chairs', 'classBack/desks/backRow5Chairs.png');
        this.load.image('backRow5Tables', 'classBack/desks/backRow5Tables.png');
        this.load.atlas('classBack', 'classBack/classBack.png', 'classBack/classBack.json');
        // this.load.image('backChar1', 'classBack/backChar1.png');
        // this.load.image('backChar2', 'classBack/backChar2.png');
        // this.load.image('backChar3', 'classBack/backChar3.png');
        // this.load.image('backChar4', 'classBack/backChar4.png');
        // this.load.image('backChar5', 'classBack/backChar5.png');
        // this.load.image('backChar6', 'classBack/backChar6.png');
        // this.load.image('backChar7', 'classBack/backChar7.png');
        // this.load.image('backChar8', 'classBack/backChar8.png');
        // this.load.image('backChar9', 'classBack/backChar9.png');
        // this.load.image('backChar10', 'classBack/backChar10.png');
        // this.load.image('backChar11', 'classBack/backChar11.png');
        // this.load.image('backChar12', 'classBack/backChar12.png');
        // this.load.image('backChar13', 'classBack/backChar13.png');
        // this.load.image('backChar14', 'classBack/backChar14.png');
        // this.load.image('backChar15', 'classBack/backChar15.png');
        // this.load.image('blackboardPic1', 'classBack/blackboardPic1.png');
        // this.load.image('blackboardPic2', 'classBack/blackboardPic2.png');
        // this.load.image('blackboardPic3', 'classBack/blackboardPic3.png');
        // this.load.image('class_corridorDoorClosed', 'classBack/classDoorClosed.png');
        // this.load.image('class_corridorDoorOpened', 'classBack/classDoorOpened.png');

        // Pesadillas
        this.load.image('nightmaresBg', 'nightmares/nightmaresBg.png');
        // this.load.image('gum', 'nightmares/gum.png');
        // this.load.image('gumChair', 'nightmares/gumChair.png');
        // this.load.image('nightmaresChair', 'nightmares/nightmaresChair.png');
    }

    loadCreditsSceneAssets() {
        this.load.setPath('assets/UI/creditsScene');
        this.load.atlas('someBrands', 'brands/someBrands.png', 'brands/someBrands.json');
        this.load.image('logo_e-ucm', 'brands/logo e-ucm.png');
        this.load.image('logo_rage', 'brands/logo rage.png');
        this.load.image('logo_ucm', 'brands/logo_ucm.png');
        this.load.atlas('ucm', 'medals.png', 'medals.json');
    }

    preload() {
        this.loadComputersAssets();
        this.loadPhoneAssets();
        this.loadFlags();
        this.loadAvatars();
        this.loadDialogs();
        this.loadSpinalAnims();
        this.loadBackgrounds();
        this.loadCreditsSceneAssets();

        this.load.setPath('assets');

        // Test
        this.load.image('bg', 'patio.png');

        this.loadPlugins();
    }

    create() {
        let gameManager = GameManager.create(this);

        gameManager.startLangMenu();
    }
}