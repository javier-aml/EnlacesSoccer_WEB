<template>
    <span>
        <p>GRID</p>
        <vgrid
            :header-prop="gridHeader"
            :data-prop="gridData"
            :combo-prop="gridCombo"
        ></vgrid>
    </span>
</template>
<script>
    import { onBeforeMount } from '@vue/composition-api';
import vgrid from '../../components/Grid.vue';
    export default{
        components: {vgrid},
        data: () => ({
            gridHeader: [
                {text: 'Nombre', value: 'nombre', sortable: true, width: '150px', type: 'text'},
                {text: 'Numero', value: 'numero', sortable: true, width: '150px', type: 'number'},
                {text: 'Telefono', value: 'telefono', sortable: false, width: '150px', type: 'telephone'},
                {text: 'E-Mail', value: 'correo', sortable: false, width: '150px', type: 'email'},
                {text: 'Fecha', value: 'fecha', sortable: false, width: '150px', type: 'date'},
                {text: 'Pais', value: 'IdPais', sortable: true, width: '150px', type: 'combo'},
                {text: 'Valido', value: 'valido', sortable: false, width: '110px', type: 'check'},
                {text: 'Link', value: 'link', sortable: false, width: '110px', type: 'link'},
                {text: 'Eliminar', value: 'eliminar', sortable: false, width: '50px', type: 'delete'}
            ],
            gridCombo: [{name: 'IdPais', data: 'getPaises', default: 1}],
            gridData: 'GridPrueba'      
        })
    }
</script>
<style scoped>
#link:hover {cursor: pointer;}
</style>
