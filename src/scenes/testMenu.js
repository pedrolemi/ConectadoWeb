import VerticalListView from '../UI/verticalListView.js'
import HitListElement from '../UI/hitListElement.js'

export default class TestMenu extends Phaser.Scene {
    constructor(){
        super({key: 'TestMenu'});
    }

    create(){
        const CANVAS_WIDTH = this.sys.game.canvas.width;
        const CANVAS_HEIGHT = this.sys.game.canvas.height;

        // Notas: se puede tanto agrandar como los elementos como el propio listview porque todas las areas
        // de colision son globales
        let v = new VerticalListView(this, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 200, 0.9, 10, {width: 400, height: 400});

        // SUB LIST VIEW
        let scale = 0.5;
        let subV = new VerticalListView(this, CANVAS_WIDTH / 2 - 400, CANVAS_HEIGHT / 2 - 200, scale, 10, {width: 400, height: 400});
        // imagen 2 (sub)
        let image = this.add.image(0, 0, 'spFlag');
        image.setAlpha(0.5);
        image.setScale(1.1);
        let hit = new HitListElement(this, image);
        hit.on('pointerdown', () => {
            console.log("auch");
        })
        image.h = image.displayHeight;
        subV.addItem(image, [hit]);
        // imagen 3 (sub)
        image = this.add.image(0, 0, 'spFlag');
        image.setAlpha(0.5);
        image.setScale(1.1);
        image.h = image.displayHeight;
        subV.addItem(image);
        // image 4 (sub)
        image = this.add.image(0, 0, 'spFlag');
        image.setAlpha(0.5);
        image.setScale(1.1);
        image.h = image.displayHeight;
        subV.addItem(image);
        subV.h = subV.boundedZone.displayHeight * scale;
        // se recorta con la list view principal
        v.addItem(subV);

        // imagen 1 (no importa las pos)
        let image2 = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'spFlag');
        image2.setAlpha(0.5);
        image2.setScale(1.1);
        image2.setOrigin(0.5, 0);
        hit = new HitListElement(this, image2);
        hit.on('pointerdown', () => {
            console.log("me han tocadoo");
        })
        image2.h = image2.displayHeight;
        v.addItem(image2, [hit]);

        // imagen 5
        image = this.add.image(0, 0, 'spFlag');
        image.setAlpha(0.5);
        image.setScale(1.1);
        image.h = image.displayHeight;
        v.addItem(image);

        //subV.removeByIndex(0);
        //v.removeChild(image2);
        //v.removeByIndex(1);

        subV.cropItems();
        v.cropItems();
    }
}