import eventConfig from 'configs/eventConfig';

const hasSound = function hasSoundFunc(state) {
    function playSfx(key, pos) {
        state.emitGlobal(eventConfig.EVENTS.SOUND.SFX, { key, pos });
    }

    return {
        playSfx,
    };
};

export default hasSound;
