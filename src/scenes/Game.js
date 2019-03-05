import Phaser from 'phaser';
import gameConfig from 'configs/gameConfig';
import spriteConfig from 'configs/spriteConfig';
import AudioManager from 'core/createAudioManager';
import UI from 'scenes/UI';
import World from 'scenes/World';
import getFunctionUsage from 'utils/getFunctionUsage';
import canListen from 'components/events/canListen';
import pipe from 'utils/pipe';

/**
 * Responsible for delegating the various levels, holding the various core systems and such.
 */
const Game = function GameFunc() {
    const state = {};
    const sceneInstance = new Phaser.Scene(gameConfig.SCENES.GAME);
    let audioManager;
    let UIScene;
    let background;
    let worldScene;

    function getSceneInstance() {
        return sceneInstance;
    }

    function cameraSetup() {
        sceneInstance.cameras.main.setViewport(0, 0, gameConfig.GAME.VIEWWIDTH, gameConfig.GAME.VIEWHEIGHT);
        sceneInstance.cameras.main.setZoom(0.8);
    }

    sceneInstance.init = () => {
        // After assets are loaded.
        UIScene = UI();
        sceneInstance.scene.add(gameConfig.SCENES.UI, UIScene, true);
        audioManager = AudioManager()
            .setScene(UIScene)
            .setPauseOnBlur(true)
            .init();

        worldScene = World();
        sceneInstance.scene.add(gameConfig.SCENES.WORLD, worldScene.getSceneInstance(), true);
    };

    sceneInstance.create = () => {
        background = sceneInstance.add.image(0, 0, spriteConfig.UIELEMENTS.BACKGROUND.KEY);
        background.setOrigin(0, 0);
        audioManager.playMusic();
        cameraSetup();
    };

    sceneInstance.update = (time, delta) => {};

    sceneInstance.destroy = () => {
        if (background) background.destroy();
        if (UI) UI.destroy();
    };

    const localState = {
        // props
        // methods
        getSceneInstance,
    };

    const canListenState = canListen(state);
    const states = [{ state, name: 'state' }, { state: localState, name: 'localState' }, { state: canListenState, name: 'canListen' }];

    getFunctionUsage(states, 'Game');
    return Object.assign(...states.map(s => s.state), {
        // pipes and overrides
        update: pipe(
            state.update, // Phaser 'inheritance' update()/super call to phaser.scene
            localState.update, // internal/local state update()
        ),
        destroy: pipe(
            localState.destroy,
            canListenState.destroy,
        ),
    });
};

export default Game;
