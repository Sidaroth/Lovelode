import hasPosition from 'components/hasPosition';
import hasSprite from 'components/entities/hasSprite';
import hasParentScene from 'components/hasParentScene';
import isGameEntity from 'components/entities/isGameEntity';
import createState from 'utils/createState';
import hasMatterPhysics from 'components/entities/hasMatterPhysics';
import hasSize from 'components/hasSize';
import gameConfig from 'configs/gameConfig';
import eventConfig from 'configs/eventConfig';
import canListen from 'components/events/canListen';
import canEmit from 'components/events/canEmit';

const createTile = function createTileFunc(scene, tilekey) {
    const state = {};

    function onDrillingStart(data) {
        if (data.body.id !== state.getSprite().body.id || !data.body) return;

        // start a timer
        // add fancy graphics while drilling and such to the tile. Keep track of the timer.
        // be ready to cancel drilling
        // if drilling time is complete, give the player some loot, destroy tile.
        setTimeout(() => {
            state.destroy();
            state.emitGlobal(eventConfig.DRILLING.FINISHED, state.id);
        }, 300);
    }

    function __created() {
        state.setCollisionCategory(gameConfig.COLLISION.tiles);
        state.setCollidesWith(gameConfig.COLLISION.player);
        state.setSize({ w: gameConfig.WORLD.tileWidth, h: gameConfig.WORLD.tileHeight });

        // listeners
        state.listenGlobal(eventConfig.DRILLING.START, onDrillingStart);
    }

    // public
    const localState = { __created };

    return createState('Tile', state, {
        localState,
        isGameEntity: isGameEntity(state),
        hasParentScene: hasParentScene(state, scene),
        hasPosition: hasPosition(state),
        hasSize: hasSize(state),
        canListen: canListen(state),
        canEmit: canEmit(state),
        hasSprite: hasSprite(state, tilekey),
        hasMatterPhysics: hasMatterPhysics(state),
    });
};

export default createTile;
