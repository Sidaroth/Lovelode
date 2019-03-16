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
import keybindings from 'configs/keybindings';
import tileConfig from 'configs/tileConfig';
import createOre from './createOre';

const createPlayer = function createPlayerFunc(scene, tileKey) {
    const state = {};

    // private
    const hullMax = 100;
    let hullCurrent = 100;
    const cargoCapacity = 100;
    let cargoUsage = 0;
    const fuelCapacity = 100;
    let currentFuel = 100;
    const thrustForce = 0.4;
    const damageThresholdOnCrash = 10;
    const drillSpeed = 1;
    const inventory = [];
    const fuelConsumptionRate = 1.2;
    const idleFuelConsumptionRate = 0.2;

    const money = 1500;

    let damageTakenThisFrame = false; // because we can collide with multiple tiles simultaneously, we don't want to multiply the damage taken.
    let drillDirection;
    let drillTarget;

    let drillOnCooldown = false;

    const projectionTest = (body, pos) => {
        const withinX = pos.x > body.bounds.min.x && pos.x < body.bounds.max.x;
        const withinY = pos.y > body.bounds.min.y && pos.y < body.bounds.max.y;

        return withinX && withinY;
    };

    function getDrillTarget(bodies, direction) {
        let target = null;

        // create a projected pos that we check up against projectionTest. In essence, is the set point within the tile?
        const pos = { x: state.getX(), y: state.getY() };
        if (direction === gameConfig.DIRECTIONS.DOWN) {
            pos.y += tileConfig.DATA.tileHeight / 2 + state.getSprite().height / 2; // Place a point that is a set distance *BELOW* our centerpoint.
        } else if (direction === gameConfig.DIRECTIONS.LEFT) {
            pos.x -= tileConfig.DATA.tileWidth / 2 + state.getSprite().width / 2; // place a point that is a set distance to the *RIGHT* of our centerpoint.
        } else if (direction === gameConfig.DIRECTIONS.RIGHT) {
            pos.x += tileConfig.DATA.tileWidth / 2 + state.getSprite().width / 2; // place a point that is a set distance to the *LEFT* of our centerpoint.
        }

        bodies.every((body) => {
            if (projectionTest(body, pos)) {
                target = body;
                return false;
            }

            return true;
        });

        return target;
    }

    function cancelDrilling() {
        state.emitGlobal(eventConfig.DRILLING.CANCEL, { body: drillTarget }); // We were drilling something different.
        drillDirection = null;
        drillTarget = null;
    }

    function drill(direction) {
        if (drillOnCooldown) return;
        if (drillDirection === direction && drillTarget) return; // We're already drilling this direction.

        if (drillDirection != null && drillDirection !== direction) {
            cancelDrilling();
        }

        if (direction === gameConfig.DIRECTIONS.UP) return; // We don't support upward drilling. (But it can cancel.)

        const bodies = state.getCollidingBodies();
        if (bodies.length === 0) return; // we're not touching anything we can drill.

        const oldTarget = drillTarget;
        drillTarget = getDrillTarget(bodies, direction);
        if (!drillTarget || drillTarget === oldTarget) return; // no target

        drillDirection = direction;
        const data = {
            body: drillTarget,
            source: state.id,
            startTime: Date.now(),
            direction: drillDirection,
            drillSpeed,
        };

        state.emitGlobal(eventConfig.DRILLING.START, data);
    }

    function onDrillingSuccess(data) {
        // TODO: Fix a proper cooldown, or fix drill() so we can continue drilling effectively without it.
        // There's a conflict between the early returns, and allowing drilling to start on a new tile without a tiny break.
        drillOnCooldown = true;
        setTimeout(() => {
            drillOnCooldown = false;
        }, 30);

        if (data.loot) {
            const ore = createOre(data);
            if (cargoUsage + ore.weight <= cargoCapacity) {
                inventory.push(ore);
                cargoUsage += ore.weight;
            }
        }

        drillDirection = null;
        drillTarget = null;
    }

    // TODO: This way of calculating fuel consumption results in double fuel consumption when moving diagonally (i.e up-right)
    // Depending on philosophy this could be fine, maybe it requires more thrusters to be active to go up and sideways at the same time, but maybe not...
    function move(direction, forceVector, frameDelta, texture, flipX) {
        const fuelConsumption = fuelConsumptionRate * frameDelta;
        currentFuel -= fuelConsumption;

        if (currentFuel <= 0) {
            console.log('Oops you ran out of fuel!');
            state.emit(eventConfig.GAME.PLAYER_NOFUEL, state.id);
            currentFuel = fuelCapacity;
        }

        state.setTexture(texture);
        if (flipX != null) state.setFlipX(flipX); // When moving horizontally we flipX to mirror the sprite.

        state.applyForce(forceVector);
        drill(direction);
    }

    function _onMovement(data) {
        const { delta, direction } = data;
        const frameDelta = delta / 1000;
        const gravity = state.getParentScene().matter.world.localWorld.gravity.y;

        if (direction[gameConfig.DIRECTIONS.RIGHT]) {
            const force = { x: thrustForce * frameDelta, y: 0 };
            move(gameConfig.DIRECTIONS.RIGHT, force, frameDelta, 'SideDriveDig/digger_side_drivedig00.png', false);
        }

        if (direction[gameConfig.DIRECTIONS.LEFT]) {
            const force = { x: -thrustForce * frameDelta, y: 0 };
            move(gameConfig.DIRECTIONS.LEFT, force, frameDelta, 'SideDriveDig/digger_side_drivedig00.png', true);
        }

        if (direction[gameConfig.DIRECTIONS.UP]) {
            const force = { y: (-thrustForce - gravity / 2) * frameDelta, x: 0 };
            move(gameConfig.DIRECTIONS.UP, force, frameDelta, 'Drivedig/digger_drivedig00.png');
        }

        if (direction[gameConfig.DIRECTIONS.DOWN]) {
            const force = { y: thrustForce * frameDelta, x: 0 };
            move(gameConfig.DIRECTIONS.DOWN, force, frameDelta, 'Drivedig/digger_drivedig00.png');
        }
    }

    function getShipStatus() {
        return {
            hullMax,
            hullCurrent,
            cargoCapacity,
            cargoUsage,
            fuelCapacity,
            currentFuel,
            inventory,
            money,
        };
    }

    function damage(value) {
        damageTakenThisFrame = true;
        hullCurrent += value;

        if (hullCurrent <= 0) {
            console.log('Oops you died.');
            state.emit(eventConfig.GAME.PLYER_DEATH, state.id);

            // TODO: Add some death logic.
            hullCurrent = hullMax;
        }
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

    // TODO: cancel drilling if we move too far from the drillstart point.
    function update(time) {
        currentFuel -= idleFuelConsumptionRate * time.delta / 1000;
        damageTakenThisFrame = false;
        return time;
    }

    function onKeyUp(evt) {
        if (drillTarget && drillDirection != null) {
            let bindings = [];
            Object.keys(keybindings.MOVEMENT).forEach((key) => {
                bindings = bindings.concat(keybindings.MOVEMENT[key]);
            });

            if (bindings.includes(evt.keyCode)) {
                state.emitGlobal(eventConfig.DRILLING.CANCEL, { body: drillTarget });
            }
        }
    }

    function setupListeners() {
        state.listenOn(state, eventConfig.MOVEMENT, _onMovement);
        state.listenOn(state, eventConfig.KEYBOARD.KEYUP, onKeyUp);
        state.listenOn(state, eventConfig.COLLISION.START, onCollisionStart);
        state.listenOn(state, eventConfig.COLLISION.END, onCollisionEnd);
        state.listenGlobal(eventConfig.DRILLING.FINISHED, onDrillingSuccess);
    }

    function __created() {
        // const spriteOffset = state.getSprite().height / 5;
        // dbgGfx = state.getParentScene().add.circle(state.getX(), state.getY() + spriteOffset, 3, 0xFF0000);

        setupListeners();
        state.setCollisionCategory(gameConfig.COLLISION.player);
        state.setCollidesWith([gameConfig.COLLISION.tiles, gameConfig.COLLISION.default]);
        state.setPosition({
            x: (gameConfig.WORLD.tilesInWidth * tileConfig.DATA.tileWidth) / 2,
            y: (gameConfig.WORLD.tilesInHeight * tileConfig.DATA.tileHeight) / 2 - tileConfig.DATA.tileHeight * 5,
        });
        state.setStatic(false);
        state.setFixedRotation(true);
        state.setFriction(0.01, 0.02, 1);
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
