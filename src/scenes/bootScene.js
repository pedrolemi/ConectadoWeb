export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
        this.characters = [];
    }

    create() {
        this.scene.launch('DialogManager');
        this.scene.start('Test');
    }

}