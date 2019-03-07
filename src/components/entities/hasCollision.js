const hasCollision = function hasCollisionFunc(state) {
    function setupCollision() {
        const dd = state.getParentScene().matter.add.gameObject(state.sprite);
    }

    function setCollidesWith(objects) {
        state.getSprite().setCollidesWith(objects);
    }

    function setCollisionCategory(category) {
        state.getSprite().setCollisionCategory(category);
    }

    return {
        setupCollision,
        setCollidesWith,
        setCollisionCategory,
    };
};

export default hasCollision;
