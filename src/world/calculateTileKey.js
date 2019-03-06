const calculateTileKey = function calculateTileKey(x, y) {
    if (y === 0) return 'grass.png';

    return 'dirt00.png';
};

export default calculateTileKey;
