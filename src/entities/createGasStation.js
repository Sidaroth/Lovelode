import createState from 'utils/createState';
import hasSprite from 'components/entities/hasSprite';
import canListen from 'components/events/canListen';
import canEmit from 'components/events/canEmit';
import hasParentScene from 'components/hasParentScene';
import hasPosition from 'components/hasPosition';
import hasTriggerZone from 'components/entities/hasTriggerZone';
import eventConfig from 'configs/eventConfig';

/**
 * The building where the player(s) will go to refuel their diggers.
 */
const createGasStation = function createGasStationFunc(scene) {
    const state = {};

    function onInteractionEnter(entity) {
        console.log('enter gas station');
    }

    function onInteractionExit(entity) {
        console.log('exit gas station');
    }

    function __created() {
        state.listenOn(state, eventConfig.TRIGGER.ENTER, onInteractionEnter);
        state.listenOn(state, eventConfig.TRIGGER.EXIT, onInteractionExit);
    }

    const localState = {
        __created,
    };

    return createState('GasStation', state, {
        localState,
        hasTriggerZone: hasTriggerZone(state),
        hasParentScene: hasParentScene(state, scene),
        hasPosition: hasPosition(state),
        hasSprite: hasSprite(state, 'building_gasstation.png'),
        canListen: canListen(state),
        canEmit: canEmit(state),
    });
};

export default createGasStation;
