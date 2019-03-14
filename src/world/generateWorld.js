import gameConfig from 'configs/gameConfig';
import createTile from '../entities/createTile';
import generateTileData from './generateTileData';
import tileConfig from 'configs/tileConfig';

const generateWorld = function generateWorldFunc(scene) {
    const world = [];

    for (let x = 0; x < gameConfig.WORLD.tilesInWidth; x += 1) {
        for (let y = 0; y < gameConfig.WORLD.tilesInHeight; y += 1) {
            // We have to offset a certain amount from top of screen (y = 0)
            const surfaceOffset = tileConfig.DATA.tileHeight * 10;
            const xOffset = tileConfig.DATA.tileWidth / 2;
            const yOffset = tileConfig.DATA.tileHeight / 2 + surfaceOffset;

            const pos = {
                x: (x * tileConfig.DATA.tileWidth + xOffset) * tileConfig.DATA.tileScale,
                y: (y * tileConfig.DATA.tileHeight + yOffset) * tileConfig.DATA.tileScale,
            };

            let tile = null;
            const tileData = generateTileData(x, y);
            if (tileData) {
                tile = createTile(scene, tileData);
                tile.getSprite().setScale(tileConfig.DATA.tileScale);
                tile.setPosition(pos);
            }

            world.push(tile);
        }
    }

    return world;
};

export default generateWorld;
