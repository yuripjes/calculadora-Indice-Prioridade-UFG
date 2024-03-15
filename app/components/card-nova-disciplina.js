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
      chPredefinidaOptions: [16, 32, 48, 64, 96, 128],
      chSelecionada: null

      //TODO implementar variaveis localmente ao invés de usar o itemPeriodo.novoItemDisciplina
    };
  },
  computed: {
    desativarSeletorCH: function () {
      let ch = String(this.itemPeriodo.novoItemDisciplina.cargaHoraria);
      return ch.length > 0;
    },
    desativarInputCH:  function () {
      let ch =this.chSelecionada;
      return ch !== null;
    },
    desativarBotaoAdicionar: function () {
      let chInp = Number(this.itemPeriodo.novoItemDisciplina.cargaHoraria);
      let chSel = Number(this.chSelecionada);

      let situacao = this.itemPeriodo.novoItemDisciplina.situacao

      return (chInp === 0 && chSel === 0) || situacao === null;
    }
  },
  methods: {
    adicionarDisciplina() {
      let chSel = Number(this.chSelecionada);

      if(chSel > 0) {
        this.itemPeriodo.novoItemDisciplina.cargaHoraria = chSel;
      }

      this.$emit("update:itemPeriodo", this.itemPeriodo);
      this.chSelecionada = null;
    },

    //Provavelmente não será usado
    definirCargaHoraria(novoItemDisciplina, cargaHoraria) {
      novoItemDisciplina.cargaHoraria = Number(cargaHoraria);
    },
  },
  template: `
    <div style="background: #daffff; width: 100%; padding: 2rem; display: flex; flex-direction: row; gap: 10px; ">
    
      <div style=" display: flex; flex-direction: column; gap: 10px;">
          <label>Informe a carga horária do componente <b>cursado</b></label>
          <SelectButton v-model="chSelecionada" :options="chPredefinidaOptions" :disabled="desativarSeletorCH"/>
          <input type="number" v-model.number="itemPeriodo.novoItemDisciplina.cargaHoraria" :disabled="desativarInputCH" min="1" max="9999"
          :ref="'NOVO_inputCHDisciplinas_'+indexPeriodo+'_Ref'"></input>
      </div>

      <div>
          <label>Informe a situação do componente <b>cursado</b></label>
          <SelectButton v-model="itemPeriodo.novoItemDisciplina.situacao" :options="situacaoOptions" />
      </div>

      <button type="button" :disabled="desativarBotaoAdicionar" @click.prevent="adicionarDisciplina()"><i class="fa fa-plus" />Disciplina</button>

    </div>
    `,
});
