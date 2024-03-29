import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const state = {
  paises: [],
  estados: [],
  municipios: [],
  ligas: [],
  torneos: [],
  equipos: [],
  tiposdetorneo: [],
  diassemana: []
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
  },
  items: ligas => {
    return ligas.Nombre;
  },
  items: torneos => {
    return torneos.Nombre;
  },
  items: tiposdetorneo => {
    return tiposdetorneo.Nombre;
  },
  items: diassemana => {
    return diassemana.Nombre;
  },
  items: equipos => {
    return equipos.Nombre;
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
  },
  SET_LIGAS(state, items) {
    state.ligas = items
  },
  SET_TORNEOS(state, items) {
    state.torneos = items
  },
  SET_TIPOSDETORNEO(state, items) {
    state.tiposdetorneo = items
  },
  SET_DIASSEMANA(state, items) {
    state.diassemana = items
  },
  SET_EQUIPOS(state, items) {
    state.equipos = items
  }
}

const actions = {
  async getPaises({commit}) {
    try {
      const response = await axios.get(process.env.VUE_APP_API_URL + '/ConsultarPaises?pnActivo=1', {}, { 'Access-Control-Allow-Origin': '*' });
      return commit('SET_PAISES', response.data);
    } catch (error) {
      return console.log(error);
    }
  },
  async getEstados({commit}) {
    try {
      const response = await axios.get(process.env.VUE_APP_API_URL + '/ConsultarEstados?pnActivo=1&pnIdPais=1', {}, { 'Access-Control-Allow-Origin': '*' });
      return commit('SET_ESTADOS', response.data);
    } catch (error) {
      return console.log(error);
    }
  },
  async getMunicipios({commit}) {
    try {
      const response = await axios.get(process.env.VUE_APP_API_URL + '/ConsultarMunicipios?pnActivo=1&pnIdPais=1&pnIdEstado=19', {}, { 'Access-Control-Allow-Origin': '*' });
      return commit('SET_MUNICIPIOS', response.data);
    } catch (error) {
      return console.log(error);
    }
  },
  async getLigas({commit}) {
    try {
      const response = await axios.get(process.env.VUE_APP_API_URL + '/ConsultarLigas?pnActivo=1', {}, { 'Access-Control-Allow-Origin': '*' });
      return commit('SET_LIGAS', response.data);
    } catch (error) {
      return console.log(error);
    }
  },
  async getTorneos({commit}) {
    try {
      //const response = await axios.get(process.env.VUE_APP_API_URL + '/ConsultarTorneos?pnIdLiga=1&pnActivo=1', {}, { 'Access-Control-Allow-Origin': '*' });
      const response = await axios.get(process.env.VUE_APP_API_URL + '/ConsultarTorneos?pnActivo=1', {}, { 'Access-Control-Allow-Origin': '*' });
      return commit('SET_TORNEOS', response.data);
    } catch (error) {
      return console.log(error);
    }
  },
  async getTiposDeTorneo({commit}) {
    try {
      const response = await axios.get(process.env.VUE_APP_API_URL + '/ConsultarTiposDeTorneo?pnActivo=1', {}, { 'Access-Control-Allow-Origin': '*' });
      return commit('SET_TIPOSDETORNEO', response.data);
    } catch (error) {
      return console.log(error);
    }
  },
  async getDiasSemana({commit}) {
    try {
      const response = await axios.get(process.env.VUE_APP_API_URL + '/ConsultarDiasSemana?pnActivo=1', {}, { 'Access-Control-Allow-Origin': '*' });
      return commit('SET_DIASSEMANA', response.data);
    } catch (error) {
      return console.log(error);
    }
  },
  async getEquipos({commit}) {
    try {
      const response = await axios.get(process.env.VUE_APP_API_URL + '/ConsultarEquipos?pnActivo=1', {}, { 'Access-Control-Allow-Origin': '*' });
      return commit('SET_EQUIPOS', response.data);
    } catch (error) {
      return console.log(error);
    }
  },
  async postGuardaLiga({commit}, payload) {
    try {
      const url = process.env.VUE_APP_API_URL + '/RegistroLiga';
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
  },
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
