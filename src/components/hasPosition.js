const hasPosition = function hasPositionFunc(state) {
    let x = 0;
    let y = 0;

    function setPosition(pos) {
        ({ x, y } = pos);

        return pos;
    }

    function getPosition() {
        return { x, y };
    }

    function getX() {
        return x;
    }

    function getY() {
        return y;
    }

    return {
        // props
        // methods
        getX,
        getY,
        setPosition,
        getPosition,
    };
};

export default hasPosition;
