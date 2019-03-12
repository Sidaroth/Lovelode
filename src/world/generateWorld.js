import gameConfig from 'configs/gameConfig';
import createTile from '../entities/createTile';
import generateTileData from './generateTileData';

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

            const tileData = generateTileData(x, y);
            const tile = createTile(scene, tileData);
            tile.setPosition(pos);

            world.push(tile);
        }
    }

    return world;
};

export default generateWorld;
