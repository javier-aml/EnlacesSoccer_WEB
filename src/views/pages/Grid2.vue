<template>
    <v-data-table 
        :items="isFiltered ? itemsFilter : items" 
        :search="search" 
        class="elevation-1" 
        height="350px"
        :mobile-breakpoint='NaN'
    >
        <template #header :headers="headers">
            <thead v-if="!isMobile()">
                <tr>
                    <th
                        v-for="header in headers" 
                        :key="header.value"
                    >
                        <span>
                            <v-menu offset-y :close-on-content-click="false">
                                <template v-slot:activator="{on, attrs}">
                                    {{header.text}}
                                    <v-btn 
                                        icon v-bind="attrs" 
                                        v-on="on"
                                        v-if="header.value !== 'eliminar'"
                                    >
                                        <v-icon small :disabled="header.filter ? false : true">mdi-filter</v-icon>
                                    </v-btn>
                                </template>
                                <div style="background-color: white; width: 280px">
                                    <v-text-field
                                        class="pa-4"
                                        :label="`Filtrar por ${header.text} :`"
                                        :autofocus="true"
                                        :value="header.filter"
                                        @change="onFilter($event, header.value)"
                                    ></v-text-field>
                                    <v-btn
                                        small
                                        text
                                        color="primary"
                                        class="ml-2 mb-2"
                                        @click="clearFilter($event, header.value)"
                                    >Limpiar</v-btn>
                                </div>
                            </v-menu>
                        </span>
                    </th>
                </tr>
            </thead>
            <thead v-else>
                <tr>
                    <th>
                        Filtros
                        <v-btn 
                            icon v-bind="attrs" 
                            v-on="on"
                        >
                            <v-icon small>mdi-filter</v-icon>
                        </v-btn>
                    </th>
                </tr>
            </thead>
        </template>
        <template #item="{item}">
            <tr v-if="!isMobile()">
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
                        :value="1"
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
            <tr v-else>
                <td 
                    class="v-data-table__mobile-row"
                    v-for="cell in Object.keys(item)" 
                    :key="cell.id" :cell-name="cell" 
                    :cell-id="item.id"
                >
                    <div class="v-data-table__mobile-row__header">
                        {{headerText(cell)}}
                    </div>
                    <div class="v-data-table__mobile-row__cell" style="float:rigth">
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
                            style="max-width: 150px"
                        >
                        </v-text-field>
                        <v-select
                            @change="onChangeCell($event, item.id, cell)"
                            v-else-if="edited(item,cell) && dataType(cell) === 'combo'"
                            :items="combos[cell]"
                            :value="1"
                            item-text="Nom"
                            item-value="Id"
                            style="max-width: 150px"
                        ></v-select>
                        <span
                            v-else
                            @click="onEditRow($event, item.id, cell)"
                            style="max-width: 150px"
                        >
                            {{item[cell]}}
                        </span>
                    </div>
                </td>
                <hr>
            </tr>
        </template>
    </v-data-table>
</template>
<script>
    export default{
        data: () => ({
            headers: [
                {text: 'Nombre', value: 'nombre', sortable: true, width: '150px', type: 'text', filter: ''},
                {text: 'Apellido', value: 'apellido', sortable: true, width: '150px', type: 'text', filter: ''},
                {text: 'Telefono', value: 'telefono', sortable: false, width: '150px', type: 'text', filter: ''},
                {text: 'Pais', value: 'pais', sortable: true, width: '150px', type: 'combo', filter: ''},
                {text: 'Valido', value: 'valido', sortable: false, width: '150px', type: 'check', filter: ''},
                {text: 'Eliminar', value: 'eliminar', sortable: false, width: '150px', type: 'delete', filter: ''}
            ],
            items: [
                {id: 1, nombre: 'Javier', apellido: 'Arredondo', telefono: 4612347082, pais: 'Mexico', valido: false, eliminar: false, edit: []},
                {id: 2, nombre: 'Diego', apellido: 'Arredondo', telefono: 6121184026, pais: 'EUA', valido: false, eliminar: false, edit: []}
            ],
            itemsFilter: [],
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
            headerText(cell){
                const index = this.headers.findIndex(item => item.value === cell);
                return this.headers[index] ? this.headers[index].text : '';
            },
            edited(item, cell){
                return item.edit.includes(cell);
            },
            onFilter(val, col){
                const index = this.headers.findIndex(item => item.value === col);
                this.headers[index].filter = val;
                this.itemsFilter = [];
                this.itemsFilter = this.items.filter(item => item[col].includes(val));
            },
            clearFilter(val, col){
                const index = this.headers.findIndex(item => item.value === col);
                this.headers[index].filter = '';
                this.itemsFilter = [];
            },
            isMobile(){
                return window.innerWidth < 600 ? true : false;
            }
        },
        computed: {
            isFiltered(){
                return this.headers.some(item => item.filter);
            }
        }
    }
</script>
<style scoped>
    td[cell-name="id"], td[cell-name="edit"]{
        display: none;
    }
</style>
