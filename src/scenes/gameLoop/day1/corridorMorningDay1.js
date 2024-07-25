import CorridorBase from "../corridorBase.js";
import Character from "../../../gameObjects/character.js"

export default class CorridorMorningDay1 extends CorridorBase {
    constructor() {
        super('CorridorMorningDay1');
    }

    create(params) {
        super.create(params);

        this.stairs = "StairsMorningDay1";
        this.boysBathroom = "";
        this.girlsBathroom = "";
        this.class = "ClassFrontMorningDay1";

        if (this.gameManager.getUserInfo().gender === "male") {
            this.boysBathroom = "BathroomMorning";
        }
        else {
            this.girlsBathroom = "BathroomMorning";
        }

        // Si no se llega tarde, se colocan personajes en el fondo
        if (!this.gameManager.getValue(this.gameManager.isLate)) {
            let tr = {
                x: 250,
                y: this.CANVAS_HEIGHT * 0.75,
                scale: 0.087
            };
            let maria = new Character(this, "Maria", tr, this.portraitTr, () => {
                this.dialogManager.setNode(mariaNode);
            });
            maria.setAnimation("IdleBase", true);
            this.portraits.set("Maria", maria.getPortrait());
    
            tr = {
                x: this.rightBound * 0.60,
                y: this.CANVAS_HEIGHT * 0.75,
                scale: 0.083
            };
            let alison = new Character(this, "Alison", tr, this.portraitTr, () => {
                this.dialogManager.setNode(alisonNode);
            });
            alison.setAnimation("IdleBase", true);
            this.portraits.set("Alison", alison.getPortrait());
    
    
            tr = {
                x: this.rightBound * 0.76,
                y: this.CANVAS_HEIGHT * 0.93,
                scale: 0.15
            };
            let guille = new Character(this, "Guille", tr, this.portraitTr, () => {
                this.dialogManager.setNode(guilleNode);
            });
            guille.setScale(-tr.scale, tr.scale);
            guille.setAnimation("IdleBase", true);
            this.portraits.set("Guille", guille.getPortrait());
    
            let nodes = this.cache.json.get('corridorMorningDay1');
            let mariaNode = super.readNodes(nodes, "day1\\corridorMorningDay1", "maria", true);
            let alisonNode = super.readNodes(nodes, "day1\\corridorMorningDay1", "alison", true);
            let guilleNode = super.readNodes(nodes, "day1\\corridorMorningDay1", "guille", true);
        }
        
    }
}
