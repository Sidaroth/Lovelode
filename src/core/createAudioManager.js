import audioConfig from 'configs/audioConfig';
import createState from 'utils/createState';
import eventConfig from 'configs/eventConfig';
import canListen from 'components/events/canListen';
import hasParentScene from 'components/hasParentScene';

const createAudioManager = function createAudioManagerFunc(scene) {
    const state = {};
    let currentSong;
    let currentVolume = 0.7;
    let isMusicPlaying = false;

    const soundEffects = new Map();
    const music = new Map();
    const defaultSongKey = audioConfig.MUSIC.BG_SCORE.KEY;

    function _updateMute() {
        if (state.isAudioMuted()) {
            state.getParentScene().sound.mute = true;
        } else {
            state.getParentScene().sound.mute = false;
        }
    }

    function _playSfx(data) {
        const { key, pos } = data;
        if (soundEffects.has(key)) {
            const sfx = soundEffects.get(key);
            sfx.volume = currentVolume;
            sfx.play();
        }
    }

    function _pauseMusic() {
        if (currentSong) {
            currentSong.pause();
        }
        isMusicPlaying = false;
    }

    function _playMusic(key = defaultSongKey) {
        if (!isMusicPlaying && music.has(key)) {
            currentSong = music.get(key);
            currentSong.volume = currentVolume;
            currentSong.play();
            isMusicPlaying = true;
        }
    }

    function _stopMusic() {
        if (currentSong) {
            currentSong.stop();
            currentSong = null;
        }
        isMusicPlaying = false;
    }

    function _togglePauseOnBlur(val) {
        state.setPauseOnBlur(val);
    }

    function _toggleMute() {
        const muteStatus = (!state.isAudioMuted()).toString();
        localStorage.setItem(audioConfig.IDENTIFIERS.MUTE, muteStatus);
        _updateMute();
    }

    function _setVolume(value) {
        currentVolume = value;
        currentSong.volume = currentVolume;
    }

    function _setupListeners() {
        state.listenGlobal(eventConfig.SOUND.SFX, _playSfx);
        state.listenGlobal(eventConfig.SOUND.PLAY_MUSIC, _playMusic);
        state.listenGlobal(eventConfig.SOUND.PAUSE_MUSIC, _pauseMusic);
        state.listenGlobal(eventConfig.SOUND.STOP_MUSIC, _stopMusic);
        state.listenGlobal(eventConfig.SOUND.VOLUME, _setVolume);
        state.listenGlobal(eventConfig.SOUND.TOGGLE_MUTE, _toggleMute);
        state.listenGlobal(eventConfig.SOUND.PAUSEONBLUR, _togglePauseOnBlur);
    }

    function __constructor() {
        _setupListeners();
        _updateMute();
        state.setPauseOnBlur(true);

        Object.keys(audioConfig.MUSIC).forEach((objKey) => {
            const MUSIC = audioConfig.MUSIC[objKey];
            music.set(MUSIC.KEY, state.getParentScene().sound.add(MUSIC.KEY));
        });

        Object.keys(audioConfig.SFX).forEach((objKey) => {
            const SFX = audioConfig.SFX[objKey];
            soundEffects.set(SFX.KEY, state.getParentScene().sound.add(SFX.KEY));
        });
    }

    // PUBLIC
    function setPauseOnBlur(pauseOnBlur) {
        if (state.getParentScene()) {
            state.getParentScene().sound.pauseOnBlur = pauseOnBlur; // Keep audio playing even when losing focus.
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
        return localStorage.getItem(audioConfig.IDENTIFIERS.MUTE) === 'true';
    }

    function destroy() {
        state.stopMusic();
        soundEffects.destroy();
        music.destroy();
    }

    const localState = {
        // props
        // methods
        __constructor,
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
        hasParentScene: hasParentScene(state, scene),
    });
};

/**
 * Audio manager instance, there should only be one. Implementation may change.
 */
export default createAudioManager;
