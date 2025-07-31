export default class Character extends SpinePlugin.SpineGameObject {
    constructor(scene, x, y, key, onClick, animationName = "Idle01", animationSpeed = 0.6, loop = true) {
        super(scene, scene.spine, x, y, key, animationName, loop);
        scene.sys.displayList.add(this);
        scene.sys.updateList.add(this);
        
        this.key = key;
        
        this.setAnimationSpeed(animationSpeed);
        this.setAnimation(animationName, loop);

        scene.setInteractive(key, this, onClick);
    }

    setAnimation(animationName, loop = true) {
        if (animationName != this.getCurrentAnimationName) {
            super.setAnimation(0, animationName, loop);
        }
    }
    getCurrentAnimationName() {
        return (this.getCurrentAnimation() == null) ? null : this.getCurrentAnimation().name;
    }
    
    setLoop(loop) {
        this.state.getCurrent(0).loop = loop;
    }
    isLooping() {
        return this.state.getCurrent(0).loop;
    }

    setAnimationSpeed(speed) {
        this.state.timeScale = speed;
    }

    clone(scene) {
        let clone = new Character(scene, this.x, this.y, this.key, () => { }, this.getCurrentAnimationName(), this.state.timeScale, this.isLooping());
        const currentTrack = this.state.getCurrent(0);

        if (currentTrack != null) {
            // console.log(currentTrack);
            // console.log(clone.state.getCurrent(0));
            clone.state.getCurrent(0).trackLast = currentTrack.trackLast;
            clone.state.getCurrent(0).trackTime = currentTrack.trackTime;
            clone.state.getCurrent(0).nextAnimationLast = currentTrack.nextAnimationLast;
            clone.state.getCurrent(0).nextTrackLast = currentTrack.nextTrackLast;
        }

        return clone; 
    }
}