import GameManager from '../managers/gameManager.js';

export default class BootScene extends Phaser.Scene {
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
        this.load.setPath('./assets');

        // Caja de texto y de opcion multiple
        /*
        this.load.image('textbox', 'textbox.png');
        this.load.image('textboxName', 'textboxName.png');
        this.load.image('option', 'optionBg.png');
        */
        this.load.image('textboxMask', './UI/dialog/textboxMask.png');

        // Telefono
        this.load.image('phoneIcon', './UI/phone/phoneIcon.png');
        this.load.image('phone', './UI/phone/phone.png');
        this.load.image('alarmBg', './UI/phone/alarmBg.png');
        this.load.image('mainScreenBg', './UI/phone/mainScreenBg.png');
        this.load.image('statusBG', './UI/phone/statusBG.png');
        this.load.image('messagesBg', './UI/phone/messagesBg.png');
        this.load.image('chatBG', './UI/phone/chatBG.png');

        // Botones del telefono
        this.load.image('returnButton', './UI/phone/triangle.png');
        this.load.image('homeButton', './UI/phone/circle.png');
        this.load.image('uselessButton', './UI/phone/square.png');
        
        this.load.image('statusIcon', './UI/phone/statusIcon.png');
        this.load.image('chatIcon', './UI/phone/chatIcon.png');
        this.load.image('settingsIcon', './UI/phone/settingsIcon.png');



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

        // Fondos
        this.load.image('basePC', 'languageMenu/BasePCsq.png');
        this.load.image('PCscreen', 'languageMenu/ScreenWithoutBlack.png');

        // Menu principal
        this.load.image('powerOff', 'titleMenu/power_off.png');
        this.load.image('logoWT', 'titleMenu/logoWT.png');

        // Menu donde introducir la informacion
        this.load.image('loginBg', 'userInfoMenu/LoginBackground.png');
        this.load.image('backButton', 'userInfoMenu/backChatButton.png');
        this.load.image('boyIcon', 'userInfoMenu/ChicoSelect.png');
        this.load.image('girlIcon', 'userInfoMenu/ChicaSelect.png');

        // Banderas idiomas
        this.load.image('frFlag', 'languageMenu/frFlag.png');
        this.load.image('spFlag', 'languageMenu/spFlag.png');
        this.load.image('ukFlag', 'languageMenu/ukFlag.png');

        // Test
        this.load.image('bg', 'patio.png');

        // Personajes y sus respectivas animaciones esqueletales de Spine
        // [Idle01, IdleBase, Walk]
        this.load.spine("mom", 'characters/mom/Front.json', 'characters/mom/Front.atlas')
        // [Idle01, IdleBase]
        this.load.spine("dad", 'characters/dad/Front 34.json', 'characters/dad/Front 34.atlas')

        // PLUGINS
        // Precarga el plugin para hacer fade de colores
        // (sin el plugin el fade colores funciona algo mal)
        this.load.plugin('rextintrgbplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextintrgbplugin.min.js', true);

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
            ns: ['test1', 'test2'],
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


    }

    create() {
        let gameManager = GameManager.create(this);
        gameManager.startLangMenu();
    }

}