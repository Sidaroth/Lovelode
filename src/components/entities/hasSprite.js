import Phaser from 'phaser';
import spriteConfig from 'configs/spriteConfig';

const hasSprite = function hasSpriteFunc(state, tileKey) {
    if (!tileKey) throw new Error('Sprite requires a tileKey');

    let sprite;
    let key = tileKey;

    function __constructor() {
        state.createSprite(key);
    }

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

    function setFlipX(value) {
        sprite.setFlipX(value);
    }

    function setKey(kp) {
        key = kp;
    }

    function setTexture(texture) {
        sprite.setTexture(texture);
    }

    function setPosition(pos) {
        if (sprite) {
            sprite.x = pos.x;
            sprite.y = pos.y;
        }
    }

    function destroy() {
        sprite.destroy();
    }

    return {
        __constructor,
        createSprite,
        getKey,
        setKey,
        setFlipX,
        getSprite,
        setTexture,
        setPosition,
        destroy,
    };
};

export default hasSprite;
