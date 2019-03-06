import hasPosition from 'components/hasPosition';
import hasSprite from 'components/entities/hasSprite';
import hasParentScene from 'components/hasParentScene';
import hasCollision from 'components/entities/hasCollision';
import isGameEntity from 'components/entities/isGameEntity';
import createState from 'utils/createState';

const createTile = function createTileFunc(scene, tilekey) {
    const state = {};

    // public
    const localState = {};

    return createState('Tile', state, {
        localState,
        isGameEntity: isGameEntity(state),
        hasParentScene: hasParentScene(state, scene),
        hasPosition: hasPosition(state),
        hasSprite: hasSprite(state, tilekey),
        hasCollision: hasCollision(state),
    });
};

export default createTile;
