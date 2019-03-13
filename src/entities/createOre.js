import createState from 'utils/createState';
import isGameEntity from 'components/entities/isGameEntity';

const createOre = function createOreFunc(data) {
    const state = {};
    const { weight, type, value } = data;

    const localState = {
        weight,
        type,
        value,
    };

    return createState('Ore', state, {
        localState,
        isGameEntity: isGameEntity(state), // We want each ore to have a unique ID so we can refer to it later in the shops etc.
    });
};

export default createOre;
