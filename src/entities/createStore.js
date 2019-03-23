import createState from 'utils/createState';
import hasSprite from 'components/entities/hasSprite';
import hasPosition from 'components/hasPosition';
import canListen from 'components/events/canListen';
import canEmit from 'components/events/canEmit';
import hasParentScene from 'components/hasParentScene';
import hasTriggerZone from 'components/entities/hasTriggerZone';
import eventConfig from 'configs/eventConfig';

/**
 * This is the building where the player(s) will go to sell their ore.
 */
const createStore = function createStoreFunc(scene) {
    const state = {};

    function onInteractionEnter(entity) {
        console.log('enter store');
    }

    function onInteractionExit(entity) {
        console.log('exit store');
    }

    function __created() {
        state.listenOn(state, eventConfig.TRIGGER.ENTER, onInteractionEnter);
        state.listenOn(state, eventConfig.TRIGGER.EXIT, onInteractionExit);
    }

    const localState = {
        __created,
    };

    return createState('Store', state, {
        localState,
        hasParentScene: hasParentScene(state, scene),
        hasTriggerZone: hasTriggerZone(state),
        hasSprite: hasSprite(state, 'building_bank.png'),
        hasPosition: hasPosition(state),
        canListen: canListen(state),
        canEmit: canEmit(state),
    });
};

export default createStore;
