const hasParentScene = function hasParentSceneFunc(state) {
    let scene;

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
