export const FormReduces = (state, action) => {
    const { type, payload } = action;

    switch (type) {
        case 'ADD_INFO':
            return {
                ...state,
                data: {
                    ...state.data,
                    ...payload
                }
            };
        case 'GO_BACK':
            return {
                ...state,
                display: state.display - 1
            };
        case 'SET_DISPLAY':
            return {
                ...state,
                display: payload
            };
        default:
            return state;
    }
}