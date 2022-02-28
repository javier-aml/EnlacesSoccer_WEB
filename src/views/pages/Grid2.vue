<template>
    <v-data-table 
        :headers="headers" 
        :items="items" 
        :search="search" 
        class="elevation-1" 
        fixed-header 
        height="350px"
    >
        <template v-slot:item={item}>
            <tr>
                <td 
                    v-for="cell in Object.keys(item)" 
                    :key="cell.id" :cell-name="cell" 
                    :cell-id="item.id"
                >
                    <v-text-field
                        @change="changeCell($event, item.id, cell)"
                        :value="item[cell]"
                        v-if="editable && item.id === editId"
                        dense single-line
                    >
                    </v-text-field>
                    <span
                        v-else 
                        @click="editRow($event, item.id)"
                    >
                        {{item[cell]}}
                    </span>
                </td>
            </tr>
        </template>
    </v-data-table>
</template>
<script>
    export default{
        data: () => ({
            headers: [
                {text: 'Nombre', value: 'nombre', sortable: true},
                {text: 'Apellido', value: 'apellido', sortable: true},
                {text: 'Telefono', value: 'telefono', sortable: false}
            ],
            items: [
                {id: 1, nombre: 'Javier', apellido: 'Arredondo', telefono: 4612347082},
                {id: 2, nombre: 'Diego', apellido: 'Arredondo', telefono: 6121184026}
            ],
            search: '',
            editable: false,
            editId: null,
            itemsEdit: []
        }),
        methods: {
            changeCell: function(val, rowId, cell){
                const row = {...this.items.find(item => item.id = rowId)};
                items[cell] = val;
                row[cell] = val;
                this.itemsEdit.push(row);
                console.log(this.itemsEdit);
            },
            editRow: function(event, rowId){
                this.editable = true;
                this.editId = rowId;
            }
        }
    }
</script>
<style scoped>
    td[cell-name="id"]{
        display: none;
    }
</style>
