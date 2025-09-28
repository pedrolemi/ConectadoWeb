import ClassBackBase from "../baseScenarios/classBackBase.js";
import ConectadoEventNames from "../../../eventNames.js";

export default class ClassBackBreakDay1 extends ClassBackBase {
    constructor() {
        super("ClassBackBreakDay1");
    }

    create(params) {
        super.create(params);
        
        this.corridorSceneName = "CorridorBreakDay1";
        
        let namespace = "day1\\classBackBreakDay1";

        let nodes = this.cache.json.get("classBackBreakDay1");
        
        // Cambia la hora del movil
        this.dispatcher.dispatch(ConectadoEventNames.changeHour, "startBreak");
        
        // Personajes de fondo
        this.add.image(this.rightBound * 0.46, this.CANVAS_HEIGHT * 0.62, this.atlasName, "backChar2").setOrigin(0, 0).setScale(this.bgScale * 0.53).setDepth(this.row3Chairs.depth - 1);
        this.add.image(this.rightBound * 0.655, this.CANVAS_HEIGHT * 0.625, this.atlasName, "backChar3").setOrigin(0, 0).setScale(this.bgScale * 0.6).setDepth(this.row3Chairs.depth - 1);
        this.add.image(this.rightBound * 0.61, this.CANVAS_HEIGHT * 0.585, this.atlasName, "backChar9").setOrigin(0, 0).setScale(this.bgScale * 0.53).setDepth(this.row2Chairs.depth - 1);
        this.add.image(this.rightBound * 0.18, this.CANVAS_HEIGHT * 0.58, this.atlasName, "backChar7").setOrigin(0, 0).setScale(this.bgScale * 0.45).setDepth(this.row1Chairs.depth - 1);


        // Se bloquea la puerta para que no se pueda interactuar con ella 
        this.doorClosed.disableInteractive();
        this.doorNode = this.localizationManager.readNodes(this, nodes, namespace, "door");

        // Alex 
        let alexNode = this.localizationManager.readNodes(this, nodes, namespace, "alex");
        let alex = this.createSpineCharacter(this.rightBound * 0.78, this.CANVAS_HEIGHT * 0.69, "Alex_front", () => {
            this.localizationManager.setNode(alexNode);
        }, 0.07, "IdleBase", "Alex", this.TOGGLES_DEPTH + 1);
        alex.setScale(-alex.scaleX, alex.scaleY);

        // Alison
        let alisonNode = this.localizationManager.readNodes(this, nodes, namespace, "alison");
        let alison = this.createSpineCharacter(this.rightBound * 0.33, this.CANVAS_HEIGHT * 1.12, "Alison", () => {
            this.localizationManager.setNode(alisonNode);
        }, 0.12, "IdleBase", "Alison", this.row5Chairs);
        alison.setScale(-alison.scaleX, alison.scaleY);

        
        // Eventos llamados cuando se termina de hablar con Alex
        this.dispatcher.addOnce("moveAlex", this, () => {
            // Alex desaparece y cuando termina la animacion, vuelve a aparecer desplazado y se desbloquea la puerta
            let anim = alex.fade(false);
            anim.on("complete", () => {
                anim = alex.fade(true);
                alex.setPosition(this.rightBound * 0.84 , this.CANVAS_HEIGHT * 0.74)
                anim.on("complete", () => {
                    this.doorClosed.setInteractive();
                });
            });
        });
        this.dispatcher.addOnce("leaveAlex", this, () => {
            // Alex desaparece y cuando termina la animacion se desbloquea la puerta
            let anim = alex.fade(false);
            anim.on("complete", () => {
                this.doorClosed.setInteractive();
            });
        });

        // Evento llamado cuando se termina de hablar con Alison
        this.dispatcher.addOnce("setTalkedAlison", this, () => {
            this.doorNode = null;
        });
    }

}