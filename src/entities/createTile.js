import hasPosition from 'components/hasPosition';
import hasSprite from 'components/entities/hasSprite';
import hasParentScene from 'components/hasParentScene';
import isGameEntity from 'components/entities/isGameEntity';
import createState from 'utils/createState';
import hasMatterPhysics from 'components/entities/hasMatterPhysics';
import hasSize from 'components/hasSize';
import gameConfig from 'configs/gameConfig';
import eventConfig from 'configs/eventConfig';
import canListen from 'components/events/canListen';
import canEmit from 'components/events/canEmit';

const createTile = function createTileFunc(scene, tilekey) {
    const state = {};

    let internalTimer = 0;
    let endTime = 0;
    let timerRunning = false;

    let density = 1000; // used to calculate drilling time.

    function onDrillingStart(data) {
        if (data.body.id !== state.getSprite().body.id || !data.body) return;

        timerRunning = true;
        internalTimer = Date.now();
        endTime = internalTimer + density / data.drillSpeed; // TODO fix a better formula.
    }

    function setDensity(newDensity) {
        density = newDensity;
    }

    function onDrillingCanceled(data) {
        if ((data && data.body && data.body.id !== state.getSprite().body.id) || !data.body) return;
        timerRunning = false;

        // reset any drill progress on sprite too...
    }

    function __created() {
        state.setCollisionCategory(gameConfig.COLLISION.tiles);
        state.setCollidesWith(gameConfig.COLLISION.player);
        state.setSize({ w: gameConfig.WORLD.tileWidth, h: gameConfig.WORLD.tileHeight });

        // listeners
        state.listenGlobal(eventConfig.DRILLING.START, onDrillingStart);
        state.listenGlobal(eventConfig.DRILLING.CANCEL, onDrillingCanceled);
    }

    function updateSprite() {
        // add drill effects to sprite;
    }

    function update(time) {
        if (timerRunning) {
            internalTimer += time.delta;

            updateSprite();

            if (internalTimer > endTime) {
                const emitData = {
                    tileId: state.id,
                    loot: null,
                };

                timerRunning = false;
                state.emitGlobal(eventConfig.DRILLING.FINISHED, emitData);
            }
        }

        return time;
    }

    // public
    const localState = { __created, update, setDensity };

    return createState('Tile', state, {
        localState,
        isGameEntity: isGameEntity(state),
        hasParentScene: hasParentScene(state, scene),
        hasPosition: hasPosition(state),
        hasSize: hasSize(state),
        canListen: canListen(state),
        canEmit: canEmit(state),
        hasSprite: hasSprite(state, tilekey),
        hasMatterPhysics: hasMatterPhysics(state),
    });
};

export default createTile;
