import createState from 'utils/createState';
import canListen from 'components/events/canListen';
import canEmit from 'components/events/canEmit';
import hasPosition from 'components/hasPosition';
import hasSprite from 'components/entities/hasSprite';
import hasParentScene from 'components/hasParentScene';

const createUpgradeShop = function createUpgradeShopFunc(scene) {
    const state = {};
    const localState = {};

    return createState('UpgradeShop', state, {
        localState,
        canListen: canListen(state),
        canEmit: canEmit(state),
        hasPosition: hasPosition(state),
        hasSprite: hasSprite(state, 'building_techshop.png'),
        hasParentScene: hasParentScene(state, scene),
    });
};

export default createUpgradeShop;
