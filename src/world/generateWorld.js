import gameConfig from 'configs/gameConfig';
import createTile from '../entities/createTile';
import calculateTileKey from './calculateTileKey';

const generateWorld = function generateWorldFunc(scene) {
    const world = [];

    for (let x = 0; x < gameConfig.WORLD.tilesInWidth; x += 1) {
        for (let y = 0; y < gameConfig.WORLD.tilesInHeight; y += 1) {
            // We have to offset a certain amount from top of screen (y = 0)
            const surfaceOffset = gameConfig.WORLD.tileHeight * 10;
            const xOffset = gameConfig.WORLD.tileWidth / 2;
            const yOffset = gameConfig.WORLD.tileHeight / 2 + surfaceOffset;

            const pos = {
                x: x * gameConfig.WORLD.tileWidth + xOffset,
                y: y * gameConfig.WORLD.tileHeight + yOffset,
            };

            const tileKey = calculateTileKey(x, y);
            const tile = createTile(scene, tileKey);
            tile.setPosition(pos);

            scene.add.circle(pos.x, pos.y, 3, 0xff0000);

            world.push(tile);
        }
    }

    return world;
};

export default generateWorld;
