import BootScene from './scenes/bootScene.js'
import Test from './scenes/test.js'
import DialogManager from './dialog/dialogManager.js'

const max_w = 1129, max_h = 847, min_w = 320, min_h = 240;

const config = {
    width: max_w,
    height: max_h,
    
    type: Phaser.AUTO,
    scene: [BootScene, Test, DialogManager],
    autoFocus: true,
    disableContextMenu: true,        // Desactivar que aparezca el menu de inspeccionar al hacer click derecho
    render: {
        antialias: true,
        transparent: true,
    },
    /*
    No hacen falta
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
    },
}

const game = new Phaser.Game(config);