import Phaser from 'phaser';
import getFunctionUsage from 'utils/getFunctionUsage';
import generateWorld from '../world/generateWorld';

/**
 * Layer/Scene for UI elements.
 */

const World = function WorldFunc() {
    const state = {};
    const worldScene = new Phaser.Scene();
    let tileMap;

    function getSceneInstance() {
        return worldScene;
    }

    worldScene.create = () => {
        console.log('world create');
        tileMap = generateWorld(worldScene);
        console.log(tileMap);
    };

    worldScene.destroy = () => {};

    const localState = {
        // methods
        getSceneInstance,
    };

    const states = [{ state, name: 'state' }, { state: localState, name: 'localState' }];

    getFunctionUsage(states, 'WorldScene');
    return Object.assign(...states.map(s => s.state), {
        // pipes and overrides
    });
};

export default World;
