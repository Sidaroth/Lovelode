const hasPhysics = function hasPhysicsFunc(state) {
    function __constructor() {
        if (!state.getParentScene().matter) throw new Error('hasPhysics requires composing state to have a matter enabled scene.');
        state
            .getParentScene()
            .matter.add.gameObject(state.getSprite())
            .setStatic(true);
    }

    function setStaticStatus(value) {
        state.getSprite().setStatic(value);
    }

    function applyForce(force) {
        state.getSprite().applyForce(force);
    }

    function update(runtime, delta) {}

    return {
        __constructor,
        applyForce,
        update,
        setStaticStatus,
    };
};

export default hasPhysics;
