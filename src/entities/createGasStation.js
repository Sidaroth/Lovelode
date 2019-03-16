import createState from 'utils/createState';
import hasSprite from 'components/entities/hasSprite';
import canListen from 'components/events/canListen';
import canEmit from 'components/events/canEmit';
import hasParentScene from 'components/hasParentScene';
import hasPosition from 'components/hasPosition';

/**
 * The building where the player(s) will go to refuel their diggers.
 */
const createGasStation = function createGasStationFunc(scene) {
    const state = {};
    const localState = {};

    return createState('GasStation', state, {
        localState,
        hasParentScene: hasParentScene(state, scene),
        hasPosition: hasPosition(state),
        hasSprite: hasSprite(state, 'building_gasstation.png'),
        canListen: canListen(state),
        canEmit: canEmit(state),
    });
};

export default createGasStation;
