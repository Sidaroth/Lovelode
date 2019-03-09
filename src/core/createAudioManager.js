import gameConfig from 'configs/gameConfig';
import spriteConfig from 'configs/spriteConfig';
import audioConfig from 'configs/audioConfig';
import createState from 'utils/createState';
import eventConfig from 'configs/eventConfig';
import canListen from 'components/events/canListen';

const createAudioManager = function createAudioManagerFunc(parentScene) {
    const state = {};

    let scene = parentScene;
    let muteIcon;
    let currentSong;
    let currentVolume = 0.7;

    const muteIdentifier = `${gameConfig.GAME.TITLE.replace(/ /g, '_')}_isMuted`; // replace all spaces with _ for safety
    const soundEffects = new Map();
    const music = new Map();
    const defaultSongKey = audioConfig.MUSIC.BG_SCORE.KEY;

    function _updateMute() {
        if (state.isAudioMuted()) {
            muteIcon.setTexture(spriteConfig.UIELEMENTS.SPEAKER_OFF.KEY);
            scene.sound.mute = true;
        } else {
            muteIcon.setTexture(spriteConfig.UIELEMENTS.SPEAKER.KEY);
            scene.sound.mute = false;
        }
    }

    function playSfx(data) {
        const { key, pos } = data;
        if (soundEffects.has(key)) {
            const sfx = soundEffects.get(key);
            console.log(sfx);
            sfx.volume = currentVolume;
            sfx.play();
        }
    }

    function pauseMusic() {
        if (currentSong) {
            currentSong.pause();
        }
        state.isMusicPlaying = false;
    }

    function playMusic(key = defaultSongKey) {
        if (!state.isMusicPlaying && music.has(key)) {
            currentSong = music.get(key);
            currentSong.volume = currentVolume;
            currentSong.play();
            state.isMusicPlaying = true;
        }
    }

    function stopMusic() {
        if (currentSong) {
            currentSong.stop();
            currentSong = null;
        }
        state.isMusicPlaying = false;
    }

    function toggleMute() {
        const muteStatus = (!state.isAudioMuted()).toString();
        localStorage.setItem(muteIdentifier, muteStatus);
        _updateMute();
    }

    function setVolume(value) {
        currentVolume = value;
    }

    function _setupMute() {
        muteIcon = scene.add.image(1850, 1040, spriteConfig.UIELEMENTS.SPEAKER.KEY);
        muteIcon.setScrollFactor(0);
        muteIcon.tint = gameConfig.UI_DEFAULT.tint;
        muteIcon.depth = 3;
        muteIcon.setInteractive();
        muteIcon.on('pointerup', toggleMute, state);

        _updateMute();
    }

    function _setupListeners() {
        state.listenGlobal(eventConfig.EVENTS.SOUND.SFX, playSfx, state);
        state.listenGlobal(eventConfig.EVENTS.SOUND.PLAY_MUSIC, playMusic, state);
        state.listenGlobal(eventConfig.EVENTS.SOUND.PAUSE_MUSIC, pauseMusic, state);
        state.listenGlobal(eventConfig.EVENTS.SOUND.STOP_MUSIC, stopMusic, state);
        state.listenGlobal(eventConfig.EVENTS.SOUND.VOLUME, setVolume, state);
        state.listenGlobal(eventConfig.EVENTS.SOUND.TOGGLE_MUTE, toggleMute, state);
    }

    function __constructor() {
        _setupMute();
        _setupListeners();

        state.setPauseOnBlur(true);

        Object.keys(audioConfig.MUSIC).forEach((objKey) => {
            const MUSIC = audioConfig.MUSIC[objKey];
            music.set(MUSIC.KEY, scene.sound.add(MUSIC.KEY));
        });

        Object.keys(audioConfig.SFX).forEach((objKey) => {
            const SFX = audioConfig.SFX[objKey];
            soundEffects.set(SFX.KEY, scene.sound.add(SFX.KEY));
        });
    }

    // PUBLIC
    function setScene(newScene) {
        // TODO move from old to new, if scene is already defined
        scene = newScene;
        return state;
    }

    function setPauseOnBlur(pauseOnBlur) {
        if (scene) {
            scene.sound.pauseOnBlur = pauseOnBlur; // Keep audio playing even when losing focus.
        }
        return state;
    }

    function getCurrentVolume() {
        return currentVolume;
    }

    function getCurrentSong() {
        return currentSong;
    }

    function getAudioContext(key = defaultSongKey) {
        return music.get(key).source.context;
    }

    function getAudioSource(key = defaultSongKey) {
        return music.get(key).source;
    }

    function isAudioMuted() {
        return localStorage.getItem(muteIdentifier) === 'true';
    }

    function destroy() {
        state.stopMusic();
        muteIcon.destroy();
        soundEffects.destroy();
        music.destroy();
    }

    const localState = {
        // props
        isMusicPlaying: false,
        // methods
        __constructor,
        setScene,
        setPauseOnBlur,
        getAudioContext,
        getCurrentSong,
        getAudioSource,
        getCurrentVolume,
        isAudioMuted,
        destroy,
    };

    return createState('AudioManager', state, {
        localState,
        canListen: canListen(state),
    });
};

/**
 * Audio manager instance, there should only be one. Implementation may change.
 */
export default createAudioManager;
