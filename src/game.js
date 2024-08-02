import BootScene from './scenes/bootScene.js';

// Menus
import LanguageMenu from './scenes/languageMenu.js';
import TitleMenu from './scenes/titleMenu.js';
import UserInfoMenu from './scenes/userInfoMenu.js';

// Flujo de juego
import TextOnlyScene from './scenes/textOnlyScene.js';
import AlarmScene from './scenes/gameLoop/alarmScene.js';
import BathroomBase from './scenes/gameLoop/baseScenarios/bathroomBase.js';
import OppositeBathroom from './scenes/gameLoop/oppositeBathroom.js';

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
import BathroomBreakDay2 from './scenes/gameLoop/day2/bathroomBreakDay2.js';
import StairsBreakDay2 from './scenes/gameLoop/day2/stairsBreakDay2.js';
import PlaygroundBreakDay2 from './scenes/gameLoop/day2/playgroundBreakDay2.js';
import PlaygroundAfternoonDay2 from './scenes/gameLoop/day2/playgroundAfternoonDay2.js';
import LivingroomAfternoonDay2 from './scenes/gameLoop/day2/livingroomAfternoonDay2.js';
import BedroomAfternoonDay2 from './scenes/gameLoop/day2/bedroomAfternoonDay2.js';
import NightmareDay2 from './scenes/gameLoop/day2/nightmareDay2.js';

// Dia 3
import NightmareDay3 from './scenes/gameLoop/day3/nightmareDay3.js';

// Dia 4
import NightmareDay4 from './scenes/gameLoop/day4/nightmareDay4.js';

// UI
import ComputerScene from './UI/computer/computerScene.js'
import UIManager from './managers/UIManager.js';

import Test from './scenes/test.js';

const max_w = 1129, max_h = 847, min_w = 320, min_h = 240;

const config = {
    width: max_w,
    height: max_h,
    backgroundColor: '#3F3F3F',
    version: "1.0",

    type: Phaser.AUTO,
    // Nota: el orden de las escenas es relevante, y las que se encuentren antes en el array se renderizaran por debajo de las siguientes
    scene: [
        // Carga de assets
        BootScene,
        // Menus
        LanguageMenu, TitleMenu, UserInfoMenu,
        // Escenas bases
        AlarmScene, BathroomBase, OppositeBathroom, TextOnlyScene,
        // Escenas dia 1
        BedroomMorningDay1, LivingroomMorningDay1, PlaygroundMorningDay1, StairsMorningDay1, CorridorMorningDay1, ClassFrontMorningDay1, ClassBackMorningDay1, ClassBackBreakDay1, CorridorBreakDay1, StairsBreakDay1, PlaygroundBreakDay1, PlaygroundAfternoonDay1, LivingroomAfternoonDay1, BedroomAfternoonDay1, NightmareDay1,
        // Escenas dia 2
        BedroomMorningDay2, LivingroomMorningDay2, PlaygroundMorningDay2, StairsMorningDay2, CorridorMorningDay2, ClassFrontMorningDay2, ClassBackBreakDay2, CorridorBreakDay2, BathroomBreakDay2, StairsBreakDay2, PlaygroundBreakDay2, PlaygroundAfternoonDay2, LivingroomAfternoonDay2, BedroomAfternoonDay2, NightmareDay2,
        // Escenas dia 3
        NightmareDay3,
        // Escenas dia 4
        NightmareDay4,
        // Pruebas
        Test,
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
           debug: true,   
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
    }
}

const game = new Phaser.Game(config);