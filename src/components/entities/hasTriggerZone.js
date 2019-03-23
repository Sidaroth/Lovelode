import createTriggerZone from 'entities/createTriggerZone';
import eventConfig from 'configs/eventConfig';

const hasTriggerZone = function hasTriggerZone(state) {
    let triggerZone;

    function __created() {
        const {
            x, y, width, height,
        } = state.getSprite();

        triggerZone = createTriggerZone(state.getParentScene(), x - width / 2, y, width, height);

        state.listenOn(triggerZone, eventConfig.INTERNAL_TRIGGER.ENTER, (e) => {
            state.emit(eventConfig.TRIGGER.ENTER, e);
        });

        state.listenOn(triggerZone, eventConfig.INTERNAL_TRIGGER.EXIT, (e) => {
            state.emit(eventConfig.TRIGGER.EXIT, e);
        });

        state.listenGlobal(eventConfig.GAME.PLAYER_ADDED, (player) => {
            triggerZone.addOverlapBody(player.getSprite().body);
        });
    }

    function update() {
        triggerZone.update();
    }

    function setSize(size) {
        triggerZone.setSize(size);
        return size;
    }

    function setPosition(pos) {
        triggerZone.setPosition(pos);
        return pos;
    }

    return {
        __created,
        update,
        setPosition,
        setSize,
    };
};

export default hasTriggerZone;
