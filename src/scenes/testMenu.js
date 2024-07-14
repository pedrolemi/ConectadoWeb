import VerticalListView from '../UI/verticalListView.js'
import HitListElement from '../UI/hitListElement.js'

export default class TestMenu extends Phaser.Scene {
    constructor(){
        super({key: 'TestMenu'});
    }

    create(){
        const CANVAS_WIDTH = this.sys.game.canvas.width;
        const CANVAS_HEIGHT = this.sys.game.canvas.height;

        let v = this.createListView(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 200, 0.9);
        let subV = this.createListView(0, 0, 0.8);
        let subV2 = this.createListView(CANVAS_WIDTH / 2 - 400, CANVAS_HEIGHT / 2 - 200, 0.3);
        v.addItem(subV, null, [subV]);
        subV.addItem(subV2, null, [subV2]);

        let image = this.createImage();
        subV2.addItem(image);

        v.cropItems();

        //subV.removeByIndex(2);
        //subV.cropItems();

        //v.removeByIndex(2);
        //v.cropItems();
    }

    createListView(x, y, scale){
        let v = new VerticalListView(this, x, y, scale, 10, {width: 400, height: 400});

        // imagen 1
        let image = this.createImage();
        let hit = new HitListElement(this, image);
        hit.on('pointerdown', () => {
            console.log("auch");
        })
        v.addItem(image, [hit]);

        // imagen 2
        image = this.createImage();
        v.addItem(image);

        return v;
    }

    createImage(){
        let image = this.add.image(0, 0, 'spFlag');
        image.setAlpha(0.5);
        image.setScale(1.1);
        image.h = image.displayHeight;
        return image;
    }
}