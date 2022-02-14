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
          v-model="valid"
          class="multi-col-validation mt-6"
        >
          <v-row>
            <v-col
              md="6"
              cols="12"
            >
              <v-text-field
                :color="color"
                v-model="Nombre"
                :rules="[() => !!Nombre || valMsg]"
                label="Nombre"
                dense
                outlined
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-select
                :color="color"
                v-model="idLiga"
                :rules="[() => !!idLiga || valMsg]"
                dense
                outlined
                label="Liga"
                :items="ligas"
                item-text="Nombre"
                item-value="idLiga"
              ></v-select>
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
  export default {
    data() {
      return{
          habilitaGuardar: false,
          esGuardado: false,
          valMsg: 'Este campo es requerido',
          Nombre: null,
          Idliga: null,
          color: '#03A9F4',
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
      async guardarEquipo() {
        const data = await this.$store.dispatch('postGuardarEquipo', {
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
