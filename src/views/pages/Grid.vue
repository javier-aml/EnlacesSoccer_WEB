<template>
    <div>
        <v-container>
            <v-row
                no-gutters
            >
                <v-col
                    v-for="col in gridGolumnsD"
                    :key="col.colNo"               
                >
                    <v-card-title
                        outlined
                        tile
                    >
                        {{col.title}}
                    </v-card-title>
                </v-col>
            </v-row>
            <v-row
                no-gutters
                v-for="row in gridDataOut"
                :key="gridDataOut.indexOf(row)"
            >
                <v-col
                    v-for="col in gridGolumnsD"
                    :key="col.colNo"
                >
                    <v-card
                        outlined
                        tile
                    >
                        <v-text-field 
                            v-if="col.type === 'string'"
                            hide-details 
                            type="text" :disabled="!col.editable"
                            @change="gridEdit($event, gridDataOut.indexOf(row), col.colNo)"
                            :value="gridDataOut[gridDataOut.indexOf(row)][col.colNo]"
                        ></v-text-field>
                        <v-text-field 
                            v-else-if="col.type === 'integer'"
                            hide-details 
                            type="number" :disabled="!col.editable"
                            @change="gridEdit($event, gridDataOut.indexOf(row), col.colNo)"
                            :value="gridDataOut[gridDataOut.indexOf(row)][col.colNo]"
                        ></v-text-field>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<script>
    export default{
        props: {
            gridTitle: {
                type: String,
                default: '',
                required: false
            },
            gridEditable: {
                type: Boolean,
                default: false,
                required: false
            },
            gridColumns: {
                type: Object,
                default: () => {},
                required: false
            },
            gridData: {
                type: Array,
                default: () => [],
                required: false
            }
        },
        data(){
            return{
                gridDataOut: [],
                gridDataD: [
                    ['Cel11', 1],
                    ['Cel12', 2]
                ],
                gridGolumnsD: {
                    1: {
                        title: 'Col1',
                        with: '5px',
                        type: 'string',
                        editable: true,
                        colNo: 1
                    },
                    2: {
                        title: 'Col2',
                        with: '5px',
                        type: 'integer',
                        editable: true,
                        colNo: 2
                    }
                }
            }
        },
        computed: {
            gridTitleC(){return this.gridTitle},
            gridEtitableC(){return this.gridEditable},
            gridGolumnsC(){return this.gridColumns},
            gridDataC(){return this.gridData}
        },
        watch: {},
        methods: {
            gridColumnsObj: function(){
                for(let item of this.gridDataD){
                    this.gridDataOut.push([false, ...item]);
                }
            },
            gridEdit: function(val, row, col){
                this.gridDataOut[row][col] = val;
                this.gridDataOut[row][0] = true;
                console.log(this.gridDataOut);
            }
        },
        mounted(){
            this.gridColumnsObj();
        }
    }
</script>
<style scoped>
    .v-text-field{
        padding: 0px;
        padding-left: 5px;
        padding-right: 5px;
    }
    .v-card__title{
        padding: 5px;
        justify-content: center;
    }
</style>
