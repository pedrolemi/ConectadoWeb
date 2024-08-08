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

    createLoadingBar() {
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        // Fondo escalado en cuanto al canvas
        let bg = this.add.image(width / 2, height / 2, 'basePC');
        let scale = width / bg.width;
        bg.setScale(scale);

        // Fondo de la pantalla
        let screenBg = this.add.rectangle(width / 2, 0, width, height / 1.2, 0x2B9E9E).setOrigin(0.5, 0);

        // Pantalla del ordenador con el tam del canvas
        let screen = this.add.image(width / 2, height / 2, 'PCscreen');
        screen.setDisplaySize(width, height);

        let progressBox = this.add.graphics();
        let progressBar = this.add.graphics();

        let BAR_W = width * 0.6;
        let BAR_H = 70;
        let BAR_OFFSET = 40;
        let FILL_OFFSET = 20;
        let TEXT_OFFSET = 70;
        let bgCol = 0xFF408E86;
        let fillCol = 0xFF004E46;
        let borderCol = 0xFF004E46;
        let borderThickness = 2;
        let radius = Math.min(BAR_W, BAR_H) * 0.25;

        progressBox.fillStyle(bgCol, 1).fillRoundedRect(width / 2 - BAR_W / 2, height / 2 - BAR_H / 2 - BAR_OFFSET, BAR_W, BAR_H, radius)
            .lineStyle(borderThickness, borderCol, 1).strokeRoundedRect(width / 2 - BAR_W / 2, height / 2 - BAR_H / 2 - BAR_OFFSET, BAR_W, BAR_H, radius)


        // Texto de la palabra cargando
        let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - TEXT_OFFSET - BAR_OFFSET,
            text: 'Loading...',
            style: {
                fontFamily: 'gidole-regular',
                fontSize: '30px',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        // Texto con el porcentaje de los assets cargados
        let percentText = this.make.text({
            x: width / 2,
            y: height / 2 - BAR_OFFSET,
            text: '0%',
            style: {
                fontFamily: 'gidole-regular',
                fontSize: '20px',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        // Texto para el nombre de los archivos
        let assetText = this.make.text({
            x: width / 2,
            y: height / 2 + TEXT_OFFSET - BAR_OFFSET,
            text: '',
            style: {
                fontFamily: 'gidole-regular',
                fontSize: '20px',
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        // Se va actualizando la barra de progreso y el texto con el porcentaje
        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');

            progressBar.clear();
            progressBar.fillStyle(fillCol, 1);
            progressBar.fillRoundedRect(width / 2 - (BAR_W - FILL_OFFSET) / 2, height / 2 - (BAR_H - FILL_OFFSET) / 2 - BAR_OFFSET, (BAR_W - FILL_OFFSET) * value, BAR_H - FILL_OFFSET, radius);
        });
        // Cuando carga un archivo, muestra el nombre del archivo debajo de la barra
        this.load.on('fileprogress', function (file) {
            // console.log(file.key);
            assetText.setText('Loading asset: ' + file.key);
        });

        // Cuando se termina de cargar todo, se borran los elementos de la barra
        this.load.once('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
            bg.destroy();
            screenBg.destroy();
            screen.destroy();
        });
    }

    loadLoadingBarAssets() {
        this.load.setPath('assets/UI/computer');

        this.load.image('basePC', 'backgrounds/basePCsq.png');
        this.load.image('PCscreen', 'backgrounds/screenWithoutBlack.png');
    }

    loadComputersAssets() {
        this.load.setPath('assets/UI/computer');

        // Fondos del ordenador
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
        this.load.image('commentBubble', '9sliceComments.png');
        this.load.atlas('computerElements', 'computerElements.png', 'computerElements.json');

        // Posts
        this.load.atlas('photos', 'photos.png', 'photos.json');
    }

    loadPhoneAssets() {
        this.load.setPath('assets/UI/phone');

        // Telefono
        this.load.image('phone', 'phone.png');

        // Botones del telefono
        this.load.atlas('phoneElements', 'phoneElements.png', 'phoneElements.json');

        this.load.image('myBubble', '9slicePlayer.png');
        this.load.image('othersBubble', '9sliceOthers.png');
    }

    loadFlags() {
        this.load.setPath('assets/UI/flags');

        // Banderas idiomas
        this.load.atlas('flags', 'flags.png', 'flags.json');
    }

    loadAvatars() {
        this.load.setPath('assets/UI/avatars');

        // Avatares de los personajes
        this.load.atlas('avatars', 'avatars.png', 'avatars.json');
    }

    loadPlugins(dialogsAndNamespaces, onlyNamespaces) {
        let namespaces = [...onlyNamespaces];

        dialogsAndNamespaces.forEach((dialog) => {
            // Quitar extension
            let dialogWithoutExtension = dialog.substr(0, dialog.lastIndexOf('.'));
            // Cambiar / por \\
            let dialogAux = dialogWithoutExtension.replace('/', '\\');
            // Se juntan los archivos de dialogos, que tienen tanto archivos de estructura como namespaces,
            // con los archivos que solo son namespaces
            namespaces.push(dialogAux);
        });

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
            supportedLngs: ['en', 'es', 'fr'],
            // Namespaces que se cargan para cada uno de los idiomas
            ns: namespaces,
            preload: ['en', 'es', 'fr'],
            // Mostrar informacion de ayuda por consola
            debug: false,
            // Cargar las traducciones de un servidor especificado en vez de ponerlas directamente
            backend: {
                // La ruta desde donde cargamos las traducciones
                // {{lng}} --> nombre carpeta de cada uno de los idiomas
                // {{ns}} --> nombre carpeta de cada uno de los namespaces
                loadPath: 'localization/{{lng}}/{{ns}}.json'
            }
        })
    }

    loadDialogs(dialogsAndNamespaces) {
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

        dialogsAndNamespaces.forEach((dialog) => {
            // Quitar extension
            let dialogWithoutExtension = dialog.substr(0, dialog.lastIndexOf('.'));
            // Quedarse con la ultima parte del paht, que corresponde con el id del archivo
            let subPaths = dialogWithoutExtension.split('/');
            let name = subPaths[subPaths.length - 1];
            this.load.json(name, dialog);
        });

    }

    loadCharacters() {
        this.load.setPath('assets/characters');

        this.load.atlas('characters', 'characters.png', 'characters.json');

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
        this.load.atlas('bedroom', 'bedroom/bedroom.png', 'bedroom/bedroom.json');

        // Salon
        this.load.image('livingroomBg', 'livingroom/livingroomBg.png');
        this.load.atlas('livingroom', 'livingroom/livingroom.png', 'livingroom/livingroom.json');

        // Autobus
        this.load.spritesheet('bus', 'bus.png', { frameWidth: 632, frameHeight: 341 });

        // Patio
        this.load.image('playgroundClosed', 'playground/playgroundClosed.png');
        this.load.image('playgroundOpened', 'playground/playgroundOpened.png');
        this.load.image('earring', 'playground/earring.png');

        // Escaleras
        this.load.image('stairsBg', 'stairs/stairsBg.png');
        this.load.image('stairsDoorClosed', 'stairs/stairsDoorClosed.png');
        this.load.image('stairsDoorOpened', 'stairs/stairsDoorOpened.png');

        // Pasillo
        this.load.image('corridorBg', 'corridor/corridorBg.png');
        this.load.atlas('corridor', 'corridor/corridor.png', 'corridor/corridor.json');

        // Banos
        this.load.image('bathroomBg', 'bathroom/bathroomBg.png');
        this.load.atlas('bathroom', 'bathroom/bathroom.png', 'bathroom/bathroom.json');

        // Clase desde el frente
        this.load.image('classFrontBg', 'classFront/classFrontBg.png');
        this.load.atlas('classFront', 'classFront/classFront.png', 'classFront/classFront.json');
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

        // Pesadillas
        this.load.atlas('nightmaresElements', 'nightmares/nightmaresElements.png', 'nightmares/nightmaresElements.json');
        this.load.image('nightmaresBg', 'nightmares/nightmareClass.png');
    }

    loadCreditsSceneAssets() {
        this.load.setPath('assets/UI/creditsScene');
        this.load.atlas('someBrands', 'brands/someBrands.png', 'brands/someBrands.json');
        this.load.image('logo_rage', 'brands/logo_rage.png');
        this.load.image('logo_ucm', 'brands/logo_ucm.png');
        this.load.image('beaconing', 'brands/beaconing.png');
        this.load.atlas('medals', 'medals.png', 'medals.json');
        this.load.image('rewind', 'rewind.png');
    }

    loadRestAssets() {
        this.createLoadingBar();

        // Son tanto archivos de dialogos como namespaces del plugin i18next
        // Ruta archivo dialogo --> test/dialog.json
        // ID archivo dialogo --> dialog
        // Namespace --> test\\dialog.json
        let dialogsAndNamespaces = [
            // Ordenador
            'computer/posts.json',
            'computer/requests.json',

            // Dialogos de todos los dias
            'everydayDialog.json',

            // Dia 1
            'day1/bedroomMorningDay1.json',
            'day1/livingroomMorningDay1.json',
            'day1/playgroundMorningDay1.json',
            'day1/corridorMorningDay1.json',
            'day1/classFrontMorningDay1.json',
            'day1/classBackMorningDay1.json',
            'day1/classBackBreakDay1.json',
            'day1/corridorBreakDay1.json',
            'day1/playgroundBreakDay1.json',
            'day1/livingroomAfternoonDay1.json',
            'day1/bedroomAfternoonDay1.json',
            'day1/nightmareDay1.json',

            // Dia 2
            'day2/bedroomMorningDay2.json',
            'day2/livingroomMorningDay2.json',
            'day2/playgroundMorningDay2.json',
            'day2/corridorMorningDay2.json',
            'day2/classBackBreakDay2.json',
            'day2/corridorBreakDay2.json',
            'day2/bathroomBreakDay2.json',
            'day2/playgroundBreakDay2.json',
            'day2/playgroundAfternoonDay2.json',
            'day2/livingroomAfternoonDay2.json',
            'day2/bedroomAfternoonDay2.json',
            'day2/nightmareDay2.json',

            // Dia 3
            'day3/bedroomMorningDay3.json',
            'day3/livingroomMorningDay3.json',
            'day3/playgroundMorningDay3.json',
            'day3/corridorMorningDay3.json',
            'day3/classCorridorAfternoonDay3.json',
            'day3/bathroomAfternoonDay3.json',
            'day3/livingroomAfternoonDay3.json',
            'day3/bedroomAfternoonDay3.json',
            'day3/nightmareDay3.json',

            // Dia 4
            'day4/bedroomMorningDay4.json',
            'day4/livingroomMorningDay4.json',
            'day4/playgroundMorningDay4.json',
            'day4/stairsMorningDay4.json',
            'day4/corridorMorningDay4.json',
            'day4/classBackBreakDay4.json',
            'day4/corridorBreakDay4.json',
            'day4/bathroomBreakDay4.json',
            'day4/stairsBreakDay4.json',
            'day4/playgroundBreakDay4.json',
            'day4/playgroundAfternoonDay4.json',
            'day4/livingroomAfternoonDay4.json',
            'day4/bedroomAfternoonDay4.json',
            'day4/nightmareDay4.json',

            // Dia 5
            'day5/bedroomMorningDay5.json',
            'day5/playgroundMorningDay5.json',
            'day5/stairsMorningDay5.json',
            'day5/corridorMorningDay5.json',
            'day5/classCorridorAfternoonDay5.json',
            'day5/bathroomAfternoonDay5.json',
            'day5/nightmareDay5.json'
        ]
        // Solo son namespaces del plugin i18next
        // El nombre corresponde tal cual con el namespace (incluye \\ si es necesario)
        let onlyNamespaces = [
            // Menus
            'menus\\titleMenu',
            'menus\\loginMenu',
            'menus\\creditsScene',

            // Nombres
            'names',

            // Movil
            'phoneInfo',

            // Ordenador
            'computer\\computerInfo',

            // Escenas de transicion
            'transitionScenes',
        ]

        this.loadComputersAssets();
        this.loadPhoneAssets();
        this.loadFlags();
        this.loadAvatars();
        this.loadDialogs(dialogsAndNamespaces);
        this.loadCharacters();
        this.loadBackgrounds();
        this.loadCreditsSceneAssets();

        this.load.setPath('assets');
        this.load.image('defaultParticle', 'defaultParticle.png');

        this.loadPlugins(dialogsAndNamespaces, onlyNamespaces);

        // Indica al LoadPlugin que hay que cargar los assets que se encuentran en la cola
        // Despues del preload este metodo se llama automaticamente, pero si se quieren cargar assets en otra parte hay que llamarlo manualmente
        this.load.start();

        this.load.once('complete', () => {
            this.events.emit('start');
        });
    }

    preload() {
        this.loadLoadingBarAssets();

        // Nota: aunque este metodo se encuentra en el preload, verdaderamente se ejecuta en la etapa de create
        this.load.once('complete', () => {
            this.loadRestAssets();
        });
    }

    create() {
        this.events.once('start', () => {
            // Se crea la animacion del autobus en la primera escena para no tener que crearla de nuevo
            this.anims.create({
                key: 'moving',
                frames: this.anims.generateFrameNumbers('bus', { start: 0, end: 1 }),
                frameRate: 3,
                repeat: -1
            });
            
            let gameManager = GameManager.create(this);
            gameManager.startLangMenu();
        })
    }
}