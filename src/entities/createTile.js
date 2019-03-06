import hasPosition from 'components/hasPosition';
import getFunctionUsage from 'utils/getFunctionUsage';
import hasSprite from 'components/entities/hasSprite';
import hasParentScene from 'components/hasParentScene';
import hasCollision from 'components/entities/hasCollision';
import isGameEntity from 'components/entities/isGameEntity';
import pipe from 'utils/pipe';

const createTile = function createTileFunc() {
    const state = {};

    // states
    const isGameEntityState = isGameEntity(state);
    const hasParentSceneState = hasParentScene(state);
    const hasPositionState = hasPosition(state);
    const hasSpriteState = hasSprite(state);
    const hasCollisionState = hasCollision(state);

    const localState = {};

    const subStates = [
        { state, name: 'state' },
        { state: isGameEntityState, name: 'isGameEntity' },
        { state: localState, name: 'localState' },
        { state: hasParentSceneState, name: 'hasParentScene' },
        { state: hasPositionState, name: 'hasPosition' },
        { state: hasSpriteState, name: 'hasSprite' },
        { state: hasCollisionState, name: 'hasCollision' },
    ];

    getFunctionUsage(subStates, 'createTile');
    return Object.assign(...subStates.map(s => s.state), {
        // pipes.
        setPosition: pipe(
            hasPositionState.setPosition,
            hasSpriteState.setPosition,
        ),
        destroy: hasSpriteState.destroy,
    });
};

export default createTile;
