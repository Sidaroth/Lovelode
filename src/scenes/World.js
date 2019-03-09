import generateWorld from '../world/generateWorld';
import isScene from '../components/isScene';
import gameConfig from 'configs/gameConfig';
import createState from 'utils/createState';
import canEmit from 'components/events/canEmit';
import eventConfig from 'configs/eventConfig';

/**
 * The game world (i.e level 1)
 */
const World = function WorldFunc() {
    const state = {};
    let tileMap;

    function create() {
        tileMap = generateWorld(state.getScene());

        // Set level bounds.
        const surfaceOffset = gameConfig.WORLD.tileHeight * 10;
        state
            .getScene()
            .matter.world.setBounds(
                0,
                0,
                gameConfig.WORLD.tileWidth * gameConfig.WORLD.tilesInWidth,
                gameConfig.WORLD.tileHeight * gameConfig.WORLD.tilesInHeight + surfaceOffset,
            );

        state.emitGlobal(eventConfig.EVENTS.SOUND.PLAY_MUSIC);
    }

    const localState = {
        create,
    };

    return createState('World', state, {
        localState,
        canEmit: canEmit(state),
        isScene: isScene(state, gameConfig.SCENES.WORLD),
    });
};

export default World;
