const hasParentScene = function hasParentSceneFunc(state, sc) {
    if (!sc) throw new Error('Missing parent scene');
    let scene = sc;

    function setParentScene(parent) {
        scene = parent;
    }

    function getParentScene() {
        return scene;
    }

    return {
        getParentScene,
        setParentScene,
    };
};

export default hasParentScene;
