import Phaser from 'phaser';

const hasSprite = function hasSpriteFunc(state) {
    let sprite;
    let key = 'DEFAULT_KEY';

    function createSprite(kp) {
        state.setKey(kp);
        sprite = new Phaser.GameObjects.Sprite(state.getParentScene(), state.getPosition().x, state.getPosition().y, key);

        state.getParentScene().add.existing(sprite);
    }

    function getSprite() {
        return sprite;
    }

    function getKey() {
        return key;
    }

    function setKey(kp) {
        key = kp;
    }

    function setTexture(texture) {
        sprite.setTexture(texture);
    }

    function destroy() {
        sprite.destroy();
    }

    return {
        createSprite,
        getKey,
        setKey,
        getSprite,
        setTexture,
        destroy,
    };
};

export default hasSprite;
