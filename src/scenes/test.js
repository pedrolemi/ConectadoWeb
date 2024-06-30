import BaseScene from './baseScene.js';
import Character from '../character.js';

export default class Test extends BaseScene {
    constructor() {
        super('Test');
    }
    
    create() {
        const CANVAS_WIDTH = this.sys.game.canvas.width;
        const CANVAS_HEIGHT = this.sys.game.canvas.height;
        
        super.create();
        
        // Pone una imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(CANVAS_WIDTH / 2, 0, 'bg').setOrigin(0.5, 0);
        let scale = CANVAS_HEIGHT / bg.height;
        bg.setScale(scale);

        bg.setInteractive();
        bg.on('pointerdown', (pointer) => {
            this.dialogManager.textbox.activate(false);
            this.dialogManager.activateOptions(false);
        });
        
        let trans = {};
        trans.x = CANVAS_WIDTH / 3.5;
        trans.y = CANVAS_HEIGHT / 1.1;
        trans.scale = 0.2;

        let portraitTrans = {};
        portraitTrans.x = this.portraitX;
        portraitTrans.y = this.portraitY;
        portraitTrans.scale = this.portraitScale;

        let mom = new Character(this, "mom", trans, portraitTrans, () => {
            this.dialogManager.test2();
        });
        mom.setAnimation("Walk", true);
        
        trans.x = CANVAS_WIDTH / 1.5;
        let dad = new Character(this, "dad", trans, portraitTrans, () => {
            this.dialogManager.test1();
        });
        dad.setAnimation("Idle01", true);

        //let madre = this.add.spine(0, CANVAS_HEIGHT / 2, "madre", "walk");

        //let container = this.add.spineContainer();
        //container.add(madre);

        // Imagen de la madre y su retrato
        /*
        let mom = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'mom').setOrigin(0.5, 0.5);
        mom.setScale(0.2);
        mom.x = mom.x - mom.displayWidth;
        mom.setInteractive();
        mom.on('pointerdown', (pointer) => {
            this.dialogManager.test2();
        });
        let momPortrait = this.add.image(this.portraitX, this.portraitY, 'mom').setOrigin(0.5, 0.5).setScale(this.portraitScale);
        
        // Imagen del padre y su retrato
        let dad = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'dad').setOrigin(0.5, 0.5);
        dad.setScale(0.2);
        dad.x = dad.x + dad.displayWidth;
        dad.setInteractive();
        dad.on('pointerdown', (pointer) => {
            this.dialogManager.test1();
        });
        let dadPortrait = this.add.image(this.portraitX, this.portraitY, 'dad').setOrigin(0.5, 0.5).setScale(this.portraitScale);
        
        */

        /*
        TODO: COMENTAR A MATT ???
        this.plugins.get('rextintrgbplugin').add(mom);
        this.plugins.get('rextintrgbplugin').add(momPortrait);
        this.plugins.get('rextintrgbplugin').add(dad);
        this.plugins.get('rextintrgbplugin').add(dadPortrait);
        */

        /*
        this.tweens.add({
            targets: [mom, momPortrait],
            tintR: 0x00,
            tintG: 0xFF,
            tintB: 0x56,
            duration: 1000,
            repeat: -1,
            yoyo: true
        });
        
        this.tweens.add({
            targets: [dad, dadPortrait],
            tintR: 0x12,
            tintG: 0x00,
            tintB: 0x76,
            duration: 1000,
            repeat: -1,
            yoyo: true
        });
        */
        
        this.portraits.set("mom", mom.getPortrait());
        this.portraits.set("dad", dad.getPortrait());
        this.portraits.forEach((portrait) => {
            portrait.alpha = 0;
            portrait.setMask(this.dialogManager.portraitMask)
        });

        this.dialogManager.changeScene(this);
    }
}
