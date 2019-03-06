const isScene = function isSceneFunc(state) {
    const scene = null;

    function get() {
        return scene;
    }

    return {
        get,
    };
};

export default isScene;
