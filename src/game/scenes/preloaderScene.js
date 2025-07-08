import BasePreloaderScene from "../../framework/scenes/basePreloaderScene.js";
import DialogManager from "../managers/dialogManager.js";
import GameManager from "../managers/gameManager.js";

export default class PreloaderScene extends BasePreloaderScene {
    init() {
        super.init();
        this.DEFAULT_LOADING_BAR_CONFIG.y = this.CANVAS_HEIGHT * 0.43;
        this.DEFAULT_LOADING_BAR_CONFIG.bgColor = 0xFF408E86;
        this.DEFAULT_LOADING_BAR_CONFIG.fillColor = 0xFF004E46;

        this.DEFAULT_TEXT_CONFIG.style.fontFamily = "gidole-regular";
        this.DEFAULT_TEXT_CONFIG.style.fontSize = "20px";
        this.DEFAULT_TEXT_CONFIG.style.fontStyle = "normal";

        this.i18nConfig = {
            defaultLanguage: "en",
            supportedLanguages: ['en', 'es', 'fr', 'pt-BR', 'cn-CN', 'cn-HK'],
        }
        
        // Fondo escalado en cuanto al canvas
        let bg = this.add.image(0, 0, "basePC").setOrigin(0, 0);
        let scale = this.CANVAS_WIDTH / bg.width;
        bg.setScale(scale); 

        // Pantalla del ordenador con el tam del canvas
        let screen = this.add.image(0, 0, "PCscreen").setOrigin(0, 0);
        screen.setDisplaySize(this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

        this.createLoadingBar();
    }

    preload() {
        let dialogNamespaces = [
        ];
        let basicNamespaces = [
            "menus/titleMenu"
        ]

        let loadAssets = () => {
            this.loadComputersAssets();
            // this.loadPhoneAssets();
            this.loadFlags();
            // this.loadAvatars();
            // this.loadCharacters();
            this.loadBackgrounds();
            // this.loadCreditsSceneAssets();

            this.load.setPath("assets");
            this.load.image("defaultParticle", "defaultParticle.png");

            this.load.setPath("");
        }

        super.preload(loadAssets, dialogNamespaces, basicNamespaces);
    }

    create() {
        super.create();

        let dialogManager = DialogManager.create();
        dialogManager.init();

        let gameManager = GameManager.create();
        gameManager.init();
    }

    loadComputersAssets() {
        this.load.setPath("assets/UI/computer");

        // Fondos del ordenador
        this.load.image("loginBg", "backgrounds/loginBackground.png");
        this.load.image("computerMainView", "backgrounds/mainViewBackground.png");

        // Elementos del menu principal
        this.load.image("powerOff", "titleMenu/power_off.png");
        this.load.image("logoWT", "titleMenu/logoWT.png");

        // Elementos del menu de login
        this.load.image("backButton", "loginMenu/backChatButton.png");
        this.load.image("boyIcon", "loginMenu/chicoSelect.png");
        this.load.image("girlIcon", "loginMenu/chicaSelect.png");

        // Elementos del menu del ordenador
        this.load.image("commentBubble", "9sliceComments.png");
        this.load.atlas("computerElements", "computerElements.png", "computerElements.json");

        // Posts
        this.load.atlas("photos", "photos.png", "photos.json");
    }

    loadPhoneAssets() {
        this.load.setPath("assets/UI/phone");

        // Telefono
        this.load.image("phone", "phone.png");

        // Botones del telefono
        this.load.atlas("phoneElements", "phoneElements.png", "phoneElements.json");

        this.load.image("myBubble", "9slicePlayer.png");
        this.load.image("othersBubble", "9sliceOthers.png");
    }

    loadFlags() {
        this.load.setPath("assets/UI/flags");

        // Banderas idiomas
        this.load.atlas("flags", "flags.png", "flags.json");
    }

    loadAvatars() {
        this.load.setPath("assets/UI/avatars");

        // Avatares de los personajes
        this.load.atlas("avatars", "avatars.png", "avatars.json");
    }

    loadCharacters() {
        // Personajes planos sin animaciones
        this.load.setPath("assets/characters/plains");

        this.load.atlas("someCharacters", "someCharacters.png", "someCharacters.json");
        this.load.image("teacherChar", "teacher.png");
        this.load.image("AlexChar", "Alex.png");

        // Personajes y sus respectivas animaciones esqueletales de Spine
        this.load.setPath("assets/characters/Spine");

        // [Idle01, IdleBase, Walk]
        this.load.spine("mom", "mom/Front.json", "mom/Front.atlas");

        // [Idle01, IdleBase]
        this.load.spine("dad", "dad/Front 34.json", "dad/Front 34.atlas");

        // [Idle01, IdleBase]
        this.load.spine("Alex_front", "Alex/Front 34.json", "Alex/Front 34.atlas");

        // [IdleBase, Walk]
        this.load.spine("Alex_side", "Alex/Side.json", "Alex/Side.atlas");

        // [Idle01, IdleBase]
        this.load.spine("Alison", "Alison/Front 34.json", "Alison/Front 34.atlas");

        // [Idle01, IdleBase]
        this.load.spine("Ana", "Ana/Front 34.json", "Ana/Front 34.atlas");

        // [Idle01, IdleBase]
        this.load.spine("Guille", "Guille/Front 34.json", "Guille/Front 34.atlas");

        // [Idle01, IdleBase]
        this.load.spine("Jose", "Jose/Front 34.json", "Jose/Front 34.atlas");

        // [Idle01, IdleBase, IdlePhone]
        this.load.spine("Maria", "Maria/Front 34.json", "Maria/Front 34.atlas")
    }

    loadBackgrounds() {
        this.load.setPath("assets/backgrounds");

        // Habitacion
        this.load.image("bedroomCeiling", "bedroom/bedroomCeiling.png");
        this.load.image("bedroomBg", "bedroom/bedroomBase.png");
        this.load.atlas("bedroom", "bedroom/bedroom.png", "bedroom/bedroom.json");

        // Salon
        this.load.image("livingroomBg", "livingroom/livingroomBg.png");
        this.load.atlas("livingroom", "livingroom/livingroom.png", "livingroom/livingroom.json");

        // Autobus
        this.load.spritesheet("bus", "bus.png", { frameWidth: 632, frameHeight: 341 });

        // Patio
        this.load.image("playgroundClosed", "playground/playgroundClosed.png");
        this.load.image("playgroundOpened", "playground/playgroundOpened.png");
        this.load.image("earring", "playground/earring.png");

        // Escaleras
        this.load.image("stairsBg", "stairs/stairsBg.png");
        this.load.image("stairsDoorClosed", "stairs/stairsDoorClosed.png");
        this.load.image("stairsDoorOpened", "stairs/stairsDoorOpened.png");

        // Pasillo
        this.load.image("corridorBg", "corridor/corridorBg.png");
        this.load.atlas("corridor", "corridor/corridor.png", "corridor/corridor.json");

        // Banos
        this.load.image("restroomBg", "restroom/restroomBg.png");
        this.load.atlas("restroom", "restroom/restroom.png", "restroom/restroom.json");

        // Clase desde el frente
        this.load.image("classFrontBg", "classFront/classFrontBg.png");
        this.load.atlas("classFront", "classFront/classFront.png", "classFront/classFront.json");
        this.load.image("frontRow1Chairs", "classFront/desks/frontRow1Chairs.png");
        this.load.image("frontRow1Tables", "classFront/desks/frontRow1Tables.png");
        this.load.image("frontRow2Chairs", "classFront/desks/frontRow2Chairs.png");
        this.load.image("frontRow2Tables", "classFront/desks/frontRow2Tables.png");
        this.load.image("frontRow3Chairs", "classFront/desks/frontRow3Chairs.png");
        this.load.image("frontRow3Tables", "classFront/desks/frontRow3Tables.png");
        this.load.image("frontRow4Chairs", "classFront/desks/frontRow4Chairs.png");
        this.load.image("frontRow4Tables", "classFront/desks/frontRow4Tables.png");
        this.load.image("frontRow5Chairs", "classFront/desks/frontRow5Chairs.png");
        this.load.image("frontRow5Tables", "classFront/desks/frontRow5Tables.png");

        // Clase desde el fondo
        this.load.image("classBackBg", "classBack/classBackBg.png");
        this.load.image("backRow1Chairs", "classBack/desks/backRow1Chairs.png");
        this.load.image("backRow1Tables", "classBack/desks/backRow1Tables.png");
        this.load.image("backRow2Chairs", "classBack/desks/backRow2Chairs.png");
        this.load.image("backRow2Tables", "classBack/desks/backRow2Tables.png");
        this.load.image("backRow3Chairs", "classBack/desks/backRow3Chairs.png");
        this.load.image("backRow3Tables", "classBack/desks/backRow3Tables.png");
        this.load.image("backRow4Chairs", "classBack/desks/backRow4Chairs.png");
        this.load.image("backRow4Tables", "classBack/desks/backRow4Tables.png");
        this.load.image("backRow5Chairs", "classBack/desks/backRow5Chairs.png");
        this.load.image("backRow5Tables", "classBack/desks/backRow5Tables.png");
        this.load.atlas("classBack", "classBack/classBack.png", "classBack/classBack.json");

        // Pesadillas
        this.load.atlas("nightmaresElements", "nightmares/nightmaresElements.png", "nightmares/nightmaresElements.json");
        this.load.image("nightmaresBg", "nightmares/nightmareClass.png");
    }

    loadCreditsSceneAssets() {
        this.load.setPath("assets/UI/creditsScene");
        this.load.atlas("someBrands", "brands/someBrands.png", "brands/someBrands.json");
        this.load.image("logo_rage", "brands/logo_rage.png");
        this.load.image("logo_ucm", "brands/logo_ucm.png");
        this.load.image("beaconing", "brands/beaconing.png");
        this.load.atlas("medals", "medals.png", "medals.json");
        this.load.image("rewind", "rewind.png");
    }

}