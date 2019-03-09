import gameConfig from './gameConfig';

export default {
    MUSIC: {
        BG_SCORE: {
            KEY: 'bg_score',
            PATH: 'assets/audio/Philipp_Weigl_-_06_-_Full_of_Stars.mp3',
        },
    },
    SFX: {},
    IDENTIFIERS: {
        MUTE: `${gameConfig.GAME.TITLE.replace(/ /g, '_')}_isMuted`, // replace all spaces with _ for safety
    },
};
