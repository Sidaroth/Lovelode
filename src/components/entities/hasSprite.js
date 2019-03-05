import Phaser from 'phaser';
import spriteConfig from 'configs/spriteConfig';

const hasSprite = function hasSpriteFunc(state) {
    let sprite;
    let key = 'DEFAULT_KEY';

    function createSprite(kp) {
        if (sprite) {
            sprite.destroy();
        }

        state.setKey(kp);
        sprite = new Phaser.GameObjects.Sprite(
            state.getParentScene(),
            state.getPosition().x,
            state.getPosition().y,
            spriteConfig.DIGGERPACK.KEY,
            kp,
        );

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
