import createState from 'utils/createState';
import canEmit from 'components/events/canEmit';
import eventConfig from 'configs/eventConfig';

const createKeyboardInput = function createKeyboardInputFunc() {
    const state = {};

    function keyDownFn(e) {
        state.emit(eventConfig.EVENTS.KEYBOARD.KEYDOWN, { key: e.key, repeat: e.repeat, keyCode: e.keyCode });
    }

    function keyUpFn(e) {
        state.emit(eventConfig.EVENTS.KEYBOARD.KEYUP, { key: e.key, repeat: e.repeat, keyCode: e.keyCode });
    }

    function enable() {
        document.addEventListener('keydown', keyDownFn);
        document.addEventListener('keyup', keyUpFn);
    }

    function disable() {
        document.removeEventListener('keydown', keyDownFn);
        document.removeEventListener('keyup', keyUpFn);
    }

    const localState = { disable, enable };

    return createState('Keyboard', state, {
        localState,
        canEmit: canEmit(state),
    });
};

export default createKeyboardInput;
