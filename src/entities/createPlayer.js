import isGameEntity from 'components/entities/isGameEntity';
import canEmit from 'components/events/canEmit';
import hasPosition from 'components/hasPosition';
import hasSprite from 'components/entities/hasSprite';
import hasParentScene from 'components/hasParentScene';
import hasMatterPhysics from 'components/entities/hasMatterPhysics';
import hasAnimation from 'components/entities/hasAnimation';
import createState from 'utils/createState';
import hasInput from 'components/hasInput';
import canListen from 'components/events/canListen';
import eventConfig from 'configs/eventConfig';
import gameConfig from 'configs/gameConfig';
import hasSound from 'components/hasSound';
import createTriggerZone from './createTriggerZone';

const createPlayer = function createPlayerFunc(scene, tileKey) {
    const state = {};

    // private
    let drillZone;
    const hullMax = 100;
    const hullCurrent = 100;
    const cargoCapacity = 100;
    const currentCargoWeight = 0;
    const fuelCapacity = 100;
    const currentFuel = 100;
    const thrustForce = 1;

    function _onMovement(data) {
        const { delta, direction } = data;
        const frameDelta = delta / 1000;
        const gravity = state.getParentScene().matter.world.localWorld.gravity.y;

        if (direction[gameConfig.DIRECTIONS.RIGHT]) {
            state.applyForce({ x: thrustForce * frameDelta, y: 0 });
            state.setFlipX(false);
        }

        if (direction[gameConfig.DIRECTIONS.LEFT]) {
            state.applyForce({ x: -thrustForce * frameDelta, y: 0 });
            state.setFlipX(true);
        }

        if (direction[gameConfig.DIRECTIONS.UP]) {
            state.applyForce({ y: (-thrustForce - gravity / 2) * frameDelta, x: 0 });
        }

        if (direction[gameConfig.DIRECTIONS.DOWN]) {
            state.applyForce({ y: thrustForce * frameDelta, x: 0 });
        }
    }

    function update(time) {
        return time;
    }

    function setupListeners() {
        state.listenOn(state, eventConfig.EVENTS.MOVEMENT, _onMovement, state);
    }

    function __created() {
        setupListeners();
        state.setCollisionCategory(gameConfig.COLLISION.player);
        state.setCollidesWith(gameConfig.COLLISION.tiles);
    }

    // Public
    const localState = { __created, update };

    // These are the substates, or components, that describe the functionality of the resulting object.
    return createState('Player', state, {
        localState,
        isGameEntity: isGameEntity(state),
        hasPosition: hasPosition(state),
        hasParentScene: hasParentScene(state, scene),
        canEmit: canEmit(state),
        canListen: canListen(state),
        hasSprite: hasSprite(state, tileKey),
        hasPhysics: hasMatterPhysics(state),
        hasAnimation: hasAnimation(state),
        hasInput: hasInput(state),
        hasSound: hasSound(state),
    });
};

export default createPlayer;
