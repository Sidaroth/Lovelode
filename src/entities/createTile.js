import hasPosition from 'components/hasPosition';
import getFunctionUsage from 'utils/getFunctionUsage';
import hasSprite from 'components/entities/hasSprite';
import hasParentScene from 'components/hasParentScene';
import hasCollision from 'components/entities/hasCollision';
import isGameEntity from 'components/entities/isGameEntity';
import pipe from 'utils/pipe';

const createTile = function createTileFunc(scene, tilekey) {
    const state = {};

    // states
    const isGameEntityState = isGameEntity(state);
    const hasParentSceneState = hasParentScene(state, scene);
    const hasPositionState = hasPosition(state);
    const hasSpriteState = hasSprite(state, tilekey);
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

    const init = pipe(...subStates.map(s => s.state.__constructor).filter(c => c));

    getFunctionUsage(subStates, 'createTile');
    Object.assign(...subStates.map(s => s.state), {
        // pipes.
        setPosition: pipe(
            hasPositionState.setPosition,
            hasSpriteState.setPosition,
        ),
        destroy: hasSpriteState.destroy,
    });

    init();

    return state;
};

export default createTile;
