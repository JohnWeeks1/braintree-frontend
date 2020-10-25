import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from 'vuex-persist'
import UserModule from "@/store/UserModule";

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  key: 'braintree',
  storage: window.localStorage,
});


export default new Vuex.Store({
  modules: {
    user : UserModule
  },
  plugins: [vuexLocal.plugin]
});
