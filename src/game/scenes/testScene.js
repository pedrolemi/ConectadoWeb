import ConectadoBaseScene from "./conectadoBaseScene.js";
import ScrollListView from "../../framework/UI/scrollListView.js";
import InteractiveContainer from "../../framework/UI/interactiveContainer.js";

export default class TestScene extends ConectadoBaseScene {
    constructor() {
        super("TestScene", "");
    }

    create() {
        this.add.rectangle(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT, 0xFF2B9E9E, 1).setOrigin(0, 0);
        
        let w = 300;
        let h = 400
        let x = w / 2;
        let y = h / 2;
        
        x = 400;
        y = 500;
        
        let middle = new ScrollListView(this, x, y, w, h, 0, 1, 0.5);
        // let left = new ScrollListView(this, 350, y + 250, w, h, 0, 0.5, 0.5);
        // let right = new ScrollListView(this, 1000, y, w, h, 1, 0, 0.5);

        // x = 300;
        // y = 300;
        // let cont = new InteractiveContainer(this, x, y);
        // let rect = this.add.rectangle(x, y, 10, 10, 0xffffff, 0.8).setOrigin(0.5, 0.5);
        
        // let r = this.add.rectangle(0, 0, 100, 100, 0xff0000, 1);
        // let g = this.add.rectangle(-100, -100, 100, 100, 0x00ff00, 1);
        // let b = this.add.rectangle(100, 100, 100, 100, 0x0000ff, 1).setOrigin(0, 0);
        // let p = this.add.rectangle(-100, 100, 100, 100, 0xff00ff, 1);
        
        // cont.add(r);
        // cont.add(g);
        // cont.add(b);
        // cont.setOrigin(0.5, 0);
        

        // x = 100;
        // y = 100;

        // let cont2 = new InteractiveContainer(this, 100, 100);
        // let rect2 = this.add.rectangle(x, y, 10, 10, 0xffffff, 0.8).setOrigin(0.5, 0.5);
        // cont2.add(p);
        // cont2.setOrigin(0, 0.5);
        // // cont2.add(cont);
        
        // cont2.remove(cont);
    }
}