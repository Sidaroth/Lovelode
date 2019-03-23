import createState from 'utils/createState';
import hasSprite from 'components/entities/hasSprite';
import canListen from 'components/events/canListen';
import canEmit from 'components/events/canEmit';
import hasParentScene from 'components/hasParentScene';
import hasPosition from 'components/hasPosition';
import createTriggerZone from './createTriggerZone';
import store from '../store';
import eventConfig from 'configs/eventConfig';

/**
 * The building where the player(s) will go to refuel their diggers.
 */
const createGasStation = function createGasStationFunc(scene) {
    const state = {};
    let interactionZone;

    function onInteractionEnter(e) {
        console.log('enter', e);
    }

    function onInteractionExit(e) {
        console.log('exit', e);
    }

    function __created() {
        const {
            x, y, width, height,
        } = state.getSprite();

        interactionZone = createTriggerZone(state.getParentScene(), x - width / 2, y, width, height);

        state.listenOn(interactionZone, eventConfig.TRIGGER.ENTER, onInteractionEnter);
        state.listenOn(interactionZone, eventConfig.TRIGGER.EXIT, onInteractionExit);
        state.listenGlobal(eventConfig.GAME.PLAYER_ADDED, (player) => {
            interactionZone.addOverlapBody(player.getSprite().body);
        });
    }

    function setPosition(pos) {
        interactionZone.setPosition(pos);
        return pos;
    }

    function update() {
        interactionZone.update();
    }

    const localState = {
        __created,
        update,
        setPosition,
    };

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
