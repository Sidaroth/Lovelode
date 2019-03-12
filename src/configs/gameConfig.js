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
        WORLD: 'scene_world',
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
        tileWidth: 64,
        tileHeight: 64,
        gravity: 0.5,
        tilesInWidth: 50,
        tilesInHeight: 5,
    },
    COLLISION: {
        default: 0x0001,
        tiles: 0x0002,
        player: 0x0003,
    },
    DIRECTIONS: {
        LEFT: 0,
        UP: 1,
        RIGHT: 2,
        DOWN: 3,
    },
};
