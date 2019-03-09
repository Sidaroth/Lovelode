import Stats from 'stats-js';
import * as dat from 'dat.gui';
import gameConfig from 'configs/gameConfig';
import isScene from 'components/isScene';
import createState from 'utils/createState';
import eventConfig from 'configs/eventConfig';
import spriteConfig from 'configs/spriteConfig';
import canEmit from 'components/events/canEmit';
import audioConfig from 'configs/audioConfig';

/**
 * Layer/Scene for UI elements.
 */

const UI = function UIFunc() {
    const state = {};
    let gui;
    let stats;
    let muteIcon;

    function setupPerformanceStats() {
        stats = new Stats();
        stats.setMode(0);

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.body.appendChild(stats.domElement);

        state.getScene().events.on('preupdate', () => {
            stats.begin();
        });
        state.getScene().events.on('postupdate', () => {
            stats.end();
        });
    }

    function setupDatGui() {
        gui = new dat.GUI();

        state.guiData = {
            volume: 70,
        };

        gui.addFolder('Options');
        gui.add(state.guiData, 'volume', 0, 100).onChange((v) => {
            state.emitGlobal(eventConfig.EVENTS.SOUND.VOLUME, v / 100);
        });
    }

    function getMuteIconKey() {
        if (localStorage.getItem(audioConfig.IDENTIFIERS.MUTE) === 'true') {
            return spriteConfig.UIELEMENTS.SPEAKER_OFF.KEY;
        }
        return spriteConfig.UIELEMENTS.SPEAKER.KEY;
    }

    function updateMute() {
        state.emitGlobal(eventConfig.EVENTS.SOUND.TOGGLE_MUTE);
        muteIcon.setTexture(getMuteIconKey());
    }

    function setupMute() {
        const startingIcon = getMuteIconKey();
        muteIcon = state.getScene().add.image(1850, 1040, startingIcon);
        muteIcon.setScrollFactor(0);
        muteIcon.tint = gameConfig.UI_DEFAULT.tint;
        muteIcon.depth = 3;
        muteIcon.setInteractive();
        muteIcon.on('pointerup', updateMute, state);
    }

    function create() {
        setupDatGui();
        setupPerformanceStats();
        setupMute();
    }

    function destroy() {
        gui.destroy();
        stats.end();
        document.body.removeChild(stats);
    }

    const localState = {
        // methods
        create,
        destroy,
    };

    return createState('UIScene', state, {
        localState,
        isScene: isScene(state, gameConfig.SCENES.UI),
        canEmit: canEmit(state),
    });
};

export default UI;
