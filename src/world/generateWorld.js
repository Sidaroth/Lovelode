import gameConfig from 'configs/gameConfig';
import createTile from '../entities/createTile';

const calculateTileKey = function calculateTileKey(x, y) {
    return 'Tiles/dirt00';
};

const generateWorld = function generateWorldFunc(scene) {
    const world = [];

    for (let x = 0; x < gameConfig.WORLD.tilesInWidth; x += 1) {
        for (let y = 0; y < gameConfig.WORLD.tilesInHeight; y += 1) {
            const tile = createTile();
            const pos = {
                x: x + 1,
                y: y + 1,
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
