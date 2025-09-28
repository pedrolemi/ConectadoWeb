import ClassBackBase from "../baseScenarios/classBackBase.js";
import ConectadoEventNames from "../../../eventNames.js";

export default class ClassBackMorningDay1 extends ClassBackBase {
    constructor() {
        super("ClassBackMorningDay1");
    }

    create(params) {
        super.create(params);

        let namespace = "day1\\classBackMorningDay1";

        let nodes = this.cache.json.get("classBackMorningDay1");

        this.doorClosed.disableInteractive();
        this.doorOpened.disableInteractive();

        // Imagen de la pizarra
        this.blackboardPics[2].setVisible(true);

        // Profesor
        let teacher = this.createImageCharacter(this.rightBound * 0.46, this.CANVAS_HEIGHT * 0.66, "teacherChar", "teacher", 0.07, this.row1Tables.depth - 1);

        // Personajes de fondo
        this.add.image(this.rightBound * 0.45, this.CANVAS_HEIGHT * 0.65, this.atlasName, "backChar8").setOrigin(0, 0).setScale(this.bgScale * 0.8).setDepth(this.row4Chairs.depth - 1);
        this.add.image(this.rightBound * 0.725, this.CANVAS_HEIGHT * 0.675, this.atlasName, "backChar12").setOrigin(0, 0).setScale(this.bgScale * 0.8).setDepth(this.row4Chairs.depth - 1);
        this.add.image(60, this.CANVAS_HEIGHT * 0.62, this.atlasName, "backChar4").setOrigin(0, 0).setScale(this.bgScale * 0.6).setDepth(this.row3Chairs.depth - 1);
        this.add.image(this.rightBound * 0.26, this.CANVAS_HEIGHT * 0.62, this.atlasName, "backChar10").setOrigin(0, 0).setScale(this.bgScale * 0.6).setDepth(this.row3Chairs.depth - 1);
        this.add.image(this.rightBound * 0.46, this.CANVAS_HEIGHT * 0.62, this.atlasName, "backChar2").setOrigin(0, 0).setScale(this.bgScale * 0.53).setDepth(this.row3Chairs.depth - 1);
        this.add.image(this.rightBound * 0.655, this.CANVAS_HEIGHT * 0.625, this.atlasName, "backChar3").setOrigin(0, 0).setScale(this.bgScale * 0.6).setDepth(this.row3Chairs.depth - 1);
        this.add.image(this.rightBound * 0.61, this.CANVAS_HEIGHT * 0.585, this.atlasName, "backChar9").setOrigin(0, 0).setScale(this.bgScale * 0.53).setDepth(this.row2Chairs.depth - 1);
        this.add.image(this.rightBound * 0.18, this.CANVAS_HEIGHT * 0.58, this.atlasName, "backChar7").setOrigin(0, 0).setScale(this.bgScale * 0.45).setDepth(this.row1Chairs.depth - 1);
        this.add.image(this.rightBound * 0.27, this.CANVAS_HEIGHT * 0.58, this.atlasName, "backChar11").setOrigin(0, 0).setScale(this.bgScale * 0.45).setDepth(this.row1Chairs.depth - 1);
        this.add.image(this.rightBound * 0.44, this.CANVAS_HEIGHT * 0.58, this.atlasName, "backChar15").setOrigin(0, 0).setScale(this.bgScale * 0.45).setDepth(this.row1Chairs.depth - 1);

        // Se desactiva el icono del telefono para que no se pueda sacar durante esta escena
        this.dispatcher.dispatch(ConectadoEventNames.activatePhoneIcon, false);

        // Al iniciar la escena, se pone el dialogo directamente con un poco de retardo
        let sceneNode = this.localizationManager.readNodes(this, nodes, namespace, "beforeEnter");
        setTimeout(() => {
            this.localizationManager.setNode(sceneNode);
        }, 500);


        let alexTr = 0.07;
        
        // Alex
        let alexWalk = this.createSpineCharacter(this.doorOpened.x + 160, this.doorOpened.y + this.doorOpened.displayHeight * 0.95, "Alex_side", 
            () => {}, alexTr, "Walk", teacher.depth);
        alexWalk.disableInteractive();
        alexWalk.setScale(-alexTr, alexTr);
        alexWalk.setAnimationSpeed(0.6);
        alexWalk.setVisible(false);

        let alexFinalX = alexWalk.x - 380;
        
        // Alex de frente
        let alexFront = this.createSpineCharacter(alexFinalX, this.doorOpened.y + this.doorOpened.displayHeight * 0.95 + 10, "Alex_front", 
            () => {}, alexTr, "IdleBase", teacher.depth);
        alexFront.disableInteractive();
        alexFront.setScale(-alexTr, alexTr);
        alexFront.setAnimationSpeed(0.6);

        this.characters.set("Alex", alexFront);
        alexFront.setVisible(false);


        // Evento llamado cuando el profesor termina su primer dialogo
        this.dispatcher.addOnce("enterClass", this, (obj) => {
            alexWalk.setVisible(true);

            // Se abre la puerta y se cambia la profundidad para que se pueda ver a Alex entrar
            this.doorClosed.setVisible(false).setDepth(teacher.depth);
            this.doorOpened.setVisible(true).setDepth(teacher.depth);

            // Se pone una mascara a la derecha tapando lo que hay detras de la pared
            let rectangle = this.add.rectangle(this.doorOpened.x + this.doorOpened.displayWidth * 0.77, 
                this.doorOpened.y, this.doorOpened.displayWidth * 2, this.doorOpened.displayHeight, 0xfff, 0).setOrigin(0, 0);
            let mask = rectangle.createGeometryMask();
            mask.invertAlpha = true;

            // Se crea un container al que anadirle la mascara 
            let container = this.add.container(0, 0);
            container.add(alexWalk);
            container.setDepth(teacher.depth);
            container.setMask(mask);
            

            // Animacion de Alex entrando a la clase
            let walkingIn = this.tweens.add({
                targets: [alexWalk],
                x: { from: alexWalk.x, to: alexFinalX },
                duration: 4000,
                repeat: 0,
            });

            // Cuando termina la animacion,
            walkingIn.on("complete", () => {
                // Se oculta la espina de Alex de perfil y se muestra de frente
                alexWalk.setVisible(false);
                alexFront.setVisible(true);
                
                // Se ponen los dialogos que hay despues de que Alex entre en clase
                sceneNode = this.localizationManager.readNodes(this, nodes, namespace, "afterEnter");
                this.localizationManager.setNode(sceneNode);
            });
        });

        // Evento llamado cuando el profesor termina su segundo dialogo
        this.dispatcher.addOnce("startBreak", this, () => {
            let params = {
                text: this.localizationManager.translate("day1.startBreak", "transitionScenes"),
                onComplete: () => {
                    this.dispatcher.dispatch(ConectadoEventNames.activatePhoneIcon, true);
                    this.gameManager.changeScene("ClassBackBreakDay1", null, true);
                },
                onCompleteDelay: 500
            };
            setTimeout(() => {
                this.gameManager.changeScene("TextOnlyScene", params, true);
            }, 100);
        });
    }

}