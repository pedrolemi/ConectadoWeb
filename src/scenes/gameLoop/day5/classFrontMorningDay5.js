import ClassFrontBase from "../baseScenarios/classFrontBase.js";

export default class ClassFrontMorningDay5 extends ClassFrontBase {
    constructor() {
        super('ClassFrontMorningDay5');
    }

    create(params) {
        super.create(params);
        
        let teacher = this.add.image(this.portraitTr.x, this.portraitTr.y + 20, 'characters', 'teacher').setOrigin(0.5, 1).setScale(this.portraitTr.scale);
        this.portraits.set("teacher", teacher);

        // Se pone el nodo de dialogo al interactuar con las mesas
        let nodes = this.cache.json.get('everydayDialog');
        this.tablesNode = super.readNodes(nodes, "everydayDialog", "class.table", true);

        
        // Evento llamado cuando terminan los dialogos y empieza la clase
        this.dispatcher.addOnce("startClass", this, (obj) => {
            console.log(obj);

            let sceneName = 'TextOnlyScene';

            // Se obtiene el texto de la escena de transicion del archivo de traducciones 
            let text = this.i18next.t("day5.startClass", { ns: "transitionScenes", returnObjects: true });
            
            let params = {
                text: text,
                onComplete: () => {
                    this.gameManager.changeScene("ClassBackAfternoonDay5");
                },
                onCompleteDelay: 500
            };

            // Se cambia a la escena de transicion
            this.gameManager.changeScene(sceneName, params);
        });
    }
}
