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
              :key-prop="gridKey"
              ></Grid>
            </v-col>

            <v-col cols="12">
              <v-btn
                :color="color"
                class="me-3 mt-4"
                :disabled="habilitaGuardar"
                @click.prevent="guardaEquipo"
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
        El equipo fue registrado correctamente.
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
            {text: 'Liga', value: 'IdLiga', sortable: true, width: '150px', type: 'combo', editable: false},
            {text: 'Torneo', value: 'IdTorneo', sortable: true, width: '150px', type: 'combo', editable: false},
            {text: 'IdEquipo', value: 'IdEquipo', sortable: false, width: '150px', type: 'number', editable: false},
            {text: 'Nombre', value: 'Nombre', sortable: false, width: '150px', type: 'text', editable: true},
            {text: 'Activo', value: 'Activo', sortable: false, width: '150px', type: 'check', editable: true},
            {text: 'Jugadores', value: 'Jugadores', sortable: false, width: '150px', type: 'link', editable: true}
          ],
          gridCombo: [{name: 'IdLiga', data: 'getLigas', default: 1}],
          gridCombo: [{name: 'IdTorneo', data: 'getTorneos', default: 1}],
          gridData: 'BuscarEquipos',
          gridKey: 'IdEquipo'
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
        const data = this.$store.state.torneos;
        const dataArr = [];
        for(let item of data){
          dataArr.push(item);
        }
        return dataArr;
      },
      habilitaGuardar() {
        if(this.Nombre && this.Idliga && this.IdTorneo) return false;
        else return true;
      }
    },
    methods: {
      async guardarEquipo() {
        const data = await this.$store.dispatch('postGuardarEquipo', {
          IdLiga: this.IdLiga,
          IdTorneo: this.IdTorneo,
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
    },
    async mounted() {
      await this.$store.dispatch('getTorneos');
    }
  }
</script>
