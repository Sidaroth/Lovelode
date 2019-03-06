import Phaser from 'phaser';
import getFunctionUsage from 'utils/getFunctionUsage';
import generateWorld from '../world/generateWorld';
import store from '../store';
import isScene from '../components/isScene';
import gameConfig from 'configs/gameConfig';

/**
 * Layer/Scene for UI elements.
 */

const World = function WorldFunc() {
    const state = {};
    let tileMap;

    function create() {
        tileMap = generateWorld(state.getScene());
    }

    function destroy() {}

    function update() {
        // update code.
    }

    const localState = {
        // methods
    };

    const isSceneState = isScene(state, gameConfig.SCENES.WORLD);
    const states = [{ state, name: 'state' }, { state: localState, name: 'localState' }, { state: isSceneState, name: 'isScene' }];

    getFunctionUsage(states, 'WorldScene');
    return Object.assign(...states.map(s => s.state), {
        // pipes and overrides
        create,
        destroy,
        update,
    });
};

export default World;
