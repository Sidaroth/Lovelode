import isGameEntity from 'components/entities/isGameEntity';
import canEmit from 'components/events/canEmit';
import hasPosition from 'components/hasPosition';
import hasSprite from 'components/entities/hasSprite';
import hasParentScene from 'components/hasParentScene';
import hasMatterPhysics from 'components/entities/hasMatterPhysics';
import hasAnimation from 'components/entities/hasAnimation';
import createState from 'utils/createState';
import hasInput from 'components/hasInput';
import canListen from 'components/events/canListen';
import eventConfig from 'configs/eventConfig';
import gameConfig from 'configs/gameConfig';
import hasSound from 'components/hasSound';
import Phaser from 'phaser';

const createPlayer = function createPlayerFunc(scene, tileKey) {
    const state = {};

    let dbgGfx;

    // private
    const hullMax = 100;
    let hullCurrent = 100;
    const cargoCapacity = 100;
    const currentCargoWeight = 0;
    const fuelCapacity = 100;
    const currentFuel = 100;
    const thrustForce = 1;
    const damageThresholdOnCrash = 10;

    let damageTakenThisFrame = false; // because we can collide with multiple tiles simultaneously, we don't want to multiply the damage taken.
    let isDrilling = false;

    function attemptDrill(bodies) {
        let closestBody;
        let closestDist = Infinity;
        const spriteOffset = state.getSprite().height / 5;
        console.log(spriteOffset);

        bodies.forEach((body) => {
            const xDist = Math.abs(state.getX() - body.position.x);
            const yDist = Math.abs(state.getY() + spriteOffset - body.position.y);
            const dist = xDist ** xDist + yDist ** yDist;
            if (dist < closestDist) {
                closestDist = dist;
                closestBody = body;
            }
        });

        const data = {
            body: closestBody,
            source: state.id,
            startTime: Date.now(),
        };

        console.log(data);

        state.emitGlobal(eventConfig.DRILLING.START, data);
        isDrilling = true;
    }

    function onDrillEnd(data) {
        isDrilling = false;
    }

    function _onMovement(data) {
        const { delta, direction } = data;
        const frameDelta = delta / 1000;
        const gravity = state.getParentScene().matter.world.localWorld.gravity.y;
        const spriteOffset = state.getSprite().height / 5;

        if (direction[gameConfig.DIRECTIONS.RIGHT]) {
            state.applyForce({ x: thrustForce * frameDelta, y: 0 });
            state.setFlipX(false);
        }

        if (direction[gameConfig.DIRECTIONS.LEFT]) {
            state.applyForce({ x: -thrustForce * frameDelta, y: 0 });
            state.setFlipX(true);
        }

        if (direction[gameConfig.DIRECTIONS.UP]) {
            state.applyForce({ y: (-thrustForce - gravity / 2) * frameDelta, x: 0 });
        }

        if (direction[gameConfig.DIRECTIONS.DOWN]) {
            state.applyForce({ y: thrustForce * frameDelta, x: 0 });

            if (!isDrilling) {
                const bodies = state.getCollidingBodies().filter(b => b.position.y > state.getY() + spriteOffset);
                if (bodies.length) {
                    attemptDrill(bodies);
                }
            }
        }
    }

    function getShipStatus() {
        return {
            hullMax,
            hullCurrent,
            cargoCapacity,
            currentCargoWeight,
            fuelCapacity,
            currentFuel,
        };
    }

    function damage(value) {
        console.log('Ouch!', value);
        damageTakenThisFrame = true;
        hullCurrent += value;
    }

    function onCollisionStart(event) {
        if (event.collision.depth > damageThresholdOnCrash && !damageTakenThisFrame) {
            // we hit something fairly hard. Calculate a damage taken based on collision depth (How much did the bodies overlap, i.e it was a fast collision.)
            // Using depth is by far not a perfect solution, but should be enough for this usage.
            const modifier = event.collision.depth / damageThresholdOnCrash;
            damage(-Math.round(10 * modifier));
        }
    }

    function onCollisionEnd(event) {}

    function update(time) {
        damageTakenThisFrame = false;
        dbgGfx.x = state.getX();
        dbgGfx.y = state.getY();

        return time;
    }

    function setupListeners() {
        state.listenOn(state, eventConfig.MOVEMENT, _onMovement);
        state.listenOn(state, eventConfig.COLLISION.START, onCollisionStart);
        state.listenOn(state, eventConfig.COLLISION.END, onCollisionEnd);
        state.listenGlobal(eventConfig.DRILLING.FINISHED, onDrillEnd);
    }

    function __created() {
        // const spriteOffset = state.getSprite().height / 5;
        // dbgGfx = state.getParentScene().add.circle(state.getX(), state.getY() + spriteOffset, 3, 0xFF0000);

        setupListeners();
        state.setCollisionCategory(gameConfig.COLLISION.player);
        state.setCollidesWith([gameConfig.COLLISION.tiles, gameConfig.COLLISION.default]);
        state.setPosition({ x: gameConfig.WORLD.tilesInWidth * gameConfig.WORLD.tileWidth / 2, y: gameConfig.WORLD.tilesInHeight * gameConfig.WORLD.tileHeight / 2 });
        state.setStatic(false);
        state.setFixedRotation(true);
        state.setFriction(0.08, 0.02, 1);
    }

    // Public
    const localState = { __created, update, getShipStatus };

    // These are the substates, or components, that describe the functionality of the resulting object.
    return createState('Player', state, {
        localState,
        isGameEntity: isGameEntity(state),
        hasPosition: hasPosition(state),
        hasParentScene: hasParentScene(state, scene),
        canEmit: canEmit(state),
        canListen: canListen(state),
        hasSprite: hasSprite(state, tileKey),
        hasPhysics: hasMatterPhysics(state),
        hasAnimation: hasAnimation(state),
        hasInput: hasInput(state),
        hasSound: hasSound(state),
    });
};

export default createPlayer;
