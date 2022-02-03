import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const state = {
  paises: [],
  estados: [],
  municipios: []
}

const getters = {
  items: paises => {
      return paises.Nombre;
  },
  items: estados => {
    return estados.Nombre;
  },
  items: municipios => {
    return municipios.Nombre;
  }
}

const mutations = {
  SET_PAISES(state, items) {
      state.paises = items
  },
  SET_ESTADOS(state, items) {
    state.estados = items
  },
  SET_MUNICIPIOS(state, items) {
    state.municipios = items
  }
}

const actions = {
  async getPaises({commit}) {
    try {
      const response = await axios.get(process.env.VUE_APP_API_URL + '/ConsultarPaises?nActivo=1', {}, { 'Access-Control-Allow-Origin': '*' });
      return commit('SET_PAISES', response.data);
    } catch (error) {
      return console.log(error);
    }
  },
  async getEstados({commit}) {
    try {
      const response = await axios.get(process.env.VUE_APP_API_URL + '/ConsultarEstados?nActivo=1', {}, { 'Access-Control-Allow-Origin': '*' });
      return commit('SET_ESTADOS', response.data);
    } catch (error) {
      return console.log(error);
    }
  },
  async getMunicipios({commit}) {
    try {
      const response = await axios.get(process.env.VUE_APP_API_URL + '/ConsultarMunicipios?nActivo=1', {}, { 'Access-Control-Allow-Origin': '*' });
      return commit('SET_MUNICIPIOS', response.data);
    } catch (error) {
      return console.log(error);
    }
  },
  async postGuardaLiga({commit}, payload) {
    try {
      const url = process.env.VUE_APP_API_URL + '/GuardarLiga';
      const data = {
        data: {
          sNombre: payload.Nombre,
          sRepresentante: payload.Representante,
          nTelefono: payload.Telefono,
          sCorreo: payload.Correo,
          nIdPais: payload.idPais,
          nIdEstado: payload.idEstado,
          nIdMunicipio: payload.idMunicipio,
          nActivo: 1,
          dFechaUltimaMod: '2022-01-26 13:43:00',
          sNombrePcMod: 'TEST',
          nClaUsuarioMod: 1
        }
      };
      console.log(data);
      const config = {
        headers: {
          'content-type': 'application/json; charset=utf-8'
        }
      };
      await axios.post(url, data, config);
      return 1;
    } catch (error) {
      return console.log(error);
    }
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
