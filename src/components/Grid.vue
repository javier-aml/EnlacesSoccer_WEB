<template>
  <v-data-table
    :items="isFiltered ? itemsFilter : items"
    :search="search"
    class="elevation-1"
    height="450px"
    :mobile-breakpoint="null"
    :footer-props="{'items-per-page-options':[15, 30, 50, 100, -1]}"
  >
    <template #header :headers="headers">
      <thead v-if="!isMobile()">
        <tr>
          <th v-for="header in headers.filter(header => header.visible !== false)" :key="header.value">
            <span>
              <v-menu offset-y :close-on-content-click="false">
                <template v-slot:activator="{ on, attrs }">
                  {{ header.text }}
                  <v-btn icon v-bind="attrs" @click.prevent="refresh" v-if="header.type === 'add'" :disabled="isReset">
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                  <v-btn icon v-bind="attrs" v-if="header.type === 'add'" @click.prevent="onSave">
                    <v-icon>mdi-content-save</v-icon>
                  </v-btn>
                  <v-btn icon v-bind="attrs" @click.prevent="addLine" v-if="header.type === 'add'">
                    <v-icon>mdi-plus-circle-outline</v-icon>
                  </v-btn>
                  <v-btn icon v-bind="attrs" v-on="on" v-else-if="header.type !== 'delete' && header.type !== 'link'">
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
                    v-if="header.type === 'number'"
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
                  <span v-if="header.type === 'date'">
                    <v-menu :close-on-content-click="false" transition="scale-transition" offset-y>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          :value="dateFormat(header.filter.from)"
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
                    <v-menu :close-on-content-click="false" transition="scale-transition" offset-y>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          :value="dateFormat(header.filter.to)"
                          label="A :"
                          readonly
                          v-on="on"
                          class="pa-4"
                          style="margin-top: -30px;"
                        >
                        </v-text-field>
                      </template>
                      <v-date-picker locale="es-mx" v-model="header.filter.to" @change="onFilter($event, header.value)">
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
                  <v-btn small text color="primary" class="ml-2 mb-2" @click="clearFilter($event, header.value)"
                    >Limpiar</v-btn
                  >
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
            <v-btn icon @click.prevent="mobileFilterToggle">
              <v-icon small>mdi-filter</v-icon>
            </v-btn>
          </th>
        </tr>
      </thead>
    </template>
    <template #item="{item}">
      <transition appear name="fade">
        <tr v-if="isMobile() && item.id <= 1 && mobileFilter">
          <td
            class="v-data-table__mobile-row"
            v-for="header in headers.filter(header => header.visible)"
            :key="header.id"
            style="background: #dcdcdc"
          >
            <div class="v-data-table__mobile-row__header">
              {{ header.type !== 'delete' ? header.text : '' }}
            </div>
            <div class="v-data-table__mobile-row__cell" style="float:rigth">
              <v-checkbox v-if="header.type === 'check'" style="max-width: 150px"></v-checkbox>
              <v-text-field v-else-if="header.type === 'text'" dense single-line style="max-width: 150px">
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
              <v-text-field v-else-if="header.type === 'email'" dense single-line style="max-width: 150px">
              </v-text-field>
              <span v-else-if="header.type === 'date'">
                <v-text-field :label="`De :`" type="date" style="max-width: 150px"></v-text-field>
                <v-text-field :label="`A :`" type="date" style="max-width: 150px"></v-text-field>
              </span>
              <v-select
                v-else-if="header.type === 'combo'"
                :items="combos[header.value]"
                :value="1"
                item-text="Nom"
                item-value="Id"
                style="max-width: 150px"
              ></v-select>
              <span v-else-if="header.type === 'delete'">
                <v-btn depressed color="primary" style="margin-bottom: 10px;">
                  Limpiar
                </v-btn>
                <v-btn depressed color="primary" style="margin-bottom: 10px; margin-left: 10px;">
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
          :key="cell.id"
          :cell-name="cell"
          :cell-id="item.id"
          :width="colWidth(cell)"
        >
          <v-checkbox
            @change="onChangeCell($event, item, cell)"
            v-if="dataType(cell) === 'delete'"
            :disabled="item.id < 0"
          ></v-checkbox>
          <v-checkbox
            @change="onChangeCell($event, item, cell)"
            v-model="item[cell]"
            v-else-if="dataType(cell) === 'check'"
          ></v-checkbox>
          <v-text-field
            @input="onChangeCell($event, item, cell)"
            :value="item[cell]"
            v-else-if="edited(item, cell) && dataType(cell) === 'text'"
            dense
            single-line
            :maxlength="textFieldMaxLen"
            :error="isValid(dataType(cell), item[cell])"
            style="margin-top: 18px;"
          >
          </v-text-field>
          <v-text-field
            @input="onChangeCell($event, item, cell)"
            :value="item[cell]"
            v-else-if="edited(item, cell) && dataType(cell) === 'number'"
            dense
            single-line
            type="number"
            :maxlength="numberFieldMaxLen"
            :error="isValid(dataType(cell), item[cell])"
            style="margin-top: 18px;"
          >
          </v-text-field>
          <simple-mask
            :value="item[cell]"
            :ref="cell"
            v-else-if="edited(item, cell) && dataType(cell) === 'telephone'"
            dense
            single-line
            @input="onChangeCell($event, item, cell)"
            :options="{
              inputMask: '(###) #######',
              outputMask: '##########',
              empty: null,
              applyAfter: false,
              alphanumeric: false,
              lowerCase: false,
              error: isValid(dataType(cell), item[cell], cell, item.id),
            }"
          >
          </simple-mask>
          <v-text-field
            @input="onChangeCell($event, item, cell)"
            :value="item[cell]"
            v-else-if="edited(item, cell) && dataType(cell) === 'email'"
            dense
            single-line
            :maxlength="emailFieldMaxLen"
            :error="isValid(dataType(cell), item[cell])"
            style="margin-top: 18px;"
          >
          </v-text-field>
          <v-menu
            v-else-if="edited(item, cell) && dataType(cell) === 'date'"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                :value="dateFormat(item[cell])"
                readonly
                v-on="on"
                :error="isValid(dataType(cell), item[cell])"
              >
              </v-text-field>
            </template>
            <v-date-picker locale="es-mx" no-title :value="item[cell]" @change="onChangeCell($event, item, cell)">
            </v-date-picker>
          </v-menu>
          <v-select
            @change="onChangeCell($event, item, cell)"
            v-else-if="edited(item, cell) && dataType(cell) === 'combo'"
            :items="combos[cell]"
            :value="item[cell]"
            item-text="Nom"
            item-value="Id"
            :error="isValid(dataType(cell), item[cell])"
          ></v-select>
          <span
            v-else-if="dataType(cell) === 'link'"
            @click="onClickLink($event, cellData(cell, item[cell], dataType(cell), 2))"
            id="link"
          >
            {{ cellData(cell, item[cell], dataType(cell), 1) }}
          </span>
          <span 
            v-else-if="dataType(cell) !== 'index'"
            @click="onEditRow($event, item, cell)"
          >
            {{ cellData(cell, item[cell], dataType(cell)) }}
          </span>
        </td>
      </tr>
      <tr v-else>
        <td
          class="v-data-table__mobile-row"
          v-for="cell in Object.keys(item)"
          :key="cell.id"
          :cell-name="cell"
          :cell-id="item.id"
        >
          <div class="v-data-table__mobile-row__header">
            {{ headerText(cell) }}
          </div>
          <div class="v-data-table__mobile-row__cell" style="float:rigth">
            <v-checkbox @change="onChangeCell($event, item, cell)" v-if="dataType(cell) === 'delete'"></v-checkbox>
            <v-checkbox @change="onChangeCell($event, item, cell)" v-else-if="dataType(cell) === 'check'"></v-checkbox>
            <v-text-field
              @change="onChangeCell($event, item, cell)"
              :value="item[cell]"
              v-else-if="edited(item, cell) && dataType(cell) === 'text'"
              dense
              single-line
              style="max-width: 150px;"
            >
            </v-text-field>
            <v-text-field-simplemask
              :value="item[cell]"
              :ref="cell"
              v-else-if="edited(item, cell) && dataType(cell) === 'telephone'"
              dense
              single-line
              @input="onChangeCell($event, item, cell)"
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
              @change="onChangeCell($event, item, cell)"
              :value="item[cell]"
              v-else-if="edited(item, cell) && dataType(cell) === 'email'"
              dense
              single-line
              style="max-width: 150px;"
            >
            </v-text-field>
            <v-text-field
              @change="onChangeCell($event, item, cell)"
              :value="item[cell]"
              v-else-if="edited(item, cell) && dataType(cell) === 'date'"
              dense
              single-line
              type="date"
              style="max-width: 150px;"
            >
            </v-text-field>
            <v-select
              @change="onChangeCell($event, item, cell)"
              v-else-if="edited(item, cell) && dataType(cell) === 'combo'"
              :items="combos[cell]"
              :value="item[cell]"
              item-text="Nom"
              item-value="Id"
              style="max-width: 150px;"
            ></v-select>
            <span v-else @click="onEditRow($event, item, cell)" style="max-width: 150px;">
              {{ cellData(cell, item[cell], dataType(cell)) }}
            </span>
          </div>
        </td>
        <hr />
      </tr>
    </template>
  </v-data-table>
</template>
<script>
import SimpleMask from '../components/SimpleMask.vue'
import axios from 'axios'
export default {
  components: {
    SimpleMask,
  },
  props: ['headerProp', 'dataSelProp', 'dataUiProp', 'comboProp', 'keyProp'],
  data: () => ({
    headers: [],
    items: [],
    itemsData: [],
    itemsFilter: [],
    combos: {},
    search: '',
    itemsEdit: [],
    mobileFilter: false,
    textFieldMaxLen: 50,
    numberFieldMaxLen: 50,
    emailFieldMaxLen: 50,
    telephoneFieldLen: 10,
    isAddedData: false,
  }),
  methods: {
    onChangeCell($event, item, cell) { 
      const rowId = item.rowIndex;
      const index = this.itemsEdit.findIndex(item => item.rowIndex === rowId)
      if (index !== -1) this.itemsEdit[index][cell] = $event
      else {
        const row = this.items.find(item => item.rowIndex === rowId)
        row[cell] = $event
        this.itemsEdit.push(row)
      }
    },
    onEditRow($event, item, cell) {      
      if (this.keyProp.includes(cell)) return
      const rowId = item.rowIndex
      const index = this.items.findIndex(item => item.rowIndex === rowId)
      let headerIndex = this.headers.map(item => item.value).indexOf(cell)
      if (!this.headerProp[headerIndex].editable) return
      if (!this.items[index].edit.includes(cell)) this.items[index].edit.push(cell)
    },
    onClickLink($event, href) {
      window.open(href)
    },
    colWidth(cell) {
      const index = this.headers.findIndex(item => item.value === cell)
      return this.headers[index] ? this.headers[index].width : ''
    },
    dataType(cell) {
      const index = this.headers.findIndex(item => item.value === cell)
      return this.headers[index] ? this.headers[index].type : ''
    },
    headerText(cell) {
      const index = this.headers.findIndex(item => item.value === cell)
      return this.headers[index] ? this.headers[index].text : ''
    },
    edited(item, cell) {
      return item.edit.includes(cell)
    },
    onFilter(val, col) {
      if (!val) this.clearFilter(val, col)
      const index = this.headers.findIndex(item => item.value === col)
      const header = this.headers[index]
      const dataType = this.headers[index].type
      if (dataType === 'combo') {
        this.headers[index].filter = val
        this.itemsFilter = this.items.filter(item => item[col] === val)
      } else if (dataType === 'date') {
        const dateFilter = (filter, val) => {
          if (header.filter.hasOwnProperty('from') && header.filter.hasOwnProperty('to')) {
            if (!header.filter.from || !header.filter.to) return true
            else if (new Date(header.filter.from) <= new Date(filter) && new Date(filter) <= new Date(header.filter.to))
              return true
            else return false
          } else return false
        }
        this.itemsFilter = this.items.filter(item => dateFilter(item[col], val))
      } else if (dataType === 'check') {
        this.headers[index].filter = val
        this.itemsFilter = this.items.filter(item => item[col] === val)
      } else {
        this.headers[index].filter = val
        this.itemsFilter = this.items.filter(item => (item[col] + '').toLowerCase().includes((val + '').toLowerCase()))
      }
    },
    clearFilter(val, col) {
      const index = this.headers.findIndex(item => item.value === col)
      if (this.headers[index].type === 'date') {
        this.headers[index].filter.from = ''
        this.headers[index].filter.to = ''
      } else this.headers[index].filter = ''
      this.itemsFilter = []
    },
    isMobile() {
      return window.innerWidth < 600 ? true : false
    },
    mobileFilterToggle() {
      this.mobileFilter = !this.mobileFilter
    },
    cellData(cell, value, dataType, link) {
      if (!value) return '-'
      else if (dataType === 'combo') {
        if (!this.combos[cell]) return
        if (this.combos[cell][this.combos[cell].findIndex(item => item.Id === value)])
          return this.combos[cell][this.combos[cell].findIndex(item => item.Id === value)].Nom
        else return
      } else if (dataType === 'telephone') {
        return '(' + (value + '').substring(0, 3) + ') ' + (value + '').substring(3, value.length)
      } else if (dataType === 'date') return this.dateFormat(value)
      else if (dataType === 'link' && link === 1) return value.split('|')[0]
      else if (dataType === 'link' && link === 2) return value.split('|')[1]
      else return value
    },
    isFilteredIcon(filter) {
      if (filter) {
        if (typeof filter === 'object')
          if (filter.hasOwnProperty('from') && filter.hasOwnProperty('to'))
            if (filter.from && filter.to) return true
            else return false
          else return true
        else return true
      } else return false
    },
    isValid(type, val) {
      let result = false
      if (type === 'telephone') result = (val ? val.length : 0) < this.telephoneFieldLen ? true : false
      else if (type === 'email') {
        const email = (val + '').toLowerCase()
        const validEmail = !email.match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        )
        result = validEmail
      } else if (type === 'combo' && val === '-') result = true
      else if (!val) result = true
      return result
    },
    addLine() {
      let idIndex = this.items.sort((a, b) => {return a.id - b.id});
      idIndex = idIndex[0].id ? idIndex[0].id - 1 : -1;
      const emptyLine = { id: idIndex, edit: [] }
      for (let item of this.headers) {
        if (item.editable === false){  
          emptyLine[item.value] = ''
        }
        else if (item.type === 'text') {
          emptyLine[item.value] = ''
          emptyLine.edit.push(item.value)
        } else if (item.type === 'number') {
          emptyLine[item.value] = ''
          emptyLine.edit.push(item.value)
        } else if (item.type === 'telephone') {
          emptyLine[item.value] = '-'
          emptyLine.edit.push(item.value)
        } else if (item.type === 'email') {
          emptyLine[item.value] = ''
          emptyLine.edit.push(item.value)
        } else if (item.type === 'date') {
          emptyLine[item.value] = this.currentDate
          emptyLine.edit.push(item.value)
        } else if (item.type === 'combo') {
          emptyLine[item.value] = this.combos.hasOwnProperty(item.value) ? this.combos.defaults[item.value] : '-'
          emptyLine.edit.push(item.value)
        } else if (item.type === 'check') emptyLine[item.value] = false
        else if (item.type === 'link') emptyLine[item.value] = null
        else if (item.type === 'delete') emptyLine[item.value] = false
      }
      this.isAddedData = true
      emptyLine['rowIndex'] = '' + idIndex;
      this.items.unshift(emptyLine)
    },
    refresh() {
      this.items = this.itemsData.map(item => {
        return { ...item }
      })
      this.items.forEach(item => (item.edit = []))
      this.isAddedData = false
      this.itemsEdit = []
    },
    dateFormat(val) {
      if (!val) return null
      const valArr = val.trim().split('-')
      return valArr[2] + '/' + valArr[1] + '/' + valArr[0]
    },
    async onSave() {
      let gridData = this.itemsEdit.map(item => {
        const row = { ...item }
        const rowSave = {}
        delete row.edit
        delete row.rowIndex
        this.headerProp.forEach(header => {
          if (!header.ui) delete row[header.value]
          for (let key of Object.keys(row)) {
            if (key === header.value) {
              if (header.type === 'number') rowSave['pn' + key] = row[key] ? row[key] : "'" + row[key] + "'" 
              else if (header.type === 'combo') rowSave['pn' + key] = row[key]
              else if (header.type === 'text') rowSave['ps' + key] = "'" + row[key] + "'"
              else if (header.type === 'date') rowSave['pd' + key] = row[key]
              else if (header.type === 'check') rowSave['pn' + key] = row[key] ? 1 : 0
              else if (header.type === 'email') rowSave['ps' + key] = "'" + row[key] + "'"
              else if (header.type === 'telephone') rowSave['pn' + key] = row[key]
              else if (header.type === 'delete') rowSave['pn' + key] = row[key]
            }
          }
        })
        rowSave['pnAccion'] = item.id < 0 ? 1 : 2;
        return rowSave
      })
      gridData = JSON.stringify(gridData)
      this.itemsEdit = [];
      console.log(gridData) //IMPRIME DATOS A GUARDAR
      let apiReq = process.env.VUE_APP_API_URL + '/GuardarGrid'
      apiReq = await axios.post(
        apiReq,
        {
          data: {
            psSpUI: this.dataUiProp,
            psData: gridData,
          },
        },
        { 'Access-Control-Allow-Origin': '*' },
      )
      await this.parseData()
    },
    async parseData() {
      this.headers = []
      this.items = []
      this.itemsData = []
      for (let item of this.headerProp) {
        this.headers.push({
          text: item.text,
          value: item.value,
          sortable: false,
          width: item.width,
          type: item.type,
          editable: item.editable,
          ui: item.ui,
          visible: item.visible,
          filter: item.type === 'date' ? { from: null, to: null } : null,
        })
      }
      this.headers.push({
        text: 'Index',
        value: 'rowIndex',
        sortable: false,
        width: '150px',
        type: 'index',
        editable: false,
        ui: false,
        visible: false,
        filter: null,
      })
      this.headers.push({ text: '', value: 'agregar', sortable: false, width: '50px', type: 'add', filter: null })
      const apiReq = process.env.VUE_APP_API_URL + '/ConsultarGrid?psSpSel=' + this.dataSelProp
      let griData = await axios.get(apiReq, {}, { 'Access-Control-Allow-Origin': '*' })
      griData = griData.data
      let indexKey = ''
      for (let item of griData) {
        indexKey = ''
        this.keyProp.forEach(index => (indexKey += (indexKey === '' ? '' : '|') + item[index]))
        this.items.push({ ...item, rowIndex: indexKey, delete: false, edit: [] })
        this.itemsData.push({ ...item, rowIndex: indexKey, delete: false, edit: [] })
      }
      for (let item of this.comboProp) {
        await this.$store.dispatch(item.data)
        let storeName = item.data.toLowerCase().replace(/get/g, '')
        let storeData = []
        for (let item of this.$store.state[storeName]) {
          let keys = Object.keys(item)
          storeData.push({ Id: item[keys[0]], Nom: item[keys[1]] })
        }
        const comboNull = { [item.name]: storeData, ...this.combos }
        this.combos = comboNull
        this.combos.defaults = { [item.name]: item.default, ...this.combos.defaults }
      }
    },
  },
  computed: {
    isFiltered() {
      const isFiltered = filter => {
        if (filter) {
          if (typeof filter === 'object')
            if (filter.hasOwnProperty('from')) return filter.from ? true : false
            else if (filter.hasOwnProperty('to')) return filter.to ? true : false
            else return true
          else return true
        } else return false
      }
      return this.headers.some(item => isFiltered(item.filter))
    },
    currentDate() {
      return new Date().toISOString().substring(0, 10)
    },
    isSave() {
      let valid = true
      const dataTypes = ['text', 'number', 'telephone', 'email', 'combo']
      for (const row of this.items) {
        for (const cell in row) {
          if (dataTypes.includes(this.dataType(cell))) {
            let isValid = this.isValid(this.dataType(cell), row[cell])
            if (isValid) valid = false
          }
        }
      }
      const added = this.items.some(item => item.id < 0)
      return !(valid && (added || this.itemsEdit.length > 0))
    },
    isReset() {
      const added = this.items.some(item => item.id < 0)
      return !(added || this.itemsEdit.length > 0)
    },
  },
  async mounted() {
    await this.parseData()
  },
}
</script>
<style scoped>
td[cell-name='id'],
td[cell-name='edit'] {
  display: none;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
#link {
  color: #9155fd;
  font-size: 16px;
  font-weight: 400;
}
#link:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
