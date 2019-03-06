import isGameEntity from 'components/entities/isGameEntity';
import canEmit from 'components/events/canEmit';
import getFunctionUsage from 'utils/getFunctionUsage';
import hasPosition from 'components/hasPosition';
import hasCollision from 'components/entities/hasCollision';
import hasSprite from 'components/entities/hasSprite';
import hasParentScene from 'components/hasParentScene';
import hasPhysics from 'components/entities/hasPhysics';
import hasAnimation from 'components/entities/hasAnimation';
import pipe from 'utils/pipe';

const createPlayer = function createPlayerFunc(scene, tileKey) {
    // This is the base state, which in some cases will be an 'inherited' value, i.e Phaser.Scene
    const state = {};

    const hullMax = 100;
    const hullCurrent = 100;
    const cargoCapacity = 100;
    const currentCargoWeight = 0;
    const fuelCapacity = 100;
    const currentFuel = 100;

    const isGameEntityState = isGameEntity(state);
    const hasPositionState = hasPosition(state);
    const hasParentSceneState = hasParentScene(state, scene);
    const canEmitState = canEmit(state);
    const hasSpriteState = hasSprite(state, tileKey);
    const hasCollisionState = hasCollision(state);
    const hasPhysicsState = hasPhysics(state);
    const hasAnimationState = hasAnimation(state);

    // Public
    const localState = {};

    // These are the substates, or components, that describe the functionality of the resulting object.
    const states = [
        { state, name: 'state' },
        { state: localState, name: 'localState' },
        { state: isGameEntityState, name: 'isGameEntity' },
        { state: canEmitState, name: 'canEmit' },
        { state: hasPositionState, name: 'hasPosition' },
        { state: hasSpriteState, name: 'hasSprite' },
        { state: hasCollisionState, name: 'hasCollision' },
        { state: hasParentSceneState, name: 'hasParentScene' },
        { state: hasPhysicsState, name: 'hasPhysics' },
        { state: hasAnimationState, name: 'hasAnimation' },
    ];

    const init = pipe(...states.map(s => s.state.__constructor).filter(c => c));
    getFunctionUsage(states, 'createPlayer');
    // We compose these substates togheter through using Object.assign when returning a new Player object.
    Object.assign(...states.map(s => s.state), {
        // pipes and overrides
    });

    init();

    return state;
};

export default createPlayer;
