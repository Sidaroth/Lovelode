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

    function cameraSetup() {
        const camera = state.getScene().cameras.main;
        camera.setViewport(0, 0, gameConfig.GAME.VIEWWIDTH, gameConfig.GAME.VIEWHEIGHT);
        camera.removeBounds();
        camera.setZoom(1);
    }

    function create() {
        tileMap = generateWorld(state.getScene());

        // Set level bounds.
        const surfaceOffset = gameConfig.WORLD.tileHeight * 10;
        const skyLimit = -surfaceOffset; // how much higher do we want to be able to fly.
        const boundWidth = gameConfig.WORLD.tileWidth * gameConfig.WORLD.tilesInWidth;
        const boundHeight = gameConfig.WORLD.tileHeight * gameConfig.WORLD.tilesInHeight + surfaceOffset + -skyLimit;
        state.getScene().matter.world.setBounds(0, skyLimit, boundWidth, boundHeight);

        state.emitGlobal(eventConfig.SOUND.PLAY_MUSIC);
        cameraSetup();
    }

    function update(time, delta) {}

    const localState = {
        create,
        update,
    };

    return createState('World', state, {
        localState,
        canEmit: canEmit(state),
        isScene: isScene(state, gameConfig.SCENES.WORLD),
    });
};

export default World;
