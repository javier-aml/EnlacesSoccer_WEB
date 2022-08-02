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
              :data-prop="gridData"
              :combo-prop="gridCombo"
              ></Grid>
            </v-col>

            <v-col cols="12">
              <v-btn
                :color="color"
                class="me-3 mt-4"
                :disabled="habilitaGuardar"
                @click.prevent="guardaTipoSancion"
              >
                Guardar
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card
      style="margin-left:auto; margin-right:auto; margin-top: 10%;"
      width="500px"
      height="200px"

      v-show="esGuardado"
    >
      <v-card-title
        style="padding-top:50px"
        class="justify-center"
      >
        El tipo de sanción fue registrado correctamente.
      </v-card-title>
      <v-btn
        :color="color"
        style="margin-left:190px; margin-right:auto; margin-top: 10px;"
        @click.prevent="confirmaGuardar"
      >
        Aceptar
      </v-btn>
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
            {text: 'Liga', value: 'IdLiga', sortable: true, width: '150px', type: 'combo'},
            {text: 'IdTipoSancion', value: 'IdTipoSancion', sortable: false, width: '50px', type: 'number'},
            {text: 'Clave', value: 'Clave', sortable: false, width: '50px', type: 'text'},
            {text: 'Descripcion', value: 'Descripcion', sortable: false, width: '250px', type: 'text'},
            {text: 'Juegos', value: 'JuegosSuspension', sortable: false, width: '150px', type: 'number'},
            {text: 'Baja', value: 'CausaBaja', sortable: false, width: '50px', type: 'check'},
            {text: 'Activo', value: 'Activa', sortable: false, width: '50px', type: 'check'}
          ],
          gridCombo: [{name: 'IdLiga', data: 'getLigas', default: 1}],
          gridData: 'TipoSancion'
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
      habilitaGuardar() {
        if(this.Nombre && this.Idliga) return false;
        else return true;
      }
    },
    methods: {
      async guardarTipoSancion() {
        const data = await this.$store.dispatch('postGuardarTipoSancion', {
          IdLiga: this.IdLiga,
          Nombre: this.Nombre
        });
        this.esGuardado = data === 1 ? true : false;
      },
      confirmaGuardar(){
        this.$refs.forma.reset();
        this.esGuardado = false;
      }
    },
    async mounted() {
      await this.$store.dispatch('getLigas');
    }
  }
</script>
