import gameConfig from './gameConfig';

const prefix = `${gameConfig.GAME.TITLE.replace(/ /g, '_')}_Event_`; // i.e Lovelode_Event_keydown

export default {
    GAME: {
        STARTED: `${prefix}game started`,
        PLAYER_DEATH: `${prefix}player died`,
        PLAYER_NOFUEL: `${prefix}player no fuel`,
        PLAYER_ADDED: `${prefix}player added`,
    },
    KEYBOARD: {
        KEYDOWN: `${prefix}keydown`,
        KEYUP: `${prefix}keyup`,
    },
    MOVEMENT: `${prefix}movement`,
    SOUND: {
        SFX: `${prefix}sfx`,
        PLAY_MUSIC: `${prefix}play_music`,
        PAUSE_MUSIC: `${prefix}pause_music`,
        STOP_MUSIC: `${prefix}stop_music`,
        VOLUME: `${prefix}volume`,
        PAUSEONBLUR: `${prefix}pause_on_blur`,
    },
    COLLISION: {
        START: `${prefix}collisionStart`,
        END: `${prefix}collisionEnd`,
    },
    DRILLING: {
        START: `${prefix}drillingStart`,
        FINISHED: `${prefix}drillingFinished`,
        CANCEL: `${prefix}drillingCanceled`,
    },
    INTERNAL_TRIGGER: {
        ENTER: `${prefix}internal_triggerEnter`,
        EXIT: `${prefix}internal_triggerExit`,
    },
    TRIGGER: {
        ENTER: `${prefix}triggerEnter`,
        EXIT: `${prefix}triggerExit`,
    },
};
