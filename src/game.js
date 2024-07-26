import BootScene from './scenes/bootScene.js';

// Menus
import LanguageMenu from './scenes/languageMenu.js';
import TitleMenu from './scenes/titleMenu.js';
import UserInfoMenu from './scenes/userInfoMenu.js';

// Flujo de juego
import TextOnlyScene from './scenes/textOnlyScene.js';
import AlarmScene from './scenes/gameLoop/alarmScene.js';

// Dia 1
import BedroomMorningDay1 from './scenes/gameLoop/day1/bedroomMorningDay1.js';
import LivingroomMorningDay1 from './scenes/gameLoop/day1/livingroomMorningDay1.js';
import PlaygroundMorningDay1 from './scenes/gameLoop/day1/playgroundMorningDay1.js';
import StairsMorningDay1 from './scenes/gameLoop/day1/stairsMorningDay1.js';
import CorridorMorningDay1 from './scenes/gameLoop/day1/corridorMorningDay1.js';
import BathroomMorning from './scenes/gameLoop/bathroomMorning.js';
import ClassFrontMorningDay1 from './scenes/gameLoop/day1/classFrontMorningDay1.js';
import ClassBackMorningDay1 from './scenes/gameLoop/day1/classBackMorningDay1.js';

// UI
import ComputerScene from './UI/computer/computerScene.js'
import UIManager from './managers/UIManager.js';

import Test from './scenes/test.js';
import TestMenu from './scenes/testMenu.js'

const max_w = 1129, max_h = 847, min_w = 320, min_h = 240;

const config = {
    width: max_w,
    height: max_h,
    backgroundColor: '#3F3F3F',
    version: "1.0",

    type: Phaser.AUTO,
    // Nota: el orden de las escenas es relevante, y las que se encuentren antes en el array se renderizaran por debajo de las siguientes
    scene: [
        BootScene, LanguageMenu, TitleMenu, UserInfoMenu,
        AlarmScene,
        BedroomMorningDay1, LivingroomMorningDay1, PlaygroundMorningDay1, StairsMorningDay1, CorridorMorningDay1, BathroomMorning, ClassFrontMorningDay1, ClassBackMorningDay1,
        Test, TestMenu,
        ComputerScene, UIManager, TextOnlyScene ],
    autoFocus: true,
    disableContextMenu: true,        // Desactivar que aparezca el menu de inspeccionar al hacer click derecho
    render: {
        antialias: true,
        //transparent: true,
    },
    /*
    COMENTAR: No creo que hagan falta fisicas
    physics: { 
        default: 'arcade', 
        arcade: { 
           // Visibilidad de las colisiones 
           debug: true,   
        },
    },
    */
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