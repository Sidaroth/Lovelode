import createState from 'utils/createState';
import canListen from 'components/events/canListen';
import canEmit from 'components/events/canEmit';
import hasPosition from 'components/hasPosition';
import hasSprite from 'components/entities/hasSprite';
import hasParentScene from 'components/hasParentScene';
import hasTriggerZone from 'components/entities/hasTriggerZone';
import eventConfig from 'configs/eventConfig';

const createUpgradeShop = function createUpgradeShopFunc(scene) {
    const state = {};

    function onInteractionEnter(entity) {
        console.log('enter upgrade shop');
    }

    function onInteractionExit(entity) {
        console.log('exit upgrade shop');
    }

    function __created() {
        state.listenOn(state, eventConfig.TRIGGER.ENTER, onInteractionEnter);
        state.listenOn(state, eventConfig.TRIGGER.EXIT, onInteractionExit);
    }

    const localState = {
        __created,
    };

    return createState('UpgradeShop', state, {
        localState,
        canListen: canListen(state),
        canEmit: canEmit(state),
        hasPosition: hasPosition(state),
        hasTriggerZone: hasTriggerZone(state),
        hasSprite: hasSprite(state, 'building_techshop.png'),
        hasParentScene: hasParentScene(state, scene),
    });
};

export default createUpgradeShop;
