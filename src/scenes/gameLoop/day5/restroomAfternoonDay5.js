
import RestroomBase from '../baseScenarios/restroomBase.js';

export default class RestroomAfternoonDay5 extends RestroomBase {
    constructor() {
        super("RestroomAfternoonDay5");
    }

    create(params) {
        super.create(params);

        // Puerta al pasillo
        this.doorNode = null;
        let doorPos = {
            x: 1003 * this.scale,
            y: 168 * this.scale
        };
        let doorClosed = this.add.image(doorPos.x, doorPos.y, this.atlasName, 'restroomDoorClosed').setOrigin(0, 0).setScale(this.scale);
        doorClosed.setInteractive({ useHandCursor: true });
        doorClosed.on('pointerdown', () => {
            this.dialogManager.setNode(doorNode);
        });

        // Profesor
        let tr = {
            x: 1295 * this.scale,
            y: 1370 * this.scale,
            scale: 0.16
        };
        let teacher = this.add.image(tr.x, tr.y, 'teacher').setOrigin(0.5, 1).setScale(tr.scale);
        let teacherPortrait = this.add.image(this.portraitTr.x, this.portraitTr.y + 20, 'teacher').setOrigin(0.5, 1).setScale(this.portraitTr.scale);
        this.portraits.set("teacher", teacherPortrait);
        teacher.visible = false;

        let nodes = this.cache.json.get('restroomAfternoonDay5');
        let doorNode = super.readNodes(nodes, "day5\\restroomAfternoonDay5", "door_enter", true);
        let enterNode = super.readNodes(nodes, "day5\\restroomAfternoonDay5", "enter", true);

        let BLACKOUT_TIMER = 15 * 1000;

        let black = this.add.rectangle(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT, 0x000, 1).setOrigin(0, 0).setScrollFactor(0).setDepth(this.stall3.depth + 1);
        black.visible = false;


        // Se muestra el dialogo de nada mas entrar directamente
        setTimeout(() => {
            this.dialogManager.setNode(enterNode);
        }, 100);


        this.dispatcher.addOnce("lightsOff", this, (obj) => {
            black.visible = true;

            // Se desactiva el icono del telefono para que no se pueda sacar durante esta escena
            this.phoneManager.activate(false);
        });

        this.dispatcher.addOnce("startTimer", this, (obj) => {
            // Forma geometrica para poder interactuar con los lavabos
            let graphics = this.add.graphics(0, 0);
            let sinkPolygon = new Phaser.Geom.Polygon([
                0, 80,
                240, 140,
                240, 430,
                450, 430,
                0, 830
            ]);
            // graphics.lineStyle(5, 0xFF00FF, 1.0).fillStyle(0xFFF, 1.0).fillPoints(sinkPolygon.points, true);
            graphics.generateTexture('sink', this.rightBound, this.CANVAS_HEIGHT);
            let sink = this.add.image(0, 0, 'sink').setOrigin(0, 0).setDepth(200);
            graphics.destroy();

            // Para las areas interactuables con forma de poligono, hay que hacerlas primero interactivas
            // y luego cambiar el cursor manualmente, ya que si no, toda la textura se vuelve interactuable
            sink.setInteractive(sinkPolygon, Phaser.Geom.Polygon.Contains);
            sink.input.cursor = 'pointer';
            sink.on('pointerdown', () => {
                this.dialogManager.setNode(sinkNode);
            });


            // Forma geometrica para poder interactuar con el suelo
            graphics = this.add.graphics(0, 0);
            let floorPolygon = new Phaser.Geom.Polygon([
                820, 670,
                870, 860,
                1390, 860,
                1180, 670
            ]);
            // graphics.lineStyle(5, 0xFF00FF, 1.0).fillStyle(0xFFF, 1.0).fillPoints(floorPolygon.points, true);
            graphics.generateTexture('floor', this.rightBound, this.CANVAS_HEIGHT);
            let floor = this.add.image(0, 0, 'floor').setOrigin(0, 0).setDepth(200);
            graphics.destroy();

            // Para las areas interactuables con forma de poligono, hay que hacerlas primero interactivas
            // y luego cambiar el cursor manualmente, ya que si no, toda la textura se vuelve interactuable
            floor.setInteractive(floorPolygon, Phaser.Geom.Polygon.Contains);
            floor.input.cursor = 'pointer';
            floor.on('pointerdown', () => {
                this.dialogManager.setNode(floorNode);
            });

            doorNode = super.readNodes(nodes, "day5\\restroomAfternoonDay5", "door_locked", true);
            let sinkNode = super.readNodes(nodes, "day5\\restroomAfternoonDay5", "sink", true);
            let floorNode = super.readNodes(nodes, "day5\\restroomAfternoonDay5", "floor", true);

            // Anade un temporizador durante el que el jugador puede interactuar con los elementos del fondo.
            // Cuando acabe el temporizador, volveran las luces, aparecera el profesor y comenzara su dialogo 
            setTimeout(() => {
                black.visible = false;
                this.dialogManager.textbox.activate(false, () => {
                    this.dialogManager.setNode(null);
                    let lightOnNode = super.readNodes(nodes, "day5\\restroomAfternoonDay5", "lightsOn", true);
                    this.dialogManager.setNode(lightOnNode);

                    doorNode = null;
                    sink.disableInteractive();
                    floor.disableInteractive();
                });
            }, BLACKOUT_TIMER);
        });


        // Evento que se llama cuando el profesor entra en el bano. Hace que la imagen del profesor sea visible 
        this.dispatcher.addOnce("enterTeacher", this, (obj) => {
            teacher.visible = true;
        });

        this.dispatcher.addOnce("goHome", this, (obj) => {
            let sceneName = 'TextOnlyScene';

            // Se obtiene el texto de la escena de transicion del archivo de traducciones 
            let text = this.i18next.t("day5.endDay", { ns: "transitionScenes", returnObjects: true });

            let params = {
                text: text,
                onComplete: () => {
                    this.gameManager.changeScene("NightmareDay5");
                },
                onCompleteDelay: 500
            };

            // Se cambia a la escena de transicion
            this.gameManager.changeScene(sceneName, params);

        });
    }
}