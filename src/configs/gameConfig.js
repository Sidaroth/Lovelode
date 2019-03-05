export default {
    GAME: {
        VIEWHEIGHT: 1080,
        VIEWWIDTH: 1920,
        TITLE: 'Lovelode',
    },
    SCENES: {
        BOOT: 'game_boot',
        LOAD: 'game_load',
        GAME: 'game_game',
        UI: 'UI',
    },
    DEFAULT_TEXT_STYLE: {
        font: 'Roboto',
        fontSize: 20,
        fill: '#ffffff',
        smoothed: false,
    },
    UI_DEFAULT: {
        tint: 0xaaaaaa,
    },
    WORLD: {
        tileWidth: 128,
        tileHeight: 128,
        gravity: 0.5,
        tilesInWidth: 3,
        tilesInHeight: 3,
        surfaceOffset: 10,
    },
    COLLISION: {
        default: 0x0001,
        tiles: 0x0002,
        player: 0x0003,
    },
};
