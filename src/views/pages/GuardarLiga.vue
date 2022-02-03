<template>
  <span>
    <v-card
      flat
      class="pa-3 mt-2"
       v-show="!esGuardado"
    >
      <v-card-text>
        <v-form class="multi-col-validation mt-6">
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
              md="6"
              cols="12"
            >
              <v-text-field
                :color="color"
                v-model="Representante"
                :rules="[() => !!Representante || valMsg]"
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
                :color="color"
                v-model="Telefono"
                :rules="[() => !!Telefono || valMsg]"
                label="Telefono"
                type="number"
                dense
                outlined
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                :color="color"
                ref="Correo"
                v-model="Correo"
                :rules="[() => !!Correo || valMsg]"
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
                :color="color"
                v-model="idPais"
                :rules="[() => !!idPais || valMsg]"
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
                :color="color"
                v-model="idEstado"
                :rules="[() => !!idEstado || valMsg]"
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
              <v-select
                :color="color"
                v-model="idMunicipio"
                :rules="[() => !!idMunicipio || valMsg]"
                dense
                outlined
                label="Municipio"
                :items="municipios"
                item-text="NombreMunicipio"
                item-value="IdMunicipio"
              ></v-select>
            </v-col>

            <v-col cols="12">
              <v-btn
                :color="color"
                class="me-3 mt-4"
                :disabled="habilitaGuardar"
                @click.prevent="guardaLiga"
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
        La liga fue registrada correctamente.
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
          esGuardado: false,
          valMsg: 'Este campo es requerido',
          Nombre: null,
          Representante: null,
          Telefono: null,
          Correo: null,
          idPais: null,
          idEstado: null,
          idMunicipio: null,
          color: '#03A9F4',
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
          if(item.IdEstado === this.idEstado) dataArr.push(item);
        }
        return dataArr;
      },
      habilitaGuardar() {
        if(this.Nombre && this.Representante && this.Telefono && this.Correo && this.idPais && this.idEstado && this.idMunicipio) return false;
        else return true;
      }
    },
    methods: {
      async guardaLiga() {
        const data = await this.$store.dispatch('postGuardaLiga', {
          Nombre: this.Nombre,
          Representante: this.Representante,
          Telefono: this.Telefono,
          Correo: this.Correo,
          idPais: this.idPais,
          idEstado: this.idEstado,
          idMunicipio: this.idMunicipio
        });
        this.esGuardado = data === 1 ? true : false;
      },
      confirmaGuardar(){
        this.esGuardado = false;
          this.Nombre = null;
          this.Representante = null;
          this.Telefono = null;
          this.Correo = null;
          this.idPais = null;
          this.idEstado = null;
          this.idMunicipio = null;
      }
    },
    async mounted() {
      await this.$store.dispatch('getPaises');
      await this.$store.dispatch('getEstados');
      await this.$store.dispatch('getMunicipios');
    }
  }
</script>
