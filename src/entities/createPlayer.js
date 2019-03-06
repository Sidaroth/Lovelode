import isGameEntity from 'components/entities/isGameEntity';
import canEmit from 'components/events/canEmit';
import hasPosition from 'components/hasPosition';
import hasCollision from 'components/entities/hasCollision';
import hasSprite from 'components/entities/hasSprite';
import hasParentScene from 'components/hasParentScene';
import hasPhysics from 'components/entities/hasPhysics';
import hasAnimation from 'components/entities/hasAnimation';
import createState from 'utils/createState';
import hasInput from 'components/hasInput';
import canListen from 'components/events/canListen';
import eventConfig from 'configs/eventConfig';

const createPlayer = function createPlayerFunc(scene, tileKey) {
    const state = {};

    // private
    const hullMax = 100;
    const hullCurrent = 100;
    const cargoCapacity = 100;
    const currentCargoWeight = 0;
    const fuelCapacity = 100;
    const currentFuel = 100;

    function _onMovement(evt) {
        if (!evt.repeat) {
            console.log(`now moving ${evt.direction}`);
        }
    }

    function setupListeners() {
        state.listenOn(state, eventConfig.EVENTS.MOVEMENT, _onMovement, state);
    }

    function __constructor() {
        setupListeners();
    }

    // Public
    const localState = { __constructor };

    // These are the substates, or components, that describe the functionality of the resulting object.
    return createState('Player', state, {
        localState,
        isGameEntity: isGameEntity(state),
        hasPosition: hasPosition(state),
        hasParentScene: hasParentScene(state, scene),
        canEmit: canEmit(state),
        canListen: canListen(state),
        hasSprite: hasSprite(state, tileKey),
        hasCollision: hasCollision(state),
        hasPhysics: hasPhysics(state),
        hasAnimation: hasAnimation(state),
        hasInput: hasInput(state),
    });
};

export default createPlayer;
