import CorridorBase from "../baseScenarios/corridorBase.js";
import Character from "../../../gameObjects/character.js";

export default class CorridorBreakDay4 extends CorridorBase {
    constructor() {
        super('CorridorBreakDay4');
    }

    create(params) {
        super.create(params);

        this.stairs = "StairsBreakDay4";
        this.class = "PlaygroundAfternoonDay4";
        this.classChangeParams = {
            camPos: "right"
        };
        
        // Cambia la hora del movil
        this.phoneManager.setDayInfo("midBreak");
        

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
        
        let nodes = this.cache.json.get('corridorBreakDay4');
        let mariaNode = super.readNodes(nodes, "day4\\corridorBreakDay4", "maria", true);

        
        // Se activa el acceso al bano opuesto
        if (this.gameManager.getUserInfo().gender === "male") {
            this.girlsBathroomNode = super.readNodes(nodes, "day4\\corridorBreakDay4", "bathroom", true);
        } 
        else {
            this.boysBathroomNode = super.readNodes(nodes, "day4\\corridorBreakDay4", "bathroom", true);
        }

        this.dispatcher.add("enterBathroom", this, (obj) => {
            let params = {
                camPos: "right",
                corridor: this
            }
            if (this.gameManager.getUserInfo().gender === "male") {
                this.gameManager.changeScene(this.girlsBathroom, params, true);
            } 
            else {
                this.gameManager.changeScene(this.boysBathroom, params, true);
            }
        });
        
        

        nodes = this.cache.json.get('everydayDialog');
        this.classNode = super.readNodes(nodes, "everydayDialog", "corridor.class", true);
        
        
        
    }

    
}
