import gameConfig from 'configs/gameConfig';
import AudioManager from 'core/createAudioManager';
import createUI from 'scenes/UI';
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
    let UIScene;
    let worldScene;

    function init() {
        // After assets are loaded. Before create.
        UIScene = createUI();
        state.getScene().scene.add(gameConfig.SCENES.UI, UIScene.getScene(), true);
        AudioManager(UIScene.getScene());

        worldScene = World();
        state.getScene().scene.add(gameConfig.SCENES.WORLD, worldScene.getScene(), true);

        store.keyboard = createKeyboardInput();
        store.keyboard.enable();

        state.getScene().scene.bringToTop(UIScene.getScene()); // make sure UI elements are always displayed above any other scenes.
    }

    function create() {
        store.players.push(createPlayer(worldScene.getScene(), 'SideDriveDig/digger_side_drivedig00.png'));
        worldScene.getScene().cameras.main.startFollow(store.players[0].getSprite(), true, 0.5, 0.5);
        [window.player] = store.players;
    }

    function update(time) {
        store.players.forEach(player => player.update(time));
    }

    function destroy() {
        if (store.keyboard) store.keyboard.disable();
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
