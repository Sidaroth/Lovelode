import gameConfig from 'configs/gameConfig';
import resizeCanvas from 'utils/resizeCanvas';
import getFunctionUsage from 'utils/getFunctionUsage';
import isScene from '../components/isScene';

const BootScene = function BootSceneFunc() {
    const state = {};

    function create() {
        resizeCanvas();
        state.getScene().cameras.main.setSize(gameConfig.GAME.VIEWWIDTH, gameConfig.GAME.VIEWHEIGHT);
        state.getScene().scene.start(gameConfig.SCENES.LOAD);
    }

    const localState = {
        // methods
    };

    const isSceneState = isScene(state, gameConfig.SCENES.BOOT);

    const states = [{ state, name: 'state' }, { state: localState, name: 'localState' }, { state: isSceneState, name: 'isScene' }];

    getFunctionUsage(states, 'Boot');
    return Object.assign(...states.map(s => s.state), {
        // pipes and overrides
        create,
    });
};

export default BootScene;
