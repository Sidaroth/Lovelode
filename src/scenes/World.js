import generateWorld from '../world/generateWorld';
import isScene from '../components/isScene';
import gameConfig from 'configs/gameConfig';
import createState from 'utils/createState';
import canEmit from 'components/events/canEmit';
import eventConfig from 'configs/eventConfig';
import canListen from 'components/events/canListen';
import tileConfig from 'configs/tileConfig';

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

    function onDrillingFinished(data) {
        const { tileId } = data;

        const index = tileMap.findIndex(tile => tile && tile.id === tileId);
        if (index && tileMap[index]) {
            tileMap[index].destroy();
            delete tileMap[index];
            tileMap[index] = null;
        }
    }

    function create() {
        tileMap = generateWorld(state.getScene());

        // Set level bounds.
        const surfaceOffset = tileConfig.DATA.tileHeight * tileConfig.DATA.tileScale * 10; // how many tileHeights from the top (0, 0) do we want to move them.
        const skyLimit = -surfaceOffset; // how much higher do we want to be able to fly.
        const boundWidth = tileConfig.DATA.tileWidth * tileConfig.DATA.tileScale * gameConfig.WORLD.tilesInWidth;
        const boundHeight =
            tileConfig.DATA.tileHeight * tileConfig.DATA.tileScale * gameConfig.WORLD.tilesInHeight + surfaceOffset + -skyLimit;
        state.getScene().matter.world.setBounds(0, skyLimit, boundWidth, boundHeight);

        state.emitGlobal(eventConfig.SOUND.PLAY_MUSIC);
        cameraSetup();

        state.listenGlobal(eventConfig.DRILLING.FINISHED, onDrillingFinished);
    }

    function update(time) {
        for (let i = 0; i < tileMap.length; i += 1) {
            const tile = tileMap[i];
            if (tile) {
                tile.update(time);
            }
        }
    }

    const localState = {
        create,
        update,
    };

    return createState('World', state, {
        localState,
        canEmit: canEmit(state),
        canListen: canListen(state),
        isScene: isScene(state, gameConfig.SCENES.WORLD),
    });
};

export default World;
