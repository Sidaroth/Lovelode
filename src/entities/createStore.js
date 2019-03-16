import createState from 'utils/createState';
import hasSprite from 'components/entities/hasSprite';
import hasPosition from 'components/hasPosition';
import canListen from 'components/events/canListen';
import canEmit from 'components/events/canEmit';
import hasParentScene from 'components/hasParentScene';

/**
 * This is the building where the player(s) will go to sell their ore.
 */
const createStore = function createStoreFunc(scene) {
    const state = {};
    const localState = {};

    return createState('Store', state, {
        localState,
        hasParentScene: hasParentScene(state, scene),
        hasSprite: hasSprite(state, 'building_bank.png'),
        hasPosition: hasPosition(state),
        canListen: canListen(state),
        canEmit: canEmit(state),
    });
};

export default createStore;
