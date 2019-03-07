import store from 'root/store';
import eventConfig from 'configs/eventConfig';
import gameConfig from 'configs/gameConfig';

/**
 * The idea here is to allow inputs of various types to be abstracted away.
 * The input type and resulting emits will be handled here, while i.e the player listens to specific events.
 * Input types could theoretically be keyboard, mouse, controller, AI, networked player, etc... depending on bindings set up.
 */
const hasInput = function hasInputFunc(state) {
    const { keyboard } = store;
    let inputType = 'keyboard';

    function _onKeyDown(event) {
        const evt = { repeat: event.repeat, direction: 'none' };

        if (event.keyCode === gameConfig.KEYS.W.CODE || event.keyCode === gameConfig.KEYS.UP_ARROW.CODE) {
            evt.direction = 'up';
            state.emit(eventConfig.EVENTS.MOVEMENT, evt);
        }

        if (event.keyCode === gameConfig.KEYS.A.CODE || event.keyCode === gameConfig.KEYS.LEFT_ARROW.CODE) {
            evt.direction = 'left';
            state.emit(eventConfig.EVENTS.MOVEMENT, evt);
        }

        if (event.keyCode === gameConfig.KEYS.S.CODE || event.keyCode === gameConfig.KEYS.DOWN_ARROW.CODE) {
            evt.direction = 'down';
            state.emit(eventConfig.EVENTS.MOVEMENT, evt);
        }

        if (event.keyCode === gameConfig.KEYS.D.CODE || event.keyCode === gameConfig.KEYS.RIGHT_ARROW.CODE) {
            evt.direction = 'right';
            state.emit(eventConfig.EVENTS.MOVEMENT, evt);
        }
    }

    function setInputType(type) {
        inputType = type;
        // TODO: Get the listener reference from listeOn() and drop it when swapping.
    }

    function getInputType() {
        return inputType;
    }

    function __constructor() {
        if (!state.emit) throw new Error("hasInput requires parent to have a 'canEmit' state.");
        if (inputType === 'keyboard') {
            state.listenOn(keyboard, eventConfig.EVENTS.KEYBOARD.KEYDOWN, _onKeyDown);
        }
    }

    return { __constructor, setInputType, getInputType };
};

export default hasInput;
