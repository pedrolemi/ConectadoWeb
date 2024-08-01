import CorridorBase from "../baseScenarios/corridorBase.js";
import Character from "../../../gameObjects/character.js";

export default class CorridorBreakDay2 extends CorridorBase {
    constructor() {
        super('CorridorBreakDay2');
    }

    create(params) {
        super.create(params);

        this.stairs = "StairsBreakDay2";
        this.class = "PlaygroundAfternoonDay2";
        this.classChangeParams = {
            camPos: "right"
        };

        if (this.gameManager.getUserInfo().gender === "male") {
            this.boysBathroom = "BathroomBreakDay2";
            this.girlsBathroom = "OppositeBathroom";
        }
        else {
            this.girlsBathroom = "BathroomBreakDay2";
            this.boysBathroom = "OppositeBathroom";
        }

        // Cambia la hora del movil
        this.phoneManager.setDayInfo("midBreak");
        

        // Personajes
        let tr = {
            x: this.rightBound * 0.6,
            y: this.CANVAS_HEIGHT * 0.75,
            scale: 0.088
        };
        let maria = new Character(this, "Maria", tr, this.portraitTr, () => {
            this.dialogManager.setNode(mariaNode);
        });
        maria.setAnimation("IdleBase", true);
        this.portraits.set("Maria", maria.getPortrait());
        
        let nodes = this.cache.json.get('corridorBreakDay2');
        let mariaNode = super.readNodes(nodes, "day2\\corridorBreakDay2", "maria", true);

        nodes = this.cache.json.get('everydayDialog');
        this.classNode = super.readNodes(nodes, "everydayDialog", "corridor.class", true);
        
    }

    
}
