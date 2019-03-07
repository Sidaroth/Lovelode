const hasPhysics = function hasPhysicsFunc(state) {
    function __constructor() {
        if (!state.getParentScene().matter) throw new Error('hasPhysics requires composing state to have a matter enabled scene.');
        state
            .getParentScene()
            .matter.add.gameObject(state.getSprite())
            .setStatic(false);
    }

    function setStaticStatus(value) {
        state.getSprite().setStatic(value);
    }

    function applyForce(force) {
        state.getSprite().applyForce(force);
    }

    function update() {
        // console.log(state.getPosition());
        // const currentPos = state.getPosition();
        // velocity.add(acceleration);
    }

    return {
        __constructor,
        applyForce,
        update,
        setStaticStatus,
    };
};

export default hasPhysics;
