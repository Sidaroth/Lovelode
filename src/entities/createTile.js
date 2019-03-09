import hasPosition from 'components/hasPosition';
import hasSprite from 'components/entities/hasSprite';
import hasParentScene from 'components/hasParentScene';
import isGameEntity from 'components/entities/isGameEntity';
import createState from 'utils/createState';
import hasMatterPhysics from 'components/entities/hasMatterPhysics';
import hasSize from 'components/hasSize';
import gameConfig from 'configs/gameConfig';

const createTile = function createTileFunc(scene, tilekey) {
    const state = {};

    function __created() {
        state.setCollisionCategory(gameConfig.COLLISION.tiles);
        state.setCollidesWith(gameConfig.COLLISION.player);
        state.setSize({ w: gameConfig.WORLD.tileWidth, h: gameConfig.WORLD.tileHeight });
    }

    // public
    const localState = { __created };

    return createState('Tile', state, {
        localState,
        isGameEntity: isGameEntity(state),
        hasParentScene: hasParentScene(state, scene),
        hasPosition: hasPosition(state),
        hasSize: hasSize(state),
        hasSprite: hasSprite(state, tilekey),
        hasPhysics: hasMatterPhysics(state),
    });
};

export default createTile;
