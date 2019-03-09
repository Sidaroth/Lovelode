import Phaser from 'phaser';
import hasPosition from 'components/hasPosition';
import hasSize from 'components/hasSize';
import isGameEntity from 'components/entities/isGameEntity';
import createState from 'utils/createState';
import hasParentScene from 'components/hasParentScene';

const createTriggerZone = function createTriggerZoneFunc(parent) {
    const state = {};

    let triggerZone;
    const overlapsWith = [];
    const overlappedEntities = [];

    function setSize(size) {
        triggerZone.setSize(size.w, size.h);
        return size;
    }

    function setPosition(pos) {
        triggerZone.setPosition(pos.x, pos.y);
        return pos;
    }

    // function setOverlaps(bodies) {
    //     overlapsWith.length = 0;
    //     overlapsWith.splice(0, 0, bodies);
    // }

    // function addOverlapBody(body) {
    //     overlapsWith.push(body);
    // }

    // function isOverlappedByAny() {
    //     return overlappedEntities.length > 0;
    // }

    function drawDebugZone() {}

    function __constructor() {
        triggerZone = state.getParentScene().matter.add.rectangle(0, 0, 100, 100);
    }

    function update(time) {
        drawDebugZone();

        const previous = overlappedEntities;
        overlappedEntities.length = 0;

        // state.getParentScene().physics.overlap(triggerZone, overlapsWith, (zone, entity) => {
        //     overlappedEntities.push(entity);
        // });

        console.log(state.getParentScene().matter);

        // overlapsWith.forEach((entity) => {
        //     if (Phaser.Geom.Rectangle.intersection(triggerZone, entity)) {
        //         overlappedEntities.push(entity);
        //     }
        // });

        overlappedEntities.forEach((entity) => {
            if (previous.indexOf(entity) === -1) {
                state.onEntityEnteredRange(entity);
            }
        });

        // If an entity was overlapped previously, but no longer, we emit an exit event.
        previous.forEach((entity) => {
            if (overlappedEntities.indexOf(entity) === -1) {
                state.onEntityLeftRange(entity);
            }
        });

        return time;
    }

    const localState = {
        // props
        // methods
        __constructor,
        setSize,
        setPosition,
        setOverlaps,
        addOverlapBody,
        isOverlappedByAny,
        update,
        onEntityLeftRange: e => e,
        onEntityEnteredRange: e => e,
    };

    return createState('createTriggerZone', state, {
        localState,
        isGameEntity: isGameEntity(state),
        hasPosition: hasPosition(state),
        hasSize: hasSize(state),
        hasParentScene: hasParentScene(state, parent),
    });
};

export default createTriggerZone;
