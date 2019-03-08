import createState from 'utils/createState';
import canEmit from 'components/events/canEmit';
import eventConfig from 'configs/eventConfig';

const createKeyboardInput = function createKeyboardInputFunc() {
    const state = {};
    const keyMap = new Map();

    function keyDownFn(e) {
        keyMap.set(e.keyCode, { repeat: e.repeat, down: true });
        state.emit(eventConfig.EVENTS.KEYBOARD.KEYDOWN, { key: e.key, repeat: e.repeat, keyCode: e.keyCode });
    }

    function keyUpFn(e) {
        keyMap.set(e.keyCode, { repeat: false, down: false });
        state.emit(eventConfig.EVENTS.KEYBOARD.KEYUP, { key: e.key, repeat: e.repeat, keyCode: e.keyCode });
    }

    function isKeyDown(keyCode) {
        return keyMap.get(keyCode) && keyMap.get(keyCode).down;
    }

    function enable() {
        document.addEventListener('keydown', keyDownFn);
        document.addEventListener('keyup', keyUpFn);
    }

    function disable() {
        document.removeEventListener('keydown', keyDownFn);
        document.removeEventListener('keyup', keyUpFn);
    }

    const localState = { disable, enable, isKeyDown };

    return createState('Keyboard', state, {
        localState,
        canEmit: canEmit(state),
    });
};

export default createKeyboardInput;
