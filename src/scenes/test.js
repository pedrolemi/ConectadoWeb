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
            // let newScene = new BaseScene("lol");
            // this.scene.start(newScene);
        });
        dad.setAnimation("Idle01", true);


        this.portraits.set("mom", mom.getPortrait());
        this.portraits.set("dad", dad.getPortrait());
        this.portraits.forEach((portrait) => {
            portrait.alpha = 0;
            portrait.setMask(this.dialogManager.portraitMask)
        });

        let i18next = this.plugins.get('rextexttranslationplugin');
        let dialog = {}
        dialog.text = i18next.t('dialog.text', { ns: 'day1', name: 'John', context: 'male' });
        dialog.character = i18next.t('dialog.character', { ns: 'day1' });
        dialog.name = i18next.t('dialog.name', { ns: 'day1' });

        this.dialogManager.changeScene(this);
        this.dialogManager.setDialogs([
            {
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Arcu non sodales neque sodales ut etiam sit amet. Tempus urna et pharetra pharetra massa massa ultricies. Pellentesque dignissim enim sit amet. Sit amet justo donec enim diam vulputate ut pharetra sit. Quisque sagittis purus sit amet volutpat. Nulla posuere sollicitudin aliquam ultrices sagittis orci. Euismod elementum nisi quis eleifend quam. Imperdiet sed euismod nisi porta lorem mollis aliquam. Lacus vestibulum sed arcu non odio euismod lacinia at quis.",
                character: "player",
                name: " ",
            },
            {
                text: "Sit amet consectetur adipiscing elit ut aliquam purus sit. In nibh mauris cursus mattis molestie a iaculis at. Laoreet sit amet cursus sit amet dictum. Tellus mauris a diam maecenas sed enim. Diam donec adipiscing tristique risus nec feugiat in fermentum. Vulputate dignissim suspendisse in est ante. Scelerisque felis imperdiet proin fermentum leo vel. Id eu nisl nunc mi. Quam id leo in vitae. Posuere ac ut consequat semper viverra. Quam vulputate dignissim suspendisse in est. Volutpat sed cras ornare arcu dui vivamus arcu felis bibendum. Egestas tellus rutrum tellus pellentesque eu tincidunt tortor aliquam nulla. Commodo viverra maecenas accumsan lacus vel facilisis. Varius sit amet mattis vulputate enim nulla. Aenean sed adipiscing diam donec. Tempor id eu nisl nunc mi ipsum faucibus. Quisque sagittis purus sit amet volutpat.",
                character: "mom",
                name: "Personaje 2",
            },
            {
                text: "Purus semper eget duis at tellus at urna. Quam elementum pulvinar etiam non quam lacus suspendisse faucibus interdum. Et molestie ac feugiat sed lectus vestibulum mattis ullamcorper. Diam maecenas ultricies mi eget mauris pharetra et ultrices. Convallis aenean et tortor at risus viverra adipiscing. Facilisis magna etiam tempor orci eu lobortis elementum nibh tellus. Mi quis hendrerit dolor magna eget est lorem ipsum. Sit amet facilisis magna etiam. Netus et malesuada fames ac turpis egestas. Nam at lectus urna duis. Tortor condimentum lacinia quis vel eros donec ac. Suscipit adipiscing bibendum est ultricies integer quis auctor elit. Urna et pharetra pharetra massa. A diam maecenas sed enim ut sem viverra. Ligula ullamcorper malesuada proin libero nunc. Id donec ultrices tincidunt arcu non sodales neque sodales ut. In mollis nunc sed id semper risus.",
                character: "dad",
                name: "La pola",
            },
            {
                text: "Etiam tempor orci eu lobortis elementum nibh tellus. Ornare suspendisse sed nisi lacus sed viverra tellus in hac. Commodo viverra maecenas accumsan lacus vel facilisis volutpat. Pellentesque habitant morbi tristique senectus. Augue eget arcu dictum varius duis at consectetur. Id volutpat lacus laoreet non curabitur gravida. Pharetra vel turpis nunc eget lorem dolor. Ac feugiat sed lectus vestibulum mattis ullamcorper velit. Neque viverra justo nec ultrices dui. Aliquam etiam erat velit scelerisque in dictum non consectetur. Massa sed elementum tempus egestas. Ultrices vitae auctor eu augue. Eu sem integer vitae justo eget magna fermentum iaculis.",
                character: "player",
                name: " ",
            },
            dialog
        ]);
        
    }
}
