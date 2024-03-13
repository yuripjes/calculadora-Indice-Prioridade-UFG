Vue.component("card-nova-disciplina", {
  components: {
    //Chips: chips,
    'SelectButton': selectbutton,
    //'CardNovaDisciplina': card-nova-disciplina
  },
  props: ["itemPeriodo", "indexPeriodo"],
  data() {
    return {
      situacaoOptions: ["AP", "RM", "RF", "RMF"],
    };
  },
  methods: {
    adicionarDisciplina() {
      //let novaDisciplina = {...itemPeriodo.novoItemDisciplina}
      //itemPeriodo.disciplinas.push(novaDisciplina)
      this.$emit("update:itemPeriodo", this.itemPeriodo);
    },

    //Provavelmente não será usado
    definirCargaHoraria(novoItemDisciplina, cargaHoraria) {
      novoItemDisciplina.cargaHoraria = Number(cargaHoraria);
    },
  },
  template: `
    <div style="background: #daffff; width: 100%; padding: 2rem; display: flex; flex-direction: row; gap: 10px; ">
        <SelectButton v-model="itemPeriodo.novoItemDisciplina.situacao" :options="situacaoOptions" />

        <div style=" display: flex; flex-direction: column; gap: 10px;">
        
            <div style=" display: flex; flex-direction: row; gap: 5px;">
                <button type="button" @click.prevent="definirCargaHoraria(itemPeriodo.novoItemDisciplina, 16)">16</button>
                <button type="button" @click.prevent="definirCargaHoraria(itemPeriodo.novoItemDisciplina, 32)">32</button>
                <button type="button" @click.prevent="definirCargaHoraria(itemPeriodo.novoItemDisciplina, 48)">48</button>
                <button type="button" @click.prevent="definirCargaHoraria(itemPeriodo.novoItemDisciplina, 64)">64</button>
                <button type="button" @click.prevent="definirCargaHoraria(itemPeriodo.novoItemDisciplina, 96)">96</button>
                <button type="button" @click.prevent="definirCargaHoraria(itemPeriodo.novoItemDisciplina, 128)">128</button>
            </div>

            <div>
                <input type="number" v-model.number="itemPeriodo.novoItemDisciplina.cargaHoraria" min="1" max="9999"
                :ref="'NOVO_inputCHDisciplinas_'+indexPeriodo+'_Ref'" required></input>
            
                <button type="button" @click.prevent="adicionarDisciplina()"><i class="fa fa-plus" />Disciplina</button>
            </div>
        </div>
  
    </div>
    `,
});
