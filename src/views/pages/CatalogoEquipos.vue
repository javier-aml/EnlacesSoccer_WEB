<template>
  <span>
    <v-card
      flat
      class="pa-3 mt-2"
       v-show="!esGuardado"
    >
      <v-card-text>
        <v-form 
          ref="forma"
          class="multi-col-validation mt-6"
        >
          <v-row>
            
            <v-col cols="12">
            <Grid
              :header-prop="gridHeader"
              :data-sel-prop="gridDataSel"
              :data-ui-prop="gridDataUi"
              :combo-prop="gridCombo"
              :key-prop="gridKey"
              ></Grid>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </span>
</template>

<script>
  //Importamos el archivo asociado al grid
  import Grid from '../../components/Grid.vue'
  export default {
    //Importamos páginas de componentes
    components:{
      Grid
    },
    data() {
      return{
          esGuardado: false,
          valMsg: 'Este campo es requerido',
          color: '#03A9F4',
          gridHeader: [
            {text: 'Liga', value: 'IdLiga', sortable: true, width: '150px', type: 'combo', editable: true, ui: true, visible: true},
            {text: 'Torneo', value: 'IdTorneo', sortable: true, width: '150px', type: 'combo', editable: true, ui: true, visible: true},
            {text: 'Equipo', value: 'IdEquipo', sortable: false, width: '150px', type: 'number', editable: false, ui: true, visible: true},
            {text: 'Nombre', value: 'Nombre', sortable: false, width: '150px', type: 'text', editable: true, ui: true, visible: true},
            {text: 'Activo', value: 'Activo', sortable: false, width: '150px', type: 'check', editable: true, ui: true, visible: true},
            {text: 'Jugadores', value: 'Jugadores', sortable: false, width: '150px', type: 'link', editable: true, ui: false, visible: true}
          ],
          gridCombo: [{name: 'IdLiga', data: 'getLigas', default: 1},{name: 'IdTorneo', data: 'getTorneos', default: 1}],
          gridDataSel: 'BuscarEquipos',
          gridDataUi: 'GuardarEquipo',
          gridKey: ['IdLiga','IdTorneo','IdEquipo']
      }
    },
    computed: {
      ligas() {
        const data = this.$store.state.ligas;
        const dataArr = [];
        for(let item of data){
          dataArr.push(item);
        }
        return dataArr;
      },

      torneos() {
        if(this.Idliga === null) return [];
        const data = this.$store.state.torneos;
        const dataArr = [];
        for(let item of data){
          if(item.Idliga === this.Idliga) dataArr.push(item);
        }
        return dataArr;
      },
    },
    async mounted() {
      await this.$store.dispatch('getLigas');
    },
    async mounted() {
      await this.$store.dispatch('getTorneos');
    }
  }
</script>
