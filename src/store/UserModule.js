import axios from "axios";

const getDefaultState = () => {
    return {
        id: null,
        firstName: null,
        lastName: null,
        email: null,
        cardType: null,
        cardLastFour: null,
        isLoggedIn: false
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
        updateCardType(state, payload) {
            state.cardType = payload
        },
        updateCardLastFour(state, payload) {
            state.cardLastFour = payload
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
                    commit('updateFirstName', response.data.data.first_name);
                    commit('updateLastName', response.data.data.last_name);
                    commit('updateEmail', response.data.data.email);
                    commit('updateCardType', response.data.data.cardType);
                    commit('updateCardLastFour', response.data.data.cardLastFour);
                    commit('updateIsLoggedIn', true);
                })
                .catch(error => {
                    console.error(error);
                })
        },

        async csrfCookie(){
            await axios.get('sanctum/csrf-cookie')
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.error(error);
                });
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

        getCardType: state => state.cardType,

        getCardLastFour: state => state.cardLastFour,

        getIsLoggedIn: state => state.isLoggedIn,
    }
}
