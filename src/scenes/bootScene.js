export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
        this.characters = [];
    }

    preload() {
        // Precarga las imagenes para la caja de texto y de opciones
        this.load.image('textbox', 'assets/textbox.png');
        this.load.image('textboxName', 'assets/textboxName.png');
        this.load.image('option', 'assets/optionBg.png');
        this.load.image('textboxMask', 'assets/textboxMask.png');

        // Precarga el plugin para hacer fade de colores
        this.load.plugin('rextintrgbplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextintrgbplugin.min.js', true);


        // Test
        this.load.image('bg', 'assets/patio.png');
        this.load.image('mom', 'assets/mom.png');
        this.load.image('dad', 'assets/dad.png');
    }

    create() {
        this.scene.launch('DialogManager');
        this.scene.start('Test');
    }

}