import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const state = {
  paises: [],
  estados: []
}

const getters = {
  items: paises => {
      return paises.Nombre;
  },
  items: estados => {
    return estados.Nombre;
  }
}

const mutations = {
  SET_PAISES(state, items) {
      state.paises = items
  },
  SET_ESTADOS(state, items) {
    state.estados = items
  }
}

const actions = {
  getPaises({ commit }) {
    return axios.get('http://localhost:3000/ConsultarPaises?nActivo=1',{},{'Access-Control-Allow-Origin': '*'})
    .then(response => commit('SET_PAISES', response.data))
    .catch(error => console.log(error))
  },
  getEstados({ commit }) {
    return axios.get('http://localhost:3000/ConsultarEstados?nActivo=1',{},{'Access-Control-Allow-Origin': '*'})
    .then(response => commit('SET_ESTADOS', response.data))
    .catch(error => console.log(error))
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
