import Phaser from 'phaser';

/**
 * Hook into phasers scene lifecycle.
 */
const isScene = function isSceneFunc(state, sceneKey) {
    if (!sceneKey) {
        throw new Error('Missing sceneKey');
    }

    const scene = new Phaser.Scene(sceneKey);

    scene.create = () => {
        if (state.create) state.create();
    };

    scene.init = () => {
        if (state.init) state.init();
    };

    scene.update = (runtime, delta) => {
        if (state.update) state.update(runtime, delta);
    };

    scene.preload = () => {
        if (state.preload) state.preload();
    };

    scene.destroy = () => {
        if (state.destroy) state.destroy();
    };

    // Used when something requires the phaser internal scene reference.
    function getScene() {
        return scene;
    }

    return {
        getScene,
    };
};

export default isScene;
