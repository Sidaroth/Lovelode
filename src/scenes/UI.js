import Stats from 'stats-js';
import * as dat from 'dat.gui';
import gameConfig from 'configs/gameConfig';
import isScene from 'components/isScene';
import createState from 'utils/createState';
import eventConfig from 'configs/eventConfig';
import spriteConfig from 'configs/spriteConfig';
import canEmit from 'components/events/canEmit';
import audioConfig from 'configs/audioConfig';
import store from 'root/store';
import Phaser from 'phaser';
import hasInput from 'components/hasInput';

/**
 * Layer/Scene for UI elements.
 */

const createUI = function createUIFunc() {
    const state = {};
    let gui;
    let performanceStats;
    let muteIcon;

    let moneyBackground;
    let fuelBackground;
    let hullBackground;

    let moneyText;
    let fuelText;
    let hullText;

    // TODO: Scale icons/bgs when they are finalized in the sprites, not in-engine.
    const bgScaleFactor = 0.55;
    const iconScaleFactor = 0.3;

    const guiData = {
        volume: 70,
        pauseOnBlur: true,
        showFPS: false,
    };

    const onPreUpdate = () => {
        performanceStats.begin();
    };

    const onPostUpdate = () => {
        performanceStats.end();
    };

    function showPerformanceStats() {
        document.body.appendChild(performanceStats.domElement);
    }

    function hidePerformanceStats() {
        document.body.removeChild(performanceStats.domElement);
    }

    function setupPerformanceStats() {
        performanceStats = new Stats();
        performanceStats.setMode(0);

        performanceStats.domElement.style.position = 'absolute';
        performanceStats.domElement.style.left = '0px';
        performanceStats.domElement.style.top = '0px';

        state.getScene().events.on('preupdate', onPreUpdate);
        state.getScene().events.on('postupdate', onPostUpdate);

        if (guiData.showFPS) {
            showPerformanceStats();
        }
    }

    function setupDatGui() {
        gui = new dat.GUI();

        gui.addFolder('Options');
        gui.add(guiData, 'volume', 0, 100).onChange((v) => {
            state.emitGlobal(eventConfig.SOUND.VOLUME, v / 100);
        });
        gui.add(guiData, 'pauseOnBlur').onChange((val) => {
            state.emitGlobal(eventConfig.SOUND.PAUSEONBLUR, val);
        });

        gui.add(guiData, 'showFPS').onChange((val) => {
            if (val) {
                showPerformanceStats();
            } else {
                hidePerformanceStats();
            }
        });
    }

    function updatePlayerStatus() {
        // Do whatever UI related stuff..
        const stats = store.players[0].getShipStatus();
        const { money } = stats;

        const hullPercent = stats.hullCurrent / stats.hullMax;
        const fuelPercent = stats.currentFuel / stats.fuelCapacity;
        const cargoUsage = stats.cargoUsage / stats.cargoCapacity;

        const iconOffset = moneyBackground.width * bgScaleFactor / 10;
        const yOffset = 3; // because the bar is lower than the top of the sprite, it looks odd without.
        moneyText.setText(money);
        moneyText.x = moneyBackground.x - moneyText.width / 2 + iconOffset;
        moneyText.y = moneyBackground.y - moneyText.height / 2 + yOffset;

        fuelText.setText(`${stats.currentFuel}/${stats.fuelCapacity} (${fuelPercent * 100}%)`);
        fuelText.x = fuelBackground.x - fuelText.width / 2 + iconOffset;
        fuelText.y = fuelBackground.y - fuelText.height / 2 + yOffset;

        hullText.setText(`${stats.hullCurrent}/${stats.hullMax} (${hullPercent * 100}%)`);
        hullText.x = hullBackground.x - hullText.width / 2 + iconOffset;
        hullText.y = hullBackground.y - hullText.height / 2 + yOffset;
    }

    function getMuteIconKey() {
        if (localStorage.getItem(audioConfig.IDENTIFIERS.MUTE) === 'true') {
            return spriteConfig.UIELEMENTS.SPEAKER_OFF.KEY;
        }
        return spriteConfig.UIELEMENTS.SPEAKER.KEY;
    }

    function updateMute() {
        state.emitGlobal(eventConfig.SOUND.TOGGLE_MUTE);
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

    function setupUIElements() {
        // Backgrounds
        moneyBackground = new Phaser.GameObjects.Sprite(state.getScene(), 0, 0, spriteConfig.MECHATOON.KEY, 'elements/hud_2.png').setScale(bgScaleFactor);
        fuelBackground = new Phaser.GameObjects.Sprite(state.getScene(), 0, 0, spriteConfig.MECHATOON.KEY, 'elements/hud_2.png').setScale(bgScaleFactor);
        hullBackground = new Phaser.GameObjects.Sprite(state.getScene(), 0, 0, spriteConfig.MECHATOON.KEY, 'elements/hud_2.png').setScale(bgScaleFactor);

        const spacing = (moneyBackground.height * 1.25 * bgScaleFactor);
        const xPadding = 15;
        const yPadding = 15;

        moneyBackground.x = xPadding + (moneyBackground.width / 2 * bgScaleFactor);
        moneyBackground.y = yPadding + (moneyBackground.height / 2 * bgScaleFactor);

        fuelBackground.x = xPadding + (fuelBackground.width / 2 * bgScaleFactor);
        fuelBackground.y = spacing + yPadding + (fuelBackground.height / 2 * bgScaleFactor);

        hullBackground.x = xPadding + (hullBackground.width / 2 * bgScaleFactor);
        hullBackground.y = 2 * spacing + yPadding + (hullBackground.height / 2 * bgScaleFactor);

        // Icons
        const hullIcon = new Phaser.GameObjects.Sprite(state.getScene(), 0, 0, spriteConfig.MECHATOON.KEY, 'icons/icon_enable_2.png').setScale(iconScaleFactor);
        const moneyIcon = new Phaser.GameObjects.Sprite(state.getScene(), 0, 0, spriteConfig.MECHATOON.KEY, 'icons/icon_enable_7.png').setScale(iconScaleFactor);
        const fuelIcon = new Phaser.GameObjects.Sprite(state.getScene(), 0, 0, spriteConfig.MECHATOON.KEY, 'icons/icon_enable_17.png').setScale(iconScaleFactor);

        hullIcon.x = hullBackground.x - hullBackground.width * bgScaleFactor / 2 + xPadding * 1.5;
        hullIcon.y = hullBackground.y;

        moneyIcon.x = moneyBackground.x - moneyBackground.width * bgScaleFactor / 2 + xPadding * 1.5;
        moneyIcon.y = moneyBackground.y;

        fuelIcon.x = fuelBackground.x - fuelBackground.width * bgScaleFactor / 2 + xPadding * 1.5;
        fuelIcon.y = fuelBackground.y;

        // text
        moneyText = new Phaser.GameObjects.Text(state.getScene(), moneyBackground.x, moneyBackground.y, 'Default text', gameConfig.DEFAULT_TEXT_STYLE);
        fuelText = new Phaser.GameObjects.Text(state.getScene(), fuelBackground.x, fuelBackground.y, 'Default text', gameConfig.DEFAULT_TEXT_STYLE);
        hullText = new Phaser.GameObjects.Text(state.getScene(), hullBackground.x, hullBackground.y, 'Default text', gameConfig.DEFAULT_TEXT_STYLE);

        // Add to scene.
        state.getScene().add.existing(moneyBackground);
        state.getScene().add.existing(fuelBackground);
        state.getScene().add.existing(hullBackground);

        state.getScene().add.existing(moneyIcon);
        state.getScene().add.existing(hullIcon);
        state.getScene().add.existing(fuelIcon);

        state.getScene().add.existing(moneyText);
        state.getScene().add.existing(fuelText);
        state.getScene().add.existing(hullText);
    }

    function update(time) {
        updatePlayerStatus();
        return time;
    }

    function create() {
        setupDatGui();
        setupPerformanceStats();
        setupMute();

        setupUIElements();
    }

    function destroy() {
        gui.destroy();
        performanceStats.end();
        document.body.removeChild(performanceStats);
    }

    const localState = {
        // methods
        create,
        destroy,
        update,
    };

    return createState('UIScene', state, {
        localState,
        isScene: isScene(state, gameConfig.SCENES.UI),
        canEmit: canEmit(state),
        hasInput: hasInput(state),
    });
};

export default createUI;
