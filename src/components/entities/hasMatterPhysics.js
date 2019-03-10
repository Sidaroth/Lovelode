import eventConfig from 'configs/eventConfig';

const hasMatterPhysics = function hasPhysicsFunc(state) {
    const inContactWith = [];
    let collidingCategories = [];
    let collisionCategory;
    let isStatic = true;
    let isFixed = false;
    let friction = 0.1;
    let airFriction = 0.01;
    let staticFriction = 0.5;

    function onCollisionStart(event) {
        const bodyId = state.getSprite().body.id;
        event.pairs.every((pair) => {
            if (pair.bodyB.id !== bodyId) return true; // if we're not involved with the collision. Move to next pair.

            const collidingBody = pair.bodyA;
            if (!state.isInContactWith(collidingBody)) {
                inContactWith.push(collidingBody);
                if (state.emit) {
                    const data = {
                        body: pair.bodyA,
                        collision: pair.collision,
                    };
                    state.emit(eventConfig.COLLISION.START, data);
                }
            }

            return true;
        });
    }

    function onCollisionEnd(event) {
        const bodyId = state.getSprite().body.id;
        event.pairs.every((pair) => {
            if (pair.bodyB.id !== bodyId) return true; // if we're not involved with the collision. Move to next pair.

            if (state.emit) {
                const data = {
                    body: pair.bodyA,
                    collision: pair.collision,
                };
                state.emit(eventConfig.COLLISION.END, data); // if we can emit internally, emit a collision event with data to other components.
            }

            const collidingBody = pair.bodyA;
            if (state.isInContactWith(collidingBody)) {
                const index = inContactWith.findIndex(b => b === collidingBody);
                inContactWith.splice(index, 1);
            }

            return true;
        });
    }

    function isInContactWith(body) {
        return inContactWith.findIndex(b => b === body) >= 0;
    }

    function setupCollisionEvents() {
        state.getParentScene().matter.world.on('collisionstart', onCollisionStart);
        state.getParentScene().matter.world.on('collisionend', onCollisionEnd);
    }

    function setCollidesWith(categories) {
        collidingCategories = categories;
        if (state.getSprite().setCollidesWith) {
            state.getSprite().setCollidesWith(categories);
        }
    }

    function setCollisionCategory(category) {
        collisionCategory = category;
        if (state.getSprite().setCollisionCategory) {
            state.getSprite().setCollisionCategory(category);
        }
    }

    function setStatic(value) {
        isStatic = value;
        if (state.getSprite().setStatic) {
            state.getSprite().setStatic(value);
        }
    }

    function setFixedRotation(value) {
        isFixed = value;
        if (state.getSprite().setFixedRotation) {
            state.getSprite().setFixedRotation(value);
        }
    }

    function setFriction(fr = 0, afr = 0, sfr = 0) {
        friction = fr;
        airFriction = afr;
        staticFriction = sfr;

        if (state.getSprite().setFriction) {
            state.getSprite().setFriction(friction, airFriction, staticFriction);
        }
    }

    function applyForce(force) {
        state.getSprite().applyForce(force);
    }

    function update(time) {
        return time;
    }

    function __created() {
        if (!state.getParentScene().matter) throw new Error('hasPhysics requires composing state to have a matter enabled scene.');
        state.getParentScene().matter.add.gameObject(state.getSprite());

        state.setCollidesWith(collidingCategories);
        state.setCollisionCategory(collisionCategory);
        state.setStatic(isStatic);
        state.setFixedRotation(isFixed);
        state.setFriction(friction, airFriction, staticFriction);
        setupCollisionEvents();
    }

    return {
        hasPhysics: true,
        __created,
        applyForce,
        update,
        setFixedRotation,
        setFriction,
        setStatic,
        setCollidesWith,
        setCollisionCategory,
        isInContactWith,
    };
};

export default hasMatterPhysics;
