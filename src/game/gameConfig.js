// Carga de assets
import BootScene from "./scenes/bootScene.js";
import PreloaderScene from "./scenes/preloaderScene.js";

// Menus
import LanguageMenu from "./scenes/menus/languageMenu.js";
import MainMenu from "./scenes/menus/mainMenu.js";
import Credits from "./scenes/menus/credits.js";

// Escenas del flujo de juego
import AlarmScene from "./scenes/gameLoop/alarmScene.js";

    // Dia 1
    import BedroomMorningDay1 from "./scenes/gameLoop/day1/bedroomMorningDay1.js";
    import LivingroomMorningDay1 from "./scenes/gameLoop/day1/livingroomMorningDay1.js";
    import NightmareDay1 from "./scenes/gameLoop/day1/nightmareDay1.js";

// UI
import UI from "./UI/UI.js";

// Escenas que se pintan por encima de la UI
import TextOnlyScene from "./scenes/gameLoop/textOnlyScene.js";
import BusScene from "./scenes/gameLoop/busScene.js";



const MAX_W = 1129, MAX_H = 847, MIN_W = 320, MIN_H = 240;
const CONFIG = {
    width: MAX_W,
    height: MAX_H,
    backgroundColor: "#000000",
    version: "1.0",
    type: Phaser.AUTO,

    // Nota: el orden de las escenas es relevante, y las que se encuentren antes en el array se renderizaran por debajo de las siguientes
    scene: [
        // Carga de assets
        BootScene, PreloaderScene,

        LanguageMenu, MainMenu, Credits,

        AlarmScene,

        BedroomMorningDay1, LivingroomMorningDay1, NightmareDay1,

        UI,
        TextOnlyScene, BusScene
    ],
    autoFocus: true,
    // Desactivar que aparezca el menu de inspeccionar al hacer click derecho
    disableContextMenu: true,
    render: {
        antialias: true,
        transparent: true,
        roundPixels: true,
    },
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,   // CENTER_BOTH, CENTER_HORIZONTALLY, CENTER_VERTICALLY
        mode: Phaser.Scale.FIT,                 // ENVELOP, FIT, HEIGHT_CONTROLS_WIDTH, NONE, RESIZE, WIDTH_CONTROLS_HEIGHT
        min: {
            width: MIN_W,
            height: MIN_H
        },
        max: {
            width: MAX_W,
            height: MAX_H,
        },
        zoom: 1,
        parent: "game",
    },
    physics: {
        default: "arcade"
    },
    plugins: {
        // Plugin para utilizar animaciones esqueletales creadas con Spine
        scene: [
            { key: "SpinePlugin", plugin: window.SpinePlugin, mapping: "spine" }
        ]
    },
}

gameDebug.enable = false;
gameDebug.enableText = false;
const GAME = new Phaser.Game(CONFIG);