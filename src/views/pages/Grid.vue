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
                {text: 'Telefono', value: 'telefono', sortable: false, width: '150px', type: 'telephone'},
                {text: 'E-Mail', value: 'correo', sortable: false, width: '150px', type: 'email'},
                {text: 'Fecha', value: 'fecha', sortable: false, width: '150px', type: 'date'},
                {text: 'Pais', value: 'pais', sortable: true, width: '150px', type: 'combo'},
                {text: 'Valido', value: 'valido', sortable: false, width: '110px', type: 'check'},
                {text: 'Eliminar', value: 'eliminar', sortable: false, width: '50px', type: 'delete'}
            ],
            gridCombo: [{name: 'pais', data: 'getPaises', default: 1}],
            gridData: ''      
        })
    }
</script>
<style scoped>
</style>
