import BaseScene from './baseScene.js';
import Character from '../character.js';

export default class Test2 extends BaseScene {
    constructor() {
        super('Test2');
    }

    create() {
        super.create();


        // IMPORTANTE: LLAMARLO CUANDO SE HAYA CREADO LA ESCENA
        this.dialogManager.changeScene(this);
    }
}