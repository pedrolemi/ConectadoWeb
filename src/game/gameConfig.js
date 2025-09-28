// Carga de assets
import BootScene from "./scenes/bootScene.js";
import PreloaderScene from "./scenes/preloaderScene.js";

// Menus
import LanguageMenu from "./scenes/menus/languageMenu.js";
import MainMenu from "./scenes/menus/mainMenu.js";
import Credits from "./scenes/menus/credits.js";

// Escenas del flujo de juego
import AlarmScene from "./scenes/gameLoop/alarmScene.js";
import RestroomBase from "./scenes/gameLoop/baseScenarios/restroomBase.js";

    // Dia 1
    import BedroomMorningDay1 from "./scenes/gameLoop/day1/bedroomMorningDay1.js";
    import LivingroomMorningDay1 from "./scenes/gameLoop/day1/livingroomMorningDay1.js";
    import PlaygroundMorningDay1 from "./scenes/gameLoop/day1/playgroundMorningDay1.js";
    import StairsMorningDay1 from "./scenes/gameLoop/day1/stairsMorningDay1.js";
    import CorridorMorningDay1 from "./scenes/gameLoop/day1/corridorMorningDay1.js";
    import ClassFrontMorningDay1 from "./scenes/gameLoop/day1/classFrontMorningDay1.js";
    import ClassBackMorningDay1 from "./scenes/gameLoop/day1/classBackMorningDay1.js";
    import ClassBackBreakDay1 from "./scenes/gameLoop/day1/classBackBreakDay1.js";
    import CorridorBreakDay1 from "./scenes/gameLoop/day1/corridorBreakDay1.js";
    import StairsBreakDay1 from "./scenes/gameLoop/day1/stairsBreakDay1.js";
    import PlaygroundBreakDay1 from "./scenes/gameLoop/day1/playgroundBreakDay1.js";
    import PlaygroundAfternoonDay1 from "./scenes/gameLoop/day1/playgroundAfternoonDay1.js";

    import NightmareDay1 from "./scenes/gameLoop/day1/nightmareDay1.js";
    

    // Dia 4
    import OppositeRestroom from "./scenes/gameLoop/oppositeRestroom.js";
    
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
    version: "2.0",
    type: Phaser.AUTO,

    // Nota: el orden de las escenas es relevante, y las que se encuentren antes en el array se renderizaran por debajo de las siguientes
    scene: [
        // Carga de assets
        BootScene, PreloaderScene,

        LanguageMenu, MainMenu, Credits,

        AlarmScene, RestroomBase,

        // Dia 1
        BedroomMorningDay1, LivingroomMorningDay1, NightmareDay1, PlaygroundMorningDay1, StairsMorningDay1, CorridorMorningDay1, ClassFrontMorningDay1, ClassBackMorningDay1, ClassBackBreakDay1, CorridorBreakDay1, StairsBreakDay1, PlaygroundBreakDay1, PlaygroundAfternoonDay1,

        // Dia 4
        OppositeRestroom,

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
            {
                key: PreloaderScene.SPINE_PLUGIN_KEY,
                plugin: window.SpinePlugin,
                mapping: "spine"
            }
        ]
    },
}

gameDebug.enable = false;
gameDebug.enableText = false;
const GAME = new Phaser.Game(CONFIG);