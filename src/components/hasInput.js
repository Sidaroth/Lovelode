import store from 'root/store';
import keybindings from 'configs/keybindings';
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

    function setInputType(type) {
        inputType = type;
    }

    function getInputType() {
        return inputType;
    }

    // Propagates an event from the keyboard handler onto other components on this object.
    function onKeyUp(evt) {
        state.emit(eventConfig.KEYBOARD.KEYUP, evt);
    }

    function onKeyDown(evt) {
        state.emit(eventConfig.KEYBOARD.KEYDOWN, evt);
    }

    function isInputDown(...bindings) {
        return bindings.some(binding => keyboard.isKeyDown(binding));
    }

    function __created() {
        state.listenOn(keyboard, eventConfig.KEYBOARD.KEYUP, onKeyUp);
        state.listenOn(keyboard, eventConfig.KEYBOARD.KEYDOWN, onKeyDown);
    }

    function update(time) {
        // into hasMovement.js component?
        const direction = [false, false, false, false];
        direction[gameConfig.DIRECTIONS.LEFT] = isInputDown(...keybindings.MOVEMENT.LEFT);
        direction[gameConfig.DIRECTIONS.UP] = isInputDown(...keybindings.MOVEMENT.UP);
        direction[gameConfig.DIRECTIONS.RIGHT] = isInputDown(...keybindings.MOVEMENT.RIGHT);
        direction[gameConfig.DIRECTIONS.DOWN] = isInputDown(...keybindings.MOVEMENT.DOWN);

        if (direction.some(dir => dir)) {
            state.emit(eventConfig.MOVEMENT, { direction, delta: time.delta });
        }

        return time.delta;
    }

    return {
        __created,
        setInputType,
        getInputType,
        update,
        isInputDown,
    };
};

export default hasInput;
