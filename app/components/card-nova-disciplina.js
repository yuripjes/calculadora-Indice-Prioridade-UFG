Vue.component("card-nova-disciplina", {
  components: {
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
    exibirInputCH:  function () {
      return this.chSelecionada === 'OUTRA_CH';
    },
    desativarBotaoAdicionar: function () {
      let chInp = Number(this.itemPeriodo.novoItemDisciplina.cargaHoraria) || 0;
      let chSel = Number(this.chSelecionada) || 0;
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
          <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
            <template v-for="(item, indexChPredefinida) in chPredefinidaOptions">
                <input type="radio" class="btn-check" :name="'btnradioCh-'+indexPeriodo" :id="'btnradioCh-'+indexPeriodo+'-'+indexChPredefinida" autocomplete="off" v-model="chSelecionada" :value="item">
                <label class="btn btn-outline-primary" :for="'btnradioCh-'+indexPeriodo+'-'+indexChPredefinida">{{item}}</label>
            </template>
            <input type="radio" class="btn-check" :name="'btnradioCh-'+indexPeriodo" :id="'btnradioCh-'+indexPeriodo+'-outros'" autocomplete="off" v-model="chSelecionada" :value="'OUTRA_CH'">
            <label class="btn btn-outline-primary" :for="'btnradioCh-'+indexPeriodo+'-outros'">Outra CH</label>
          </div>
          <input v-if="exibirInputCH" type="number" v-model.number="itemPeriodo.novoItemDisciplina.cargaHoraria"  min="1" max="9999" placeholder="Digite a carga horária"
          :ref="'NOVO_inputCHDisciplinas_'+indexPeriodo+'_Ref'"></input>
      </div>

      <div>
          <label>Informe a situação do componente <b>cursado</b></label>
          <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
            <template v-for="(item, indexSituacoes) in situacaoOptions">
                <input type="radio" class="btn-check" :name="'btnradioSitacao'+indexPeriodo" :id="'btnradioSitacao-'+indexPeriodo+'-'+indexSituacoes" autocomplete="off" v-model="itemPeriodo.novoItemDisciplina.situacao" :value="item">
                <label class="btn btn-outline-primary" :for="'btnradioSitacao-'+indexPeriodo+'-'+indexSituacoes">{{item}}</label>
            </template>
          </div>
      </div>

      <button type="button" :disabled="desativarBotaoAdicionar" @click.prevent="adicionarDisciplina()"><i class="fa fa-plus" />Disciplina</button>

    </div>
    `,
});
