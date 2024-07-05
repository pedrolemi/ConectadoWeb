export default class UIManager{
    constructor(scene) {
        let sceneName = 'DialogManager';
        scene.scene.launch(sceneName);
        this.dialogManager = scene.scene.get(sceneName);
    }

    getDialogManager() {
        return this.dialogManager;
    }

}