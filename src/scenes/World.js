import Phaser from 'phaser';
import getFunctionUsage from 'utils/getFunctionUsage';
import generateWorld from '../world/generateWorld';
import store from '../store';
import isScene from '../components/isScene';
import gameConfig from 'configs/gameConfig';

/**
 * The game world (i.e level 1)
 */
const World = function WorldFunc() {
    const state = {};
    let tileMap;

    function create() {
        tileMap = generateWorld(state.getScene());

        // Set level bounds.
        const surfaceOffset = gameConfig.WORLD.tileHeight * 10;
        state
            .getScene()
            .matter.world.setBounds(
                0,
                0,
                gameConfig.WORLD.tileWidth * gameConfig.WORLD.tilesInWidth,
                gameConfig.WORLD.tileHeight * gameConfig.WORLD.tilesInHeight + surfaceOffset,
            );
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
