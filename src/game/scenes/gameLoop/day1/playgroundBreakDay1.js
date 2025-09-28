import PlaygroundBase from "../baseScenarios/playgroundBase.js";
import { fadeAnimation } from "../../../../framework/utils/graphics.js";

export default class PlaygroundBreakDay1 extends PlaygroundBase {
    constructor() {
        super("PlaygroundBreakDay1");
    }

    create(params) {
        super.create(params);

        this.stairsSceneName = "StairsBreakDay1";

        let namespace = "day1\\playgroundBreakDay1";

        let nodes = this.cache.json.get("playgroundBreakDay1");

        super.openDoors();
        this.homeNode = this.localizationManager.readNodes(this, this.everydayNodes, "everydayDialog", "playground.homeBreak");


        // Ana
        let anaNode = this.localizationManager.readNodes(this, nodes, namespace, "ana");
        let ana = this.createSpineCharacter(280, this.CANVAS_HEIGHT * 0.92, "Ana", () => {
            this.localizationManager.setNode(anaNode);
        }, 0.051, "IdleBase");
        ana.setScale(-ana.scaleX, ana.scaleY);

        // Guille
        let guilleNode = this.localizationManager.readNodes(this, nodes, namespace, "guille");
        let guille = this.createSpineCharacter(this.rightBound * 0.34, this.CANVAS_HEIGHT * 1.17, "Guille", () => {
            this.localizationManager.setNode(guilleNode);
        }, 0.1, "IdleBase");
        guille.setScale(-guille.scaleX, guille.scaleY);

        
        // Pendiente con sus animaciones
        let earringNode = this.localizationManager.readNodes(this, nodes, namespace, "earring");
        let earring = this.add.image(this.rightBound * 0.88, this.CANVAS_HEIGHT * 0.92, "earring").setScale(0.5);
        this.setInteractive("earring", earring, () => {
            this.localizationManager.setNode(earringNode);
        });
        // La rotacion se tiene que hacer con un twen de contador
        this.tweens.addCounter( {
            targets: earring,
            duration: 500,
            repeat: -1,
            onUpdate: (tween) => {
                earring.rotation += 0.005;
                earring.rotation %= 360;
            },
        });
        this.tweens.add({
            targets: earring,
            scale: earring.scale - 0.2,
            duration: 500,
            repeat: -1,
            yoyo: true,
        });
        
        // Evento que se llama al recoger el pendiente. Lo hace desaparecer con una
        // animacion (la variable de coger el pendiente la cambia el propio evento)
        this.dispatcher.addOnce("pickEarring", this, () => {
            earring.disableInteractive();
            fadeAnimation(earring, false, 500);
        });
    }
}