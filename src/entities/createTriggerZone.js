import hasPosition from 'components/hasPosition';
import hasSize from 'components/hasSize';
import isGameEntity from 'components/entities/isGameEntity';
import createState from 'utils/createState';
import hasParentScene from 'components/hasParentScene';
import canEmit from 'components/events/canEmit';
import Matter from 'matter-js';
import eventConfig from 'configs/eventConfig';
import Phaser from 'phaser';
import store from 'root/store';

/**
 * Requires Matter.js bodies.
 */
const createTriggerZone = function createTriggerZoneFunc(parent, startX = 0, startY = 0, startW = 10, startH = 10) {
    const state = {};
    let overlappedBodies = [];
    let overlapsWith = [];
    let triggerZone;
    let x = startX;
    let y = startY;
    let w = startW;
    let h = startH;

    let debugGfx;
    let debugZone;

    function updateRects() {
        triggerZone = Matter.Bodies.rectangle(x, y, w, h);
        debugZone = new Phaser.Geom.Rectangle(x - w / 2, y - h / 2, w, h);
    }

    function setSize(size) {
        ({ w, h } = size);
        updateRects();
        return size;
    }

    function setPosition(pos) {
        ({ x, y } = pos);
        updateRects();
        return pos;
    }

    function setOverlaps(bodies) {
        overlapsWith = bodies;
    }

    function addOverlapBody(body) {
        overlapsWith.push(body);
    }

    function isOverlappedByAny() {
        return overlappedBodies.length > 0;
    }

    function drawDebugZone() {
        debugGfx.fillStyle(0xff00ff, 0.3);
        debugGfx.fillRectShape(debugZone);
    }

    function __init() {
        debugGfx = state.getParentScene().add.graphics();
        updateRects();
    }

    function update(time) {
        debugGfx.clear();
        if (store.showTriggers) {
            drawDebugZone();
        }

        const previous = overlappedBodies;
        overlappedBodies = [];

        overlapsWith.forEach((body) => {
            const collision = Matter.SAT.collides(triggerZone, body);
            if (collision.collided) {
                overlappedBodies.push(body);
            }
        });

        overlappedBodies.forEach((body) => {
            if (previous.indexOf(body) === -1) {
                state.emit(eventConfig.INTERNAL_TRIGGER.ENTER, body);
            }
        });

        // If a body was overlapped previously, but no longer, we emit an exit event.
        previous.forEach((body) => {
            if (overlappedBodies.indexOf(body) === -1) {
                state.emit(eventConfig.INTERNAL_TRIGGER.EXIT, body);
            }
        });

        return time;
    }

    const localState = {
        // props
        // methods
        __init,
        setSize,
        setPosition,
        setOverlaps,
        addOverlapBody,
        isOverlappedByAny,
        update,
        drawDebugZone,
    };

    return createState('createTriggerZone', state, {
        localState,
        isGameEntity: isGameEntity(state),
        hasPosition: hasPosition(state),
        canEmit: canEmit(state),
        hasSize: hasSize(state),
        hasParentScene: hasParentScene(state, parent),
    });
};

export default createTriggerZone;
