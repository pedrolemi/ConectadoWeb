import BootScene from './scenes/bootScene.js';

// Menus
import LanguageMenu from './scenes/menus/languageMenu.js';
import TitleMenu from './scenes/menus/titleMenu.js';
import LoginMenu from './scenes/menus/loginMenu.js';
import CreditsScene from './scenes/menus/creditsScene.js';

// Flujo de juego
import TextOnlyScene from './scenes/gameLoop/textOnlyScene.js';
import AlarmScene from './scenes/gameLoop/alarmScene.js';
import BusScene from './scenes/gameLoop/busScene.js';
import RestroomBase from './scenes/gameLoop/baseScenarios/restroomBase.js';
import OppositeRestroom from './scenes/gameLoop/oppositeRestroom.js';

// Dia 1
import BedroomMorningDay1 from './scenes/gameLoop/day1/bedroomMorningDay1.js';
import LivingroomMorningDay1 from './scenes/gameLoop/day1/livingroomMorningDay1.js';
import PlaygroundMorningDay1 from './scenes/gameLoop/day1/playgroundMorningDay1.js';
import StairsMorningDay1 from './scenes/gameLoop/day1/stairsMorningDay1.js';
import CorridorMorningDay1 from './scenes/gameLoop/day1/corridorMorningDay1.js';
import ClassFrontMorningDay1 from './scenes/gameLoop/day1/classFrontMorningDay1.js';
import ClassBackMorningDay1 from './scenes/gameLoop/day1/classBackMorningDay1.js';
import ClassBackBreakDay1 from './scenes/gameLoop/day1/classBackBreakDay1.js';
import CorridorBreakDay1 from './scenes/gameLoop/day1/corridorBreakDay1.js'
import StairsBreakDay1 from './scenes/gameLoop/day1/stairsBreakDay1.js';
import PlaygroundBreakDay1 from './scenes/gameLoop/day1/playgroundBreakDay1.js';
import PlaygroundAfternoonDay1 from './scenes/gameLoop/day1/playgroundAfternoonDay1.js';
import LivingroomAfternoonDay1 from './scenes/gameLoop/day1/livingroomAfternoonDay1.js';
import BedroomAfternoonDay1 from './scenes/gameLoop/day1/bedroomAfternoonDay1.js';
import NightmareDay1 from './scenes/gameLoop/day1/nightmareDay1.js'

// Dia 2
import BedroomMorningDay2 from './scenes/gameLoop/day2/bedroomMorningDay2.js';
import LivingroomMorningDay2 from './scenes/gameLoop/day2/livingroomMorningDay2.js';
import PlaygroundMorningDay2 from './scenes/gameLoop/day2/playgroundMorningDay2.js';
import StairsMorningDay2 from './scenes/gameLoop/day2/stairsMorningDay2.js';
import CorridorMorningDay2 from './scenes/gameLoop/day2/corridorMorningDay2.js';
import ClassFrontMorningDay2 from './scenes/gameLoop/day2/classFrontMorningDay2.js';
import ClassBackBreakDay2 from './scenes/gameLoop/day2/classBackBreakDay2.js';
import CorridorBreakDay2 from './scenes/gameLoop/day2/corridorBreakDay2.js';
import RestroomBreakDay2 from './scenes/gameLoop/day2/restroomBreakDay2.js';
import StairsBreakDay2 from './scenes/gameLoop/day2/stairsBreakDay2.js';
import PlaygroundBreakDay2 from './scenes/gameLoop/day2/playgroundBreakDay2.js';
import PlaygroundAfternoonDay2 from './scenes/gameLoop/day2/playgroundAfternoonDay2.js';
import LivingroomAfternoonDay2 from './scenes/gameLoop/day2/livingroomAfternoonDay2.js';
import BedroomAfternoonDay2 from './scenes/gameLoop/day2/bedroomAfternoonDay2.js';
import NightmareDay2 from './scenes/gameLoop/day2/nightmareDay2.js';

// Dia 3
import BedroomMorningDay3 from './scenes/gameLoop/day3/bedroomMorningDay3.js';
import LivingroomMorningDay3 from './scenes/gameLoop/day3/livingroomMorningDay3.js';
import PlaygroundMorningDay3 from './scenes/gameLoop/day3/playgroundMorningDay3.js';
import StairsMorningDay3 from './scenes/gameLoop/day3/stairsMorningDay3.js';
import CorridorMorningDay3 from './scenes/gameLoop/day3/corridorMorningDay3.js';
import ClassFrontMorningDay3 from './scenes/gameLoop/day3/classFrontMorningDay3.js';
import ClassBackAfternoonDay3 from './scenes/gameLoop/day3/classBackAfternoonDay3.js';
import CorridorAfternoonDay3 from './scenes/gameLoop/day3/corridorAfternoonDay3.js';
import RestroomAfternoonDay3 from './scenes/gameLoop/day3/restroomAfternoonDay3.js';
import StairsAfternoonDay3 from './scenes/gameLoop/day3/stairsAfternoonDay3.js';
import PlaygroundAfternoonDay3 from './scenes/gameLoop/day3/playgroundAfternoonDay3.js';
import LivingroomAfternoonDay3 from './scenes/gameLoop/day3/livingroomAfternoonDay3.js';
import BedroomAfternoonDay3 from './scenes/gameLoop/day3/bedroomAfternoonDay3.js';
import NightmareDay3 from './scenes/gameLoop/day3/nightmareDay3.js';

// Dia 4
import BedroomMorningDay4 from './scenes/gameLoop/day4/bedroomMorningDay4.js';
import LivingroomMorningDay4 from './scenes/gameLoop/day4/livingroomMorningDay4.js';
import PlaygroundMorningDay4 from './scenes/gameLoop/day4/playgroundMorningDay4.js';
import StairsMorningDay4 from './scenes/gameLoop/day4/stairsMorningDay4.js';
import CorridorMorningDay4 from './scenes/gameLoop/day4/corridorMorningDay4.js';
import ClassFrontMorningDay4 from './scenes/gameLoop/day4/classFrontMorningDay4.js';
import ClassBackBreakDay4 from './scenes/gameLoop/day4/classBackBreakDay4.js';
import CorridorBreakDay4 from './scenes/gameLoop/day4/corridorBreakDay4.js';
import StairsBreakDay4 from './scenes/gameLoop/day4/stairsBreakDay4.js';
import PlaygroundBreakDay4 from './scenes/gameLoop/day4/playgroundBreakDay4.js';
import PlaygroundAfternoonDay4 from './scenes/gameLoop/day4/playgroundAfternoonDay4.js';
import LivingroomAfternoonDay4 from './scenes/gameLoop/day4/livingroomAfternoonDay4.js';
import BedroomAfternoonDay4 from './scenes/gameLoop/day4/bedroomAfternoonDay4.js';
import StairsMorningDay5 from './scenes/gameLoop/day5/stairsMorningDay5.js';
import NightmareDay4 from './scenes/gameLoop/day4/nightmareDay4.js';

// Dia 5
import BedroomMorningDay5 from './scenes/gameLoop/day5/bedroomMorningDay5.js';
import LivingroomMorningDay5 from './scenes/gameLoop/day5/livingroomMorningDay5.js';
import PlaygroundMorningDay5 from './scenes/gameLoop/day5/playgroundMorningDay5.js';
import CorridorMorningDay5 from './scenes/gameLoop/day5/corridorMorningDay5.js';
import ClassFrontMorningDay5 from './scenes/gameLoop/day5/classFrontMorningDay5.js';
import ClassBackAfternoonDay5 from './scenes/gameLoop/day5/classBackAfternoonDay5.js';
import CorridorAfternoonDay5 from './scenes/gameLoop/day5/corridorAfternoonDay5.js';
import StairsAfternoonDay5 from './scenes/gameLoop/day5/stairsAfternoonDay5.js';
import RestroomAfternoonDay5 from './scenes/gameLoop/day5/restroomAfternoonDay5.js';
import NightmareDay5 from './scenes/gameLoop/day5/nightmareDay5.js';

// UI
import ComputerScene from './UI/computer/computerScene.js'
import UIManager from './managers/UIManager.js';

const max_w = 1129, max_h = 847, min_w = 320, min_h = 240;

const config = {
    width: max_w,
    height: max_h,
    backgroundColor: '#000000',
    version: "1.0",

    type: Phaser.AUTO,
    // Nota: el orden de las escenas es relevante, y las que se encuentren antes en el array se renderizaran por debajo de las siguientes
    scene: [
        // Carga de assets
        BootScene,
        // Menus
        LanguageMenu, TitleMenu, LoginMenu, CreditsScene,
        // Escenas bases
        AlarmScene, RestroomBase, BusScene, OppositeRestroom, TextOnlyScene,
        // Escenas dia 1
        BedroomMorningDay1, LivingroomMorningDay1, PlaygroundMorningDay1, StairsMorningDay1, CorridorMorningDay1, ClassFrontMorningDay1, ClassBackMorningDay1, ClassBackBreakDay1, CorridorBreakDay1, StairsBreakDay1, PlaygroundBreakDay1, PlaygroundAfternoonDay1, LivingroomAfternoonDay1, BedroomAfternoonDay1, NightmareDay1,
        // Escenas dia 2
        BedroomMorningDay2, LivingroomMorningDay2, PlaygroundMorningDay2, StairsMorningDay2, CorridorMorningDay2, ClassFrontMorningDay2, ClassBackBreakDay2, CorridorBreakDay2, RestroomBreakDay2, StairsBreakDay2, PlaygroundBreakDay2, PlaygroundAfternoonDay2, LivingroomAfternoonDay2, BedroomAfternoonDay2, NightmareDay2,
        // Escenas dia 3
        BedroomMorningDay3, LivingroomMorningDay3, PlaygroundMorningDay3, StairsMorningDay3, CorridorMorningDay3, ClassFrontMorningDay3, ClassBackAfternoonDay3, CorridorAfternoonDay3, RestroomAfternoonDay3, StairsAfternoonDay3, PlaygroundAfternoonDay3, LivingroomAfternoonDay3, BedroomAfternoonDay3, NightmareDay3,
        // Escenas dia 4
        BedroomMorningDay4, LivingroomMorningDay4, PlaygroundMorningDay4, StairsMorningDay4, CorridorMorningDay4, ClassFrontMorningDay4, ClassBackBreakDay4, CorridorBreakDay4, StairsBreakDay4, PlaygroundBreakDay4, PlaygroundAfternoonDay4, LivingroomAfternoonDay4, BedroomAfternoonDay4, NightmareDay4,
        // Escenas dia 5
        BedroomMorningDay5, LivingroomMorningDay5, PlaygroundMorningDay5, StairsMorningDay5, CorridorMorningDay5, ClassFrontMorningDay5, ClassBackAfternoonDay5, CorridorAfternoonDay5, StairsAfternoonDay5, RestroomAfternoonDay5, NightmareDay5,
        // UI
        ComputerScene, UIManager],
    autoFocus: true,
    disableContextMenu: true,        // Desactivar que aparezca el menu de inspeccionar al hacer click derecho
    render: {
        antialias: true,
        //transparent: true,
    },
    physics: {
        default: 'arcade',
        arcade: {
            // Visibilidad de las colisiones 
            debug: false,
        },
    },
    plugins: {
        // Plugin para utilizar animaciones esqueletales creadas con Spine
        scene: [
            { key: 'SpinePlugin', plugin: window.SpinePlugin, mapping: 'spine' }
        ]
    },
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,   // CENTER_BOTH, CENTER_HORIZONTALLY, CENTER_VERTICALLY
        mode: Phaser.Scale.FIT,                 // ENVELOP, FIT, HEIGHT_CONTROLS_WIDTH, NONE, RESIZE, WIDTH_CONTROLS_HEIGHT
        min: {
            width: min_w,
            height: min_h
        },
        max: {
            width: max_w,
            height: max_h,
        },
        zoom: 1,
        parent: 'game',
    },
}

const game = new Phaser.Game(config);
// Propiedad debug
game.debug = false;