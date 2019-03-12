import gameConfig from 'configs/gameConfig';
import getRandomInt from 'utils/getRandomInt';

/*
 * TODO: Make this much more depth based, i.e further depth levels give higher rarity ore.
 * TODO: Make it smarter when it comes to veins/clusters of ore. It should be likely to have clusters of say 4-5 nodes close to eachother, but not 45.
 */
const generateTileData = function generateTileDataFunc(x, y) {
    let tileData = gameConfig.TILE_TYPES.DIRT;

    if (y === 0) {
        tileData = gameConfig.TILE_TYPES.GRASS;
    } else if (y > 1) {
        const random = getRandomInt(0, 100);

        if (random > 80 && random < 88) {
            tileData = gameConfig.TILE_TYPES.COAL;
        } else if (random >= 88 && random <= 93) {
            tileData = gameConfig.TILE_TYPES.COPPER;
        } else if (random > 93 && random < 96) {
            tileData = gameConfig.TILE_TYPES.IRON;
        } else if (random >= 96) {
            tileData = gameConfig.TILE_TYPES.SILVER;
        }
    }

    return tileData;
};

export default generateTileData;
