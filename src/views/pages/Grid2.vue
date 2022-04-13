<template>
    <v-data-table 
        :items="isFiltered ? itemsFilter : items"  
        :search="search" 
        class="elevation-1" 
        height="450px"
        :mobile-breakpoint='null'
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
                                        <v-icon small :disabled="isFilteredIcon(header.filter) ? false : true">mdi-filter</v-icon>
                                    </v-btn>
                                </template>
                                <div style="background-color: white; width: 280px">
                                    <v-text-field
                                        v-if="header.type === 'text'"
                                        class="pa-4"
                                        :label="`${header.text} :`"
                                        :autofocus="true"
                                        :value="header.filter"
                                        @input="onFilter($event, header.value)"
                                    ></v-text-field>
                                    <v-text-field
                                        v-if="header.type === 'email'"
                                        class="pa-4"
                                        :label="`${header.text} :`"
                                        :autofocus="true"
                                        :value="header.filter"
                                        @input="onFilter($event, header.value)"
                                    ></v-text-field>
                                    <span
                                        v-if="header.type === 'date'"
                                    >
                                        <v-menu
                                            :close-on-content-click="false"
                                            transition="scale-transition"
                                            offset-y
                                        >
                                            <template v-slot:activator="{on}">
                                                <v-text-field
                                                    :value="header.filter.from"
                                                    label="De :"
                                                    readonly
                                                    v-on="on"
                                                    class="pa-4"
                                                >
                                                </v-text-field>
                                            </template>
                                            <v-date-picker
                                                locale="es-mx"
                                                v-model="header.filter.from"
                                                @change="onFilter($event, header.value)"
                                            >
                                            </v-date-picker>
                                        </v-menu>
                                        <v-menu
                                            :close-on-content-click="false"
                                            transition="scale-transition"
                                            offset-y
                                        >
                                            <template v-slot:activator="{on}">
                                                <v-text-field
                                                    :value="header.filter.to"
                                                    label="A :"
                                                    readonly
                                                    v-on="on"
                                                    class="pa-4"
                                                    style="margin-top: -30px;"
                                                >
                                                </v-text-field>
                                            </template>
                                            <v-date-picker
                                                locale="es-mx"
                                                v-model="header.filter.to"
                                                @change="onFilter($event, header.value)"
                                            >
                                            </v-date-picker>
                                        </v-menu>
                                    </span>
                                    <v-text-field-simplemask
                                        v-if="header.type === 'telephone'"
                                        class="pa-4"
                                        :label="`${header.text} :`"
                                        :autofocus="true"
                                        v-model="header.filter"
                                        @input="onFilter($event, header.value)"
                                        :options="{
                                            inputMask: '(###) #######',
                                            outputMask: '##########',
                                            empty: null,
                                            applyAfter: false,
                                            alphanumeric: false,
                                            lowerCase: false,
                                        }"
                                    ></v-text-field-simplemask>
                                    <v-select
                                        v-else-if="header.type === 'combo'"
                                        :items="combos[header.value]"
                                        :value="header.filter"
                                        item-text="Nom"
                                        item-value="Id"
                                        class="pa-4"
                                        :label="`${header.text} :`"
                                        :autofocus="true"
                                        @change="onFilter($event, header.value)"
                                    ></v-select>
                                    <v-checkbox
                                        v-else-if="header.type === 'check'"
                                        class="pa-4"
                                        :label="`${header.text}`"
                                        :autofocus="true"
                                        @change="onFilter($event, header.value)"
                                    ></v-checkbox>                                   
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
                            icon
                            @click.prevent="mobileFilterToggle"
                        >
                            <v-icon small>mdi-filter</v-icon>
                        </v-btn>
                    </th>
                </tr>
            </thead>
        </template>
        <template #item="{item}">
            <transition 
                appear
                name="fade"
            >
                <tr v-if="isMobile() && item.id <= 1 && mobileFilter">
                    <td
                        class="v-data-table__mobile-row"
                        v-for="header in headers" 
                        :key="header.id"
                        style="background: #dcdcdc"
                    >
                        <div 
                            class="v-data-table__mobile-row__header"
                        >
                            {{header.type !== 'delete' ? header.text: ''}}
                        </div>
                        <div 
                            class="v-data-table__mobile-row__cell" 
                            style="float:rigth"
                        >
                            <v-checkbox
                                v-if="header.type === 'check'"
                                style="max-width: 150px"
                            ></v-checkbox>
                            <v-text-field
                                v-else-if="header.type === 'text'"
                                dense single-line
                                style="max-width: 150px"
                            >
                            </v-text-field>
                            <v-text-field-simplemask
                                v-if="header.type === 'telephone'"
                                v-model="header.filter"
                                :options="{
                                    inputMask: '(###) #######',
                                    outputMask: '##########',
                                    empty: null,
                                    applyAfter: false,
                                    alphanumeric: false,
                                    lowerCase: false,
                                }"
                                style="max-width: 150px"
                            ></v-text-field-simplemask>
                            <v-text-field
                                v-else-if="header.type === 'email'"
                                dense single-line
                                style="max-width: 150px"
                            >
                            </v-text-field>
                            <span
                                v-else-if="header.type === 'date'"
                            >
                                <v-text-field
                                    :label="`De :`"
                                    type="date"
                                    style="max-width: 150px"
                                ></v-text-field>
                                <v-text-field
                                    :label="`A :`"
                                    type="date"
                                    style="max-width: 150px"
                                ></v-text-field>
                            </span>
                            <v-select
                                v-else-if="header.type === 'combo'"
                                :items="combos[header.value]"
                                :value="1"
                                item-text="Nom"
                                item-value="Id"
                                style="max-width: 150px"
                            ></v-select>
                            <span
                                v-else-if="header.type === 'delete'"
                            >
                                <v-btn
                                    depressed
                                    color="primary"
                                    style="margin-bottom: 10px;"
                                >
                                    Limpiar
                                </v-btn>                            
                                <v-btn
                                    depressed
                                    color="primary"
                                    style="margin-bottom: 10px; margin-left: 10px;"
                                >
                                    Filtrar
                                </v-btn>
                            </span>
                        </div>
                    </td>                
                </tr>
            </transition>
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
                        :maxlength="textFieldMaxLen"
                        :error="isValid(dataType(cell), item[cell])"
                    >
                    </v-text-field>
                    <simple-mask
                        :value="item[cell]"
                        :ref="cell"
                        v-else-if="edited(item,cell) && dataType(cell) === 'telephone'"
                        dense single-line
                        @input="onChangeCell($event, item.id, cell)"
                        :options="{
                            inputMask: '(###) #######',
                            outputMask: '##########',
                            empty: null,
                            applyAfter: false,
                            alphanumeric: false,
                            lowerCase: false,
                            error: isValid(dataType(cell), item[cell])
                        }"
                    >
                    </simple-mask>
                    <v-text-field
                        @input="onChangeCell($event, item.id, cell)"
                        :value="item[cell]"
                        v-else-if="edited(item,cell) && dataType(cell) === 'email'"
                        dense single-line
                        :maxlength="emailFieldMaxLen"
                        :error="isValid(dataType(cell), item[cell])"
                    >
                    </v-text-field>
                    <v-menu
                        v-else-if="edited(item,cell) && dataType(cell) === 'date'"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                    >
                        <template v-slot:activator="{on}">
                            <v-text-field
                                :value="item[cell]"
                                readonly
                                v-on="on"
                                :error="isValid(dataType(cell), item[cell])"
                            >
                            </v-text-field>
                        </template>
                        <v-date-picker
                            locale="es-mx"
                            no-title
                            :value="item[cell]"
                            @change="onChangeCell($event, item.id, cell)"
                        >
                        </v-date-picker>
                    </v-menu>
                    <v-select
                        @change="onChangeCell($event, item.id, cell)"
                        v-else-if="edited(item,cell) && dataType(cell) === 'combo'"
                        :items="combos[cell]"
                        :value="item[cell]"
                        item-text="Nom"
                        item-value="Id"
                        :error="isValid(dataType(cell), item[cell])"
                    ></v-select>
                    <span
                        v-else
                        @click="onEditRow($event, item.id, cell)"
                    >
                        {{cellData(cell, item[cell], dataType(cell))}}
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
                        <v-text-field-simplemask
                            :value="item[cell]"
                            :ref="cell"
                            v-else-if="edited(item,cell) && dataType(cell) === 'telephone'"
                            dense single-line
                            @input="onChangeCell($event, item.id, cell)"
                            :options="{
                                inputMask: '(###) #######',
                                outputMask: '##########',
                                empty: null,
                                applyAfter: false,
                                alphanumeric: false,
                                lowerCase: false,
                            }"
                        >
                        </v-text-field-simplemask>
                        <v-text-field
                            @change="onChangeCell($event, item.id, cell)"
                            :value="item[cell]"
                            v-else-if="edited(item,cell) && dataType(cell) === 'email'"
                            dense single-line
                            style="max-width: 150px"
                        >
                        </v-text-field>
                        <v-text-field
                            @change="onChangeCell($event, item.id, cell)"
                            :value="item[cell]"
                            v-else-if="edited(item,cell) && dataType(cell) === 'date'"
                            dense single-line
                            type="date"
                            style="max-width: 150px"
                        >
                        </v-text-field>
                        <v-select
                            @change="onChangeCell($event, item.id, cell)"
                            v-else-if="edited(item,cell) && dataType(cell) === 'combo'"
                            :items="combos[cell]"
                            :value="item[cell]"
                            item-text="Nom"
                            item-value="Id"
                            style="max-width: 150px"
                        ></v-select>
                        <span
                            v-else
                            @click="onEditRow($event, item.id, cell)"
                            style="max-width: 150px"
                        >
                            {{cellData(cell, item[cell], dataType(cell))}}
                        </span>
                    </div>
                </td>
                <hr>
            </tr>
        </template>
    </v-data-table>
</template>
<script>
    import SimpleMask from '../../components/SimpleMask.vue'
    export default{
        components: {
            SimpleMask
        },
        data: () => ({
            headers: [
                {text: 'Nombre', value: 'nombre', sortable: true, width: '150px', type: 'text', filter: null},
                {text: 'Telefono', value: 'telefono', sortable: false, width: '150px', type: 'telephone', filter: null},
                {text: 'E-Mail', value: 'correo', sortable: false, width: '150px', type: 'email', filter: null},
                {text: 'Fecha', value: 'fecha', sortable: false, width: '150px', type: 'date', filter: {from: null, to: null}},
                {text: 'Pais', value: 'pais', sortable: true, width: '150px', type: 'combo', filter: null},
                {text: 'Valido', value: 'valido', sortable: false, width: '150px', type: 'check', filter: null},
                {text: 'Eliminar', value: 'eliminar', sortable: false, width: '150px', type: 'delete', filter: null}
            ],
            items: [
                {id: 1, nombre: 'Javier', telefono: 4612347082, correo: 'javier_aml@outlook.com', fecha: '2022-03-21', pais: 1, valido: false, eliminar: false, edit: []},
                {id: 2, nombre: 'Diego', telefono: 6121184026, correo: 'diego_aml@outlook.com', fecha: '2022-03-21', pais: 2, valido: false, eliminar: false, edit: []}
            ],
            itemsFilter: [],
            combos: {
                pais: [
                    {Id: 1, Nom: 'Mexico'},
                    {Id: 2, Nom: 'EUA'},
                ]},
            search: '',
            itemsEdit: [],
            mobileFilter: false,
            textFieldMaxLen:50,
            emailFieldMaxLen:50,
            telephoneFieldLen: 10
        }),
        methods: {
            onChangeCell(val, rowId, cell){
                //if(!val && this.dataType(cell) !== 'check') return;
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
                if(!val) this.clearFilter(val, col);
                const index = this.headers.findIndex(item => item.value === col);
                const header = this.headers[index];
                const dataType = this.headers[index].type;
                if(dataType === 'combo'){
                    this.headers[index].filter = val;
                    this.itemsFilter = this.items.filter(item => item[col] === val);
                }else if (dataType === 'date'){
                    const dateFilter = (filter, val) => {
                        if(header.filter.hasOwnProperty('from') && header.filter.hasOwnProperty('to')){
                            if(!header.filter.from || !header.filter.to) return true;
                            else if(new Date(header.filter.from) <= new Date(filter) && new Date(filter) <= new Date(header.filter.to)) return true;
                            else return false;
                        } 
                        else return false;
                    }
                    this.itemsFilter = this.items.filter(item => dateFilter(item[col], val));
                }else{
                    this.headers[index].filter = val;
                    this.itemsFilter = this.items.filter(item => (item[col] + '').toLowerCase().includes((val + '').toLowerCase()));
                }
            },
            clearFilter(val, col){
                const index = this.headers.findIndex(item => item.value === col);
                if(this.headers[index].type === 'date'){
                    this.headers[index].filter.from = '';
                    this.headers[index].filter.to = '';
                }
                else this.headers[index].filter = '';
                this.itemsFilter = [];
            },
            isMobile(){
                return window.innerWidth < 600 ? true : false;
            },
            mobileFilterToggle(){
                this.mobileFilter = !this.mobileFilter
            },
            cellData(cell, value, dataType){
                if(dataType === 'combo'){
                    return this.combos[cell][this.combos[cell].findIndex(item => item.Id === value)].Nom;
                }else if(dataType === 'telephone'){
                    return '(' + (value + '').substring(0,3) + ') ' + (value + '').substring(3,value.length);
                }
                else{
                    return value;
                }
            },
            isFilteredIcon(filter){
                if(filter){
                    if(typeof filter === 'object')
                        if(filter.hasOwnProperty('from') && filter.hasOwnProperty('to'))
                            if(filter.from && filter.to) return true;
                            else return false;
                        else return true;
                    else return true;
                }else return false;                
            },
            isValid(type, val){
                if(type === 'telephone' && val.length < this.telephoneFieldLen) return true;
                else if(!val) return true;
                else return false;
            }
        },
        computed: {
            isFiltered(){
                const isFiltered = filter => {
                    if(filter){
                        if(typeof filter === 'object')
                            if(filter.hasOwnProperty('from')) return filter.from ? true : false;
                            else if(filter.hasOwnProperty('to')) return filter.to ? true : false;
                            else return true;
                        else return true;
                    }else return false;
                }
                return this.headers.some(item => isFiltered(item.filter));
            }
        }
    }
</script>
<style scoped>
    td[cell-name="id"], td[cell-name="edit"]{
        display: none;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to{
        opacity: 0;
    }      
</style>
