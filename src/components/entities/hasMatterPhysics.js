const hasMatterPhysics = function hasPhysicsFunc(state) {
    let collidesWith = [];
    let collisionCategory;
    let isStatic = true;
    let isFixed = false;
    let friction = 0.1;
    let airFriction = 0.01;
    let staticFriction = 0.5;

    function __created() {
        if (!state.getParentScene().matter) throw new Error('hasPhysics requires composing state to have a matter enabled scene.');
        state.getParentScene().matter.add.gameObject(state.getSprite());

        state.setCollidesWith(collidesWith);
        state.setCollisionCategory(collisionCategory);
        state.setStatic(isStatic);
        state.setFixedRotation(isFixed);
        state.setFriction(friction, airFriction, staticFriction);
    }

    function setCollidesWith(categories) {
        collidesWith = categories;
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
    };
};

export default hasMatterPhysics;
