import generateWorld from '../world/generateWorld';
import isScene from '../components/isScene';
import gameConfig from 'configs/gameConfig';
import createState from 'utils/createState';
import canEmit from 'components/events/canEmit';
import eventConfig from 'configs/eventConfig';
import canListen from 'components/events/canListen';
import tileConfig from 'configs/tileConfig';
import createGasStation from 'entities/createGasStation';
import createStore from 'entities/createStore';

/**
 * The game world (i.e level 1)
 */
const World = function WorldFunc() {
    const state = {};
    let tileMap;
    let surfaceOffset;

    const worldBounds = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    };

    function cameraSetup() {
        const camera = state.getScene().cameras.main;
        camera.setViewport(0, 0, gameConfig.GAME.VIEWWIDTH, gameConfig.GAME.VIEWHEIGHT);
        camera.setZoom(1);
        camera.setBounds(0, worldBounds.y, worldBounds.width, worldBounds.height);
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

    function createBuildings() {
        const buildingScale = 2;
        const gasStation = createGasStation(state.getScene());
        gasStation.setScale(buildingScale);

        const gasPos = {
            x: (gasStation.getSprite().width / 2) * buildingScale + 150,
            y: surfaceOffset - (gasStation.getSprite().height / 2) * buildingScale,
        };
        gasStation.setPosition(gasPos);

        const store = createStore(state.getScene());
        store.setScale(buildingScale);
        const storePos = {
            x: (store.getSprite().width / 2) * buildingScale + 700,
            y: surfaceOffset - (store.getSprite().height / 2) * buildingScale,
        };
        store.setPosition(storePos);
    }

    function create() {
        tileMap = generateWorld(state.getScene());

        // Set level bounds.
        surfaceOffset = tileConfig.DATA.tileHeight * tileConfig.DATA.tileScale * 10; // how many tileHeights from the top (0, 0) do we want to move them.
        const skyLimit = -surfaceOffset; // how much higher do we want to be able to fly.
        const boundWidth = tileConfig.DATA.tileWidth * tileConfig.DATA.tileScale * gameConfig.WORLD.tilesInWidth;
        const boundHeight =
            tileConfig.DATA.tileHeight * tileConfig.DATA.tileScale * gameConfig.WORLD.tilesInHeight + surfaceOffset + -skyLimit;

        worldBounds.x = 0;
        worldBounds.y = skyLimit;
        worldBounds.width = boundWidth;
        worldBounds.height = boundHeight;
        state.getScene().matter.world.setBounds(0, skyLimit, boundWidth, boundHeight);

        state.emitGlobal(eventConfig.SOUND.PLAY_MUSIC);
        cameraSetup();

        state.listenGlobal(eventConfig.DRILLING.FINISHED, onDrillingFinished);

        createBuildings();
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
