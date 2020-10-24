// import axios from "axios";

const getDefaultState = () => {
    return {
        id: null,
    }
};

export default {
    namespaced: true,
    state: getDefaultState(),
    mutations: {
        resetState(state) {
            Object.assign(state, getDefaultState());
        },
        //
    },
    actions: {
        //
    },
    getters: {
        //
    }
}
