import tileConfig from 'configs/tileConfig';
import getRandomInt from 'utils/getRandomInt';

/*
 * TODO: Make this much more depth based, i.e further depth levels give higher rarity ore.
 * TODO: Make it smarter when it comes to veins/clusters of ore. It should be likely to have clusters of say 4-5 nodes close to eachother, but not 45.
 */
const generateTileData = function generateTileDataFunc(x, y) {
    let tileData = tileConfig.TYPES.DIRT;

    if (y === 0) {
        tileData = tileConfig.TYPES.GRASS;
    } else if (y > 1) {
        const random = getRandomInt(0, 100);
        if (random < 4) {
            tileData = null;
        } else if (random > 75 && random < 80) {
            tileData = tileConfig.TYPES.COAL;
        } else if (random > 80 && random < 84) {
            tileData = tileConfig.TYPES.COPPER;
        } else if (random >= 85 && random <= 88) {
            tileData = tileConfig.TYPES.IRON;
        } else if (random > 89 && random < 93) {
            tileData = tileConfig.TYPES.SILVER;
        } else if (random >= 93 && random <= 95) {
            tileData = tileConfig.TYPES.LAPIS_LAZULI;
        } else if (random > 95 && random < 98) {
            tileData = tileConfig.TYPES.GOLD;
        } else if (random >= 98) {
            tileData = tileConfig.TYPES.DIAMOND;
        }
    }

    return tileData;
};

export default generateTileData;
