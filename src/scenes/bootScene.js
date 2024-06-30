export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
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

        // comprimir texturas (toma mucha menos memoria, aunque los archivos pueden ocupa mas tam)
        // Se comprueba de arriba a abajo hasta encontrar el primero que funcione en el dispositivio, sino se usa png
        // formatos de compresion: ETC, ETC1, ATC, ASTC, BPTC, RGTC, PVRTC, S3TC, and S3TCSRB
        // ASTC - MAC
        // PVRTC - iOS y algunos Android
        // S3TCSRB/S3TCSRGB - SOs sobremesa y algunos Android
        // ETC1 - mayoria Android
        this.load.texture('dialog', {
            'ASTC': { type: 'PVR', textureURL: 'dialog/dialog-astc4x4/dialog-astc4x4.pvr', atlasURL: 'dialog/dialog-astc4x4/dialog-astc4x4.json' },
            //'PVRTC': { type: 'PVR', textureURL: 'dialog/dialog-pvrtc/dialog-pvrtc.pvr', atlasURL: 'dialog/dialog-pvrtc/dialog-pvrtc.json' },
            'S3TCSRGB': { type: 'PVR', textureURL: 'dialog/dialog-dxt5/dialog-dxt5.pvr', atlasURL: 'dialog/dialog-dxt5/dialog-dxt5.json' },
            'IMG': { textureURL: 'dialog/dialog-img/dialog-img.png', atlasURL: 'dialog/dialog-img/dialog-img.json' },
        });
    }

    create() {
        this.scene.launch('DialogManager');
        this.scene.start('Test');
    }

}