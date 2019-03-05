import getUUID from 'utils/getUUID';

const isGameEntity = function isGameEntityFunc(state) {
    return {
        // props
        id: getUUID(),
        // methods
    };
};

export default isGameEntity;
