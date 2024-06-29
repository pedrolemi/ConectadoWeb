export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
        this.characters = [];
    }

    preload() {
        // Precarga las imagenes para la caja de texto y de opciones
        this.load.setPath('./assets');

        this.load.image('textbox', 'textbox.png');
        this.load.image('textboxName', 'textboxName.png');
        this.load.image('option', 'optionBg.png');
        this.load.image('textboxMask', 'textboxMask.png');

        // Precarga el plugin para hacer fade de colores
        this.load.plugin('rextintrgbplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextintrgbplugin.min.js', true);

        // Test
        this.load.image('bg', 'patio.png');

        // Personajes y sus respectivas animaciones esqueletales de Spine
        // [Idle01, IdleBase, Walk]
        this.load.spine("mom", 'mom/Front.json', 'mom/Front.atlas')
        // [Idle01, IdleBase]
        this.load.spine("dad", 'dad/Front 34.json', 'dad/Front 34.atlas')
    }

    create() {
        this.scene.launch('DialogManager');
        this.scene.start('Test');
    }

}