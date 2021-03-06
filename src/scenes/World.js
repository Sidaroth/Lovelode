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
import createUpgradeShop from 'entities/createUpgradeShop';
import createGarage from 'entities/createGarage';

/**
 * The game world (i.e level 1)
 */
const World = function WorldFunc() {
    const state = {};
    let tileMap;
    let surfaceOffset;

    let gasStation;
    let store;
    let upgradeShop;
    let garage;

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
        // TODO beautify.
        const buildingScale = 1.75;
        gasStation = createGasStation(state.getScene());
        gasStation.setScale(buildingScale);

        const gasPos = {
            x: (gasStation.getSprite().width / 2) * buildingScale + 150,
            y: surfaceOffset - (gasStation.getSprite().height / 2) * buildingScale,
        };
        gasStation.setPosition(gasPos);

        store = createStore(state.getScene());
        store.setScale(buildingScale);
        const storePos = {
            x: (store.getSprite().width / 2) * buildingScale + (150 + 250 * buildingScale),
            y: surfaceOffset - (store.getSprite().height / 2) * buildingScale,
        };
        store.setPosition(storePos);

        upgradeShop = createUpgradeShop(state.getScene());
        upgradeShop.setScale(buildingScale);
        const shopPos = {
            x: (upgradeShop.getSprite().width / 2) * buildingScale + (150 + 500 * buildingScale),
            y: surfaceOffset - (upgradeShop.getSprite().height / 2) * buildingScale,
        };
        upgradeShop.setPosition(shopPos);

        garage = createGarage(state.getScene());
        garage.setScale(buildingScale);
        const garagePos = {
            x: (garage.getSprite().width / 2) * buildingScale + (150 + 750 * buildingScale),
            y: surfaceOffset - (garage.getSprite().height / 2) * buildingScale,
        };
        garage.setPosition(garagePos);
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
        // Tiles need update for drilling purposes. They keep an internal timer etc.
        for (let i = 0; i < tileMap.length; i += 1) {
            const tile = tileMap[i];
            if (tile) {
                tile.update(time);
            }
        }

        // update buildings for their interaction zones.
        gasStation.update();
        store.update();
        garage.update();
        upgradeShop.update();
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
