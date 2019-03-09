const hasCollision = function hasCollisionFunc(state) {
    function setCollidesWith(objects) {
        state.getSprite().setCollidesWith(objects);
    }

    function setCollisionCategory(category) {
        state.getSprite().setCollisionCategory(category);
    }

    return {
        setCollidesWith,
        setCollisionCategory,
    };
};

export default hasCollision;
