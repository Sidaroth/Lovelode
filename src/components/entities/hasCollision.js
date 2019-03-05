const hasCollision = function hasCollisionFunc(state) {
    function setupCollision() {
        const dd = state.getParentScene().matter.add.gameObject(state.sprite);
        console.log(dd);
    }

    function setStaticStatus(value) {
        state.getSprite().setStatic(value);
    }

    function setCollidesWith(objects) {
        state.getSprite().setCollidesWith(objects);
    }

    function setCollisionCategory(category) {
        state.getSprite().setCollisionCategory(category);
    }

    return {
        setupCollision,
        setStaticStatus,
        setCollidesWith,
        setCollisionCategory,
    };
};

export default hasCollision;
