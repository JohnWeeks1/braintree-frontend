import axios from "axios";

const getDefaultState = () => {
    return {
        id: null,
        firstName: null,
        lastName: null,
        email: null,
        isLoggedIn: false,
        isSubscribed: false,
    }
};

export default {
    namespaced: true,
    state: getDefaultState(),
    mutations: {
        resetState(state) {
            Object.assign(state, getDefaultState());
        },
        updateId(state, payload) {
            state.id = payload
        },
        updateFirstName(state, payload) {
            state.firstName = payload
        },
        updateLastName(state, payload) {
            state.lastName = payload
        },
        updateEmail(state, payload) {
            state.email = payload
        },
        updateIsLoggedIn(state, payload) {
            state.isLoggedIn = payload
        },
    },
    actions: {
        async fetchUser({commit}) {
             await axios.get('api/users')
                .then(response => {
                    commit('updateId', response.data.data.id);
                    commit('updateFirstName', response.data.data.firstname);
                    commit('updateLastName', response.data.data.lastname);
                    commit('updateEmail', response.data.data.email);
                    commit('updateIsLoggedIn', true);
                })
                .catch(error => {
                    console.error(error);
                })
        },
        async logout({commit}){
            await axios.post('api/logout')
                .then(() => {
                    commit('resetState');
                    localStorage.removeItem('braintree');
                    commit('updateIsLoggedIn', false);
                })
                .catch(error => {
                    console.error(error);
                })
        },
    },
    getters: {
        getUserId: state => state.id,

        getFirstName: state => state.firstName,

        getLastName: state => state.lastName,

        getEmail: state => state.email,

        getIsLoggedIn: state => state.isLoggedIn,
    }
}
