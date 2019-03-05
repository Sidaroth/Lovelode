import gameConfig from 'configs/gameConfig';
import createTile from '../entities/createTile';
import calculateTileKey from './calculateTileKey';

const generateWorld = function generateWorldFunc(scene) {
    const world = [];

    for (let x = 0; x < gameConfig.WORLD.tilesInWidth; x += 1) {
        for (let y = 0; y < gameConfig.WORLD.tilesInHeight; y += 1) {
            const tile = createTile();
            const tileGap = 25;
            const pos = {
                x: x * gameConfig.WORLD.tileWidth,
                y: y * gameConfig.WORLD.tileHeight,
            };

            const tileKey = calculateTileKey(x, y);

            tile.setParentScene(scene);
            tile.setPosition(pos);
            tile.createSprite(tileKey);

            world.push(tile);
        }
    }

    return world;
};

export default generateWorld;
