import BootScene from "./game/scenes/bootScene.js";
import PreloaderScene from "./game/scenes/preloaderScene.js";

import LanguageMenu from "./game/scenes/menus/languageMenu.js";
import MainMenu from "./game/scenes/menus/mainMenu.js";
import Credits from "./game/scenes/menus/credits.js";
import TextOnlyScene from "./game/scenes/textOnlyScene.js";


const MAX_W = 1129, MAX_H = 847, MIN_W = 320, MIN_H = 240;
const CONFIG = {
    width: MAX_W,
    height: MAX_H,
    backgroundColor: '#000000',
    version: "1.0",

    type: Phaser.AUTO,
    // Nota: el orden de las escenas es relevante, y las que se encuentren antes en el array se renderizaran por debajo de las siguientes
    scene: [
        // Carga de assets
        BootScene, PreloaderScene,

        LanguageMenu, MainMenu, Credits,

        TextOnlyScene
    ],
    autoFocus: true,
    // Desactivar que aparezca el menu de inspeccionar al hacer click derecho
    disableContextMenu: true,
    render: {
        antialias: true,
        transparent: true,
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
        parent: 'game',
    },
    physics: {
        default: 'arcade'
    },
    plugins: {
        // Plugin para utilizar animaciones esqueletales creadas con Spine
        scene: [
            { key: 'SpinePlugin', plugin: window.SpinePlugin, mapping: 'spine' }
        ]
    },
}

const GAME = new Phaser.Game(CONFIG);
GAME.debug = {
    enable: false,
    color: "0x00ff00"
}