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
            {text: 'IdArbitro', value: 'IdArbitro', sortable: true, width: '50px', type: 'number', editable: true, ui: true, visible: true},
            {text: 'Nombre', value: 'Nombre', sortable: false, width: '250px', type: 'text', editable: true, ui: true, visible: true},
            {text: 'Telefono', value: 'Telefono', sortable: false, width: '50px', type: 'text', editable: true, ui: true, visible: true},
            {text: 'Juegos', value: 'JuegosArbitrados', sortable: true, width: '50px', type: 'number', editable: true, ui: true, visible: true},
            {text: 'Activo', value: 'Activo', sortable: false, width: '150px', type: 'check', editable: true, ui: true, visible: true},
          ],
          gridCombo: [{name: 'IdLiga', data: 'getLigas', default: 1}],
          gridDataSel: 'BuscarArbitros',
          gridDataUi: 'GuardarArbitro',
          gridKey: ['IdLiga','IdArbitro']
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
    },
    async mounted() {
      await this.$store.dispatch('getLigas');
    }
  }
</script>
