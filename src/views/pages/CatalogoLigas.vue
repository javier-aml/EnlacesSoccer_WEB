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
            
            {text: 'IdLiga', value: 'IdLiga', sortable: false, width: '50px', type: 'number', editable: false, ui: true, visible: true},
            {text: 'Nombre', value: 'Nombre', sortable: false, width: '200px', type: 'text', editable: true, ui: true, visible: true},
            {text: 'Representante', value: 'Representante', sortable: false, width: '200px', type: 'text', editable: true, ui: true, visible: true},
            {text: 'Telefono', value: 'Telefono', sortable: false, width: '50px', type: 'text', editable: true, ui: true, visible: true},
            {text: 'Correo', value: 'Correo', sortable: false, width: '100px', type: 'text', editable: true, ui: true, visible: true},
            {text: 'País', value: 'IdPais', sortable: true, width: '50px', type: 'combo', editable: true, ui: true, visible: true},
            {text: 'Estado', value: 'IdEstado', sortable: true, width: '50px', type: 'combo', editable: true, ui: true, visible: true},
            {text: 'Municipio', value: 'IdMunicipio', sortable: true, width: '50px', type: 'combo', editable: true, ui: true, visible: true},
            {text: 'Activa', value: 'Activa', sortable: false, width: '50px', type: 'check', editable: true, ui: true, visible: true}
          ],
          gridCombo: [{name: 'IdPais', data: 'getPaises', default: 1},{name: 'IdEstado', data: 'getEstados', default: 28},{name: 'IdMunicipio', data: 'getMunicipios', default: 26}],
          gridDataSel: 'BuscarLigas',
          gridDataUi: 'GuardarLiga',
          gridKey: ['IdLiga']
      }
    },
    computed: {
      paises() {
        const data = this.$store.state.paises;
        const dataArr = [];
        for(let item of data){
          dataArr.push(item);
        }
        return dataArr;
      },
      estados() {
        if(this.idPais === null) return [];
        const data = this.$store.state.estados;
        const dataArr = [];
        for(let item of data){
          if(item.IdPais === this.idPais) dataArr.push(item);
        }
        return dataArr;
      },
      municipios() {
        if(this.idEstado === null) return [];
        const data = this.$store.state.municipios;
        const dataArr = [];
        for(let item of data){
          if(item.IdPais === this.idPais && item.IdEstado === this.idEstado) dataArr.push(item);
        }
        return dataArr;
      },
    },
    async mounted() {
      await this.$store.dispatch('getPaises');
      await this.$store.dispatch('getEstados');
      await this.$store.dispatch('getMunicipios');
    }
  }
</script>
