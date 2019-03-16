const hasParentScene = function hasParentSceneFunc(state, parentScene) {
    if (!parentScene) throw new Error('Missing parent scene');
    let scene = parentScene;

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
