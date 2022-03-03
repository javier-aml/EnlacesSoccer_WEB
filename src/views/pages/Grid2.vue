<template>
    <v-data-table 
        :headers="headers" 
        :items="items" 
        :search="search" 
        class="elevation-1" 
        fixed-header 
        height="350px"
    >
        <template #item="{item}">
            <tr>
                <td 
                    v-for="cell in Object.keys(item)" 
                    :key="cell.id" :cell-name="cell" 
                    :cell-id="item.id"
                    :width="colWidth(cell)"
                >
                    <v-checkbox
                        @change="onChangeCell($event, item.id, cell)"
                        v-if="dataType(cell) === 'delete'"
                    ></v-checkbox>
                    <v-checkbox
                        @change="onChangeCell($event, item.id, cell)"
                        v-else-if="dataType(cell) === 'check'"
                    ></v-checkbox>
                    <v-text-field
                        @change="onChangeCell($event, item.id, cell)"
                        :value="item[cell]"
                        v-else-if="edited(item,cell) && dataType(cell) === 'text'"
                        dense single-line
                    >
                    </v-text-field>
                    <v-select
                        @change="onChangeCell($event, item.id, cell)"
                        v-else-if="edited(item,cell) && dataType(cell) === 'combo'"
                        :items="combos[cell]"
                        item-text="Nom"
                        item-value="Id"
                    ></v-select>
                    <span
                        v-else
                        @click="onEditRow($event, item.id, cell)"
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
                {text: 'Nombre', value: 'nombre', sortable: true, width: '150px', type: 'text'},
                {text: 'Apellido', value: 'apellido', sortable: true, width: '150px', type: 'text'},
                {text: 'Telefono', value: 'telefono', sortable: false, width: '150px', type: 'text'},
                {text: 'Pais', value: 'pais', sortable: true, width: '150px', type: 'combo'},
                {text: 'Valido', value: 'valido', sortable: false, width: '150px', type: 'check'},
                {text: 'Eliminar', value: 'eliminar', sortable: false, width: '150px', type: 'delete'}
            ],
            items: [
                {id: 1, nombre: 'Javier', apellido: 'Arredondo', telefono: 4612347082, pais: 'Mexico', valido: false, eliminar: false, edit: []},
                {id: 2, nombre: 'Diego', apellido: 'Arredondo', telefono: 6121184026, pais: 'EUA', valido: false, eliminar: false, edit: []}
            ],
            combos: {
                pais: [
                    {Id: 1, Nom: 'Mexico'},
                    {Id: 2, Nom: 'EUA'},
                ]},
            search: '',
            itemsEdit: []
        }),
        methods: {
            onChangeCell(val, rowId, cell){
                const index = this.itemsEdit.findIndex(item => item.id === rowId);
                if(index !== -1) this.itemsEdit[index][cell] = val;
                else{
                    const row = this.items.find(item => item.id === rowId);
                    row[cell] = val;
                    this.itemsEdit.push(row);
                }
                console.log(this.itemsEdit);
            },
            onEditRow(event, rowId, cell){
                const index = this.items.findIndex(item => item.id === rowId);
                if(!this.items[index].edit.includes(cell)) this.items[index].edit.push(cell);
            },
            colWidth(cell){
                const index = this.headers.findIndex(item => item.value === cell);
                return this.headers[index] ? this.headers[index].width : '';
            },
            dataType(cell){
                const index = this.headers.findIndex(item => item.value === cell);
                return this.headers[index] ? this.headers[index].type : '';
            },
            edited(item, cell){
                return item.edit.includes(cell);
            }
        }
    }
</script>
<style scoped>
    td[cell-name="id"], td[cell-name="edit"]{
        display: none;
    }
</style>
