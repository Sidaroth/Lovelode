import gameConfig from 'configs/gameConfig';
import AudioManager from 'core/createAudioManager';
import UI from 'scenes/UI';
import World from 'scenes/World';
import canListen from 'components/events/canListen';
import createPlayer from 'entities/createPlayer';
import store from '../store';
import isScene from '../components/isScene';
import createState from 'utils/createState';
import createKeyboardInput from 'core/createKeyboardInput';

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
        state.getScene().scene.add(gameConfig.SCENES.WORLD, worldScene.getScene(), true);

        UIScene = UI();
        state.getScene().scene.add(gameConfig.SCENES.UI, UIScene.getScene(), true);
        audioManager = AudioManager(UIScene.getScene());

        store.keyboard = createKeyboardInput();
        store.keyboard.enable();
    }

    function create() {
        audioManager.playMusic();
        cameraSetup();

        const player = createPlayer(worldScene.getScene(), 'SideDrive/digger_side_drive02.png');
        store.players.push(player);
        player.setPosition({ x: gameConfig.GAME.VIEWWIDTH / 2, y: gameConfig.GAME.VIEWHEIGHT / 2 });
        player.setStaticStatus(false);
    }

    function update(time, delta) {
        store.players.forEach(player => player.update(time, delta));
    }

    function destroy() {
        if (store.keyboard) store.keyboard.disable();
        if (UI) UI.destroy();
    }

    const localState = {
        // props
        // methods
        init,
        create,
        update,
        destroy,
    };

    return createState('Game', state, {
        localState,
        canListen: canListen(state),
        isScene: isScene(state, gameConfig.SCENES.GAME),
    });
};

export default Game;
