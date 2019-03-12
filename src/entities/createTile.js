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
import Phaser from 'phaser';
import spriteConfig from 'configs/spriteConfig';

const createTile = function createTileFunc(scene, tileData) {
    const state = {};

    let internalTimer = 0;
    let endTime = 0;
    let startTime = 0;
    let timerRunning = false;

    let density = 1000; // used to calculate drilling time.
    let overlay;

    function onDrillingStart(data) {
        if (data.body.id !== state.getSprite().body.id || !data.body) return;

        timerRunning = true;
        startTime = Date.now();
        internalTimer = startTime;
        endTime = internalTimer + density / data.drillSpeed; // TODO fix a better formula.
    }

    function setDensity(newDensity) {
        density = newDensity;
    }

    function onDrillingCanceled(data) {
        if ((data && data.body && data.body.id !== state.getSprite().body.id) || !data.body) return;
        timerRunning = false;
        overlay.alpha = 0;
    }

    function __created() {
        overlay = new Phaser.GameObjects.Sprite(state.getParentScene(), state.getX(), state.getY(), spriteConfig.DIGGERPACK.KEY, 'cracks1.png');
        overlay.alpha = 0;
        state.getParentScene().add.existing(overlay);

        // overlay.setTexture('cracks4.png');
        state.setCollisionCategory(gameConfig.COLLISION.tiles);
        state.setCollidesWith(gameConfig.COLLISION.player);
        state.setSize({ w: gameConfig.WORLD.tileWidth, h: gameConfig.WORLD.tileHeight });

        // listeners
        state.listenGlobal(eventConfig.DRILLING.START, onDrillingStart);
        state.listenGlobal(eventConfig.DRILLING.CANCEL, onDrillingCanceled);
    }

    function updateSprite() {
        const totalDuration = endTime - startTime;
        const remainingDuration = endTime - internalTimer;
        const percent = (totalDuration - remainingDuration) / totalDuration;

        overlay.alpha = 1;
        if (percent > 0.8) {
            overlay.setTexture(spriteConfig.DIGGERPACK.KEY, 'cracks4.png');
        } else if (percent > 0.6) {
            overlay.setTexture(spriteConfig.DIGGERPACK.KEY, 'cracks3.png');
        } else if (percent > 0.4) {
            overlay.setTexture(spriteConfig.DIGGERPACK.KEY, 'cracks2.png');
        } else if (percent > 0.2) {
            overlay.setTexture(spriteConfig.DIGGERPACK.KEY, 'cracks1.png');
        } else {
            overlay.alpha = 0;
        }
    }

    function setPosition(pos) {
        overlay.x = pos.x;
        overlay.y = pos.y;

        return pos;
    }

    function update(time) {
        if (timerRunning) {
            internalTimer += time.delta;

            updateSprite();

            if (internalTimer > endTime) {
                const emitData = {
                    tileId: state.id,
                    loot: null,
                };

                timerRunning = false;
                state.emitGlobal(eventConfig.DRILLING.FINISHED, emitData);
            }
        }

        return time;
    }

    function destroy() {
        if (overlay) {
            overlay.destroy();
        }
    }

    // public
    const localState = {
        __created,
        update,
        destroy,
        setDensity,
        setPosition,
    };

    return createState('Tile', state, {
        localState,
        isGameEntity: isGameEntity(state),
        hasParentScene: hasParentScene(state, scene),
        hasPosition: hasPosition(state),
        hasSize: hasSize(state),
        canListen: canListen(state),
        canEmit: canEmit(state),
        hasSprite: hasSprite(state, tileData.KEY),
        hasMatterPhysics: hasMatterPhysics(state),
    });
};

export default createTile;
