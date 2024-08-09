import ClassBackBase from "../baseScenarios/classBackBase.js";
import Character from "../../../gameObjects/character.js";

export default class ClassBackMorningDay1 extends ClassBackBase {
    constructor() {
        super('ClassBackMorningDay1');
    }

    create(params) {
        super.create(params);

        // Imagenes de la puerta (para bloquear la interaccion y poder mostrarlas/ocultarlas)
        let doorPos = {
            x: 2224 * this.scale,
            y: 530 * this.scale
        };
        let doorClosed = this.add.image(doorPos.x, doorPos.y, this.atlasName, 'classDoorClosed').setOrigin(0, 0).setScale(this.scale).setInteractive();
        let doorOpened = this.add.image(doorPos.x, doorPos.y, this.atlasName, 'classDoorOpened').setOrigin(0, 0).setScale(this.scale).setInteractive();
        doorOpened.visible = false;

        this.blackboardPics[2].visible = true;


        // Profesor
        let tr = {
            x: this.rightBound / 2,
            y: this.CANVAS_HEIGHT * 0.37,
            scale: 0.07
        };
        let teacher = this.add.image(tr.x, tr.y, 'teacherChar').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row1Tables.depth - 1);
        let teacherPortrait = this.add.image(this.portraitTr.x, this.portraitTr.y + 20, 'teacher').setOrigin(0.5, 1).setScale(this.portraitTr.scale);
        this.portraits.set("teacherChar", teacherPortrait);


        // Personajes de fondo
        tr = {
            x: this.rightBound * 0.45,
            y: this.CANVAS_HEIGHT * 0.65,
            scale: this.scale * 0.8
        };
        this.add.image(tr.x, tr.y, this.atlasName, 'backChar8').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row4Chairs.depth - 1);

        tr = {
            x: this.rightBound * 0.725,
            y: this.CANVAS_HEIGHT * 0.675,
            scale: this.scale * 0.8
        };
        this.add.image(tr.x, tr.y, this.atlasName, 'backChar12').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row4Chairs.depth - 1);


        tr = {
            x: 60,
            y: this.CANVAS_HEIGHT * 0.62,
            scale: this.scale * 0.6
        };
        this.add.image(tr.x, tr.y, this.atlasName, 'backChar4').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row3Chairs.depth - 1);

        tr = {
            x: this.rightBound * 0.26,
            y: this.CANVAS_HEIGHT * 0.62,
            scale: this.scale * 0.6
        };
        this.add.image(tr.x, tr.y, this.atlasName, 'backChar10').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row3Chairs.depth - 1);

        tr = {
            x: this.rightBound * 0.46,
            y: this.CANVAS_HEIGHT * 0.62,
            scale: this.scale * 0.53
        };
        this.add.image(tr.x, tr.y, this.atlasName, 'backChar2').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row3Chairs.depth - 1);

        tr = {
            x: this.rightBound * 0.655,
            y: this.CANVAS_HEIGHT * 0.625,
            scale: this.scale * 0.6
        };
        this.add.image(tr.x, tr.y, this.atlasName, 'backChar3').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row3Chairs.depth - 1);


        tr = {
            x: this.rightBound * 0.61,
            y: this.CANVAS_HEIGHT * 0.585,
            scale: this.scale * 0.53
        };
        this.add.image(tr.x, tr.y, this.atlasName, 'backChar9').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row2Chairs.depth - 1);


        tr = {
            x: this.rightBound * 0.18,
            y: this.CANVAS_HEIGHT * 0.58,
            scale: this.scale * 0.45
        };
        this.add.image(tr.x, tr.y, this.atlasName, 'backChar7').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row1Chairs.depth - 1);

        tr = {
            x: this.rightBound * 0.27,
            y: this.CANVAS_HEIGHT * 0.58,
            scale: this.scale * 0.45
        };
        this.add.image(tr.x, tr.y, this.atlasName, 'backChar11').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row1Chairs.depth - 1);

        tr = {
            x: this.rightBound * 0.44,
            y: this.CANVAS_HEIGHT * 0.58,
            scale: this.scale * 0.45
        };
        this.add.image(tr.x, tr.y, this.atlasName, 'backChar15').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row1Chairs.depth - 1);



        // Se desactiva el icono del telefono para que no se pueda sacar durante esta escena
        this.phoneManager.activate(false);

        // Al iniciar la escena, se pone el dialogo directamente con un poco de retardo
        let nodes = this.cache.json.get('classBackMorningDay1');
        setTimeout(() => {
            let node = super.readNodes(nodes, "day1\\classBackMorningDay1", "beforeEnter", true);
            this.dialogManager.setNode(node)
        }, 500);


        // Evento llamado cuando el profesor termina su primer dialogo
        this.dispatcher.addOnce("enterClass", this, (obj) => {
            // Se abre la puerta y se pone una mascara a la derecha tapando lo que hay detras ede la pared
            doorClosed.visible = false;
            doorOpened.visible = true;
            let rectangle = this.add.rectangle(doorPos.x + doorOpened.displayWidth * 0.77, doorPos.y, doorOpened.displayWidth * 2, doorOpened.displayHeight, 0xfff, 0).setOrigin(0, 0);
            let mask = rectangle.createGeometryMask();
            mask.invertAlpha = true;

            // Alex de lado caminando
            tr = {
                x: doorPos.x + 160,
                y: doorPos.y + doorOpened.displayHeight * 0.95,
                scale: 0.07
            };
            let alex = new Character(this, "Alex_side", tr, this.portraitTr, () => { });
            alex.setScale(-tr.scale, tr.scale);
            alex.setDepth(this.row1Tables.depth - 1);
            alex.setAnimation("Walk", true);
            alex.charContainer.setMask(mask);
            alex.setAnimSpeed(0.6);
            alex.portrait.visible = false;


            // Animacion de Alex entrando a la clase
            let finalX = tr.x - 380
            let walkingIn = this.tweens.add({
                targets: [alex.char],
                x: { from: tr.x, to: finalX },
                duration: 4000,
                repeat: 0,
            });

            // Cuando termina la animacion,
            walkingIn.on('complete', () => {
                // Se oculta la espina de Alex de perfil
                alex.setActive(false);

                // Alex de frente
                tr = {
                    x: finalX,
                    y: tr.y + 10,
                    scale: tr.scale
                };
                alex = new Character(this, "Alex_front", tr, this.portraitTr, () => { });
                alex.setScale(-tr.scale, tr.scale);
                alex.setDepth(this.row1Tables.depth - 1);
                alex.setAnimation("IdleBase", true);
                this.portraits.set("Alex", alex.getPortrait());

                // Se actualiza el dialogManager con el nuevo retrato
                this.dialogManager.changeScene(this);

                // Se ponen los dialogos que hay despues de que Alex entre en clase
                let node = super.readNodes(nodes, "day1\\classBackMorningDay1", "afterEnter", true);
                this.dialogManager.setNode(node);

            });

        });


        // Evento llamado cuando el profesor termina su segundo dialogo
        this.dispatcher.addOnce("startBreak", this, (obj) => {
            let sceneName = 'TextOnlyScene';

            // Se obtiene el texto de la escena de transicion del archivo de traducciones 
            let text = this.i18next.t("day1.startBreak", { ns: "transitionScenes", returnObjects: true });

            let params = {
                text: text,
                onComplete: () => {
                    this.gameManager.changeScene('ClassBackBreakDay1');
                },
                onCompleteDelay: 500
            };

            // Se cambia a la escena de transicion
            this.gameManager.changeScene(sceneName, params);

            // Se reactiva el icono del telefono
            this.phoneManager.activate(true);
        });
    }
}
