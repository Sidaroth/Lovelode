const hasPhysics = function hasPhysicsFunc(state) {
    function __constructor() {
        if (!state.getParentScene().matter) throw new Error('hasPhysics requires composing state to have a matter enabled scene.');
        state
            .getParentScene()
            .matter.add.gameObject(state.getSprite())
            .setStatic(true);
    }

    function setStatic(value) {
        state.getSprite().setStatic(value);
    }

    function setFixedRotation(value) {
        state.getSprite().setFixedRotation(value);
    }

    function setFriction(friction = 0, airFriction = 0, staticFriction = 0) {
        state.getSprite().setFriction(friction, airFriction, staticFriction);
    }

    function applyForce(force) {
        state.getSprite().applyForce(force);
    }

    function update(time) {
        return time;
    }

    return {
        __constructor,
        applyForce,
        update,
        setFixedRotation,
        setFriction,
        setStatic,
    };
};

export default hasPhysics;
