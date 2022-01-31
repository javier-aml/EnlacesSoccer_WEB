<template>
  <v-card
    flat
    class="pa-3 mt-2"
  >
    <v-card-text>
      <v-form class="multi-col-validation mt-6">
        <v-row>
          <v-col
            md="6"
            cols="12"
          >
            <v-text-field
              v-model="ligaData.Nombre"
              label="Nombre"
              dense
              outlined
            ></v-text-field>
          </v-col>

          <v-col
            md="6"
            cols="12"
          >
            <v-text-field
              v-model="ligaData.Representante"
              label="Representante"
              dense
              outlined
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="ligaData.Telefono"
              label="Telefono"
              dense
              outlined
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="ligaData.Correo"
              dense
              label="Correo"
              outlined
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-select
              v-model="idPais"
              dense
              outlined
              label="País"
              :items="paises"
              item-text="NombrePais"
              item-value="IdPais"
            ></v-select>
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-select
              v-model="idEstado"
              dense
              outlined
              label="Estado"
              :items="estados"
              item-text="NombreEstado"
              item-value="IdEstado"
            ></v-select>
          </v-col>
          
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="ligaData.Municipio"
              dense
              outlined
              label="Municipio"
            ></v-text-field>

          </v-col>

          <v-col cols="12">
            <v-btn
              color="primary"
              class="me-3 mt-4"
            >
              Guardar
            </v-btn>
            <v-btn
              color="secondary"
              outlined
              class="mt-4"
              type="reset"
              @click.prevent="resetForm"
            >
              Cancelar
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    data() {
      return{
          idPais: null,
          idEstado: null,
          ligaData: {
            Nombre: null,
            Representante: null,
            Telefono: null,
            Correo: null
          }
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
      }
    },
    async mounted() {
      await this.$store.dispatch("getPaises")
      await this.$store.dispatch("getEstados")
    }
  }
</script>
