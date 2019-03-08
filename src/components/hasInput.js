import store from 'root/store';
import keybindings from 'configs/keybindings';
import eventConfig from 'configs/eventConfig';

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
        // TODO: Get the listener reference from listeOn() and drop it when swapping.
    }

    function getInputType() {
        return inputType;
    }

    function isInputDown(...bindings) {
        return bindings.some(binding => keyboard.isKeyDown(binding));
    }

    function update() {
        // into hasMovement.js component?
        const leftInput = isInputDown(...keybindings.MOVEMENT.LEFT) ? 'Left' : '';
        const upInput = isInputDown(...keybindings.MOVEMENT.UP) ? 'Up' : '';
        const rightInput = isInputDown(...keybindings.MOVEMENT.RIGHT) ? 'Right' : '';
        const downInput = isInputDown(...keybindings.MOVEMENT.DOWN) ? 'Down' : '';
        const direction = leftInput + upInput + rightInput + downInput;

        if (direction) {
            state.emit(eventConfig.EVENTS.MOVEMENT, direction);
        }
    }

    return { setInputType, getInputType, update };
};

export default hasInput;
