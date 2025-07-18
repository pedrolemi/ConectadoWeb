import Singleton from "../../framework/utils/singleton.js";
import NodeReader from "../../framework/dialog/nodeReader.js";
import EventDispatcher from "../../framework/managers/eventDispatcher.js";
import DefaultEventNames from "../../framework/utils/eventNames.js";

import LocalizationManager from "../../framework/managers/localizationManager.js";
import GameManager from "./gameManager.js";

export default class DialogManager extends Singleton {
    constructor() {
        super("DialogManager");

        this.currNode = null;
        this.nodeReader = new NodeReader();
        this.dispatcher = EventDispatcher.getInstance();
        this.dispatcher.add(DefaultEventNames.clearNodes, this, () => {
            this.clearNodes();
        }, true);

        this.localizationManager = LocalizationManager.getInstance();
        this.gameManager = GameManager.getInstance();
    }

    init() { }

    setCharacters(characters) {
        this.characters = characters;
    }

    setNode(node) {
        if (this.currNode == null && node != null) {
            this.currNode = node;
            this.currNode.processNode();
        }
        else {
            console.warn("Node not processed:", node);
        }
    }

    clearNodes() {
        this.currNode = null;
    }

    /**
    * Lee los nodos con el nodeReader y los traduce
    * @param {Phaser.Scene} scene - escena en la que se crea el nodo
    * @param {Object} fullJson - objeto json donde estan los nodos 
    * @param {String} namespace - nombre del archivo de localizacion del que se va a leer 
    * @param {String} objectName - nombre del objeto en el que esta el dialogo, si es que el json contiene varios dialogos de distintos objetos (opcional)
    * @param {Object} otherOptions - parametros que pasarle a i18n (opcional) 
    * @returns {DialogNode} - nodo raiz de los nodos leidos
    */
    readNodes(scene, file, namespace, objectName = "", otherOptions = {}) {
        let nodes = this.nodeReader.readNodes(scene, file, namespace, objectName);
        
        otherOptions.context = this.gameManager.blackboard.get("gender");
        otherOptions.name = this.gameManager.blackboard.get("name");
        nodes.forEach((node) => {
            node.translate(this.localizationManager, namespace, otherOptions);
        });
        return nodes.get("root");
    }
}