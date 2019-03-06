import gameConfig from 'configs/gameConfig';
import AudioManager from 'core/createAudioManager';
import UI from 'scenes/UI';
import World from 'scenes/World';
import getFunctionUsage from 'utils/getFunctionUsage';
import canListen from 'components/events/canListen';
import pipe from 'utils/pipe';
import createPlayer from 'entities/createPlayer';
import store from '../store';
import isScene from './isScene';

/**
 * Responsible for delegating the various levels, holding the various core systems and such.
 */
const Game = function GameFunc() {
    const state = {};
    let audioManager;
    let UIScene;
    let worldScene;

    function cameraSetup() {
        state.getScene().cameras.main.setViewport(0, 0, gameConfig.GAME.VIEWWIDTH, gameConfig.GAME.VIEWHEIGHT);
        state.getScene().cameras.main.setZoom(0.8);
    }

    function init() {
        // After assets are loaded. Before create.
        worldScene = World();
        state.getScene().scene.add(gameConfig.SCENES.WORLD, worldScene.getSceneInstance(), true);

        UIScene = UI();
        state.getScene().scene.add(gameConfig.SCENES.UI, UIScene, true);
        audioManager = AudioManager()
            .setScene(UIScene)
            .setPauseOnBlur(true)
            .init();
    }

    function create() {
        audioManager.playMusic();
        cameraSetup();

        const player = createPlayer(worldScene.getSceneInstance(), 'SideDrive/digger_side_drive02.png');
        store.players.push(player);
        player.setPosition({ x: gameConfig.GAME.VIEWWIDTH / 2, y: gameConfig.GAME.VIEWHEIGHT / 2 });
    }

    function update(time, delta) {}

    function destroy() {
        if (UI) UI.destroy();
        if (worldScene) worldScene.destroy();
    }

    const localState = {
        // props
        // methods
    };

    const canListenState = canListen(state);
    const isSceneState = isScene(state, gameConfig.SCENES.GAME);
    const states = [
        { state, name: 'state' },
        { state: localState, name: 'localState' },
        { state: canListenState, name: 'canListen' },
        { state: isSceneState, name: 'isScene' },
    ];

    getFunctionUsage(states, 'Game');
    return Object.assign(...states.map(s => s.state), {
        // pipes and overrides
        init,
        create,
        update,
        destroy: pipe(
            destroy,
            canListenState.destroy,
        ),
    });
};

export default Game;
