import Test from './scenes/test.js'

const max_w = 1506, max_h = 847, min_w = 426, min_h = 240;

const config = {
    width: max_w,
    height: max_h,
    
    type: Phaser.AUTO,
    scene: [Test, ],
    autoFocus: true,
    disableContextMenu: true,        // Desactivar que aparezca el menu de inspeccionar al hacer click derecho
    render: {
        antialias: true,
        // pixelArt: true,              // Si el juego va a ser en pixel art
        transparent: true,
    },
    physics: { 
        default: 'arcade', 
        arcade: { 
           // Visibilidad de las colisiones 
           debug: false   
        },
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