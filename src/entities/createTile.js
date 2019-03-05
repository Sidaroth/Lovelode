import hasPosition from 'components/hasPosition';
import getFunctionUsage from 'utils/getFunctionUsage';
import hasSprite from 'components/entities/hasSprite';
import hasParentScene from 'components/hasParentScene';
import hasCollision from 'components/entities/hasCollision';

const createTile = function createTileFunc() {
    const state = {};

    // states
    const hasParentSceneState = hasParentScene(state);
    const hasPositionState = hasPosition(state);
    const hasSpriteState = hasSprite(state);
    const hasCollisionState = hasCollision(state);

    const localState = {};

    const subStates = [
        { state, name: 'state' },
        { state: localState, name: 'localState' },
        { state: hasParentSceneState, name: 'hasParentScene' },
        { state: hasPositionState, name: 'hasPosition' },
        { state: hasSpriteState, name: 'hasSprite' },
        { state: hasCollisionState, name: 'hasCollision' },
    ];

    getFunctionUsage(subStates, 'createTile');
    return Object.assign(...subStates.map(s => s.state), {
        // pipes.
        destroy: hasSpriteState.destroy,
    });
};

export default createTile;
