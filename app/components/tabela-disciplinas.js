Vue.component("tabela-disciplinas", {
  props: ["periodos", "itemPeriodo", "indexPeriodo", "indexPeriodo"],
  data() {
    return {};
  },
  methods: {
    getNumeroLinha(indexPeriodo, indexDisciplina){
        if(indexPeriodo===0){
          return indexDisciplina + 1
        }else if(indexPeriodo ===1){
          return this.periodos[0].disciplinas.length+ (indexDisciplina +1)
        }
      },
    duplicar(itemPeriodo, obj, $event) {
        itemPeriodo.disciplinas.push({...obj})
    },
    excluir(itemPeriodo, obj, $event) {
        let index = itemPeriodo.disciplinas.indexOf(obj)
        itemPeriodo.disciplinas.splice(index, 1);
    },
  },
  template: `
    <div lass="disc-ip">
        <div class="l-disc-ip">
            <div class="num-disc-ip h-select">#</div>
            <div class="ch-disc-ip h-select">CH</div>
            <div class="sit-disc-ip h-select">Situação</div>
            <div class="act-disc-ip h-select">Ações</div>
        </div>

        
        <div v-for="(itemDisciplina, indexDisciplina) of itemPeriodo.disciplinas" class="l-disc-ip">
            <div class="num-disc-ip">
                {{getNumeroLinha(indexPeriodo, indexDisciplina)}}
            </div>
            <div class="ch-disc-ip">
                <input type="number" v-model.number="itemDisciplina.cargaHoraria" min="1" max="9999"
                :ref="'inputCHDisciplinas_'+indexPeriodo+'_Ref'" required></input>
            </div>
            <div class="sit-disc-ip">
                <select class="h-select" v-model="itemDisciplina.situacao" required>
                <option value="AP">AP - Aprovado</option>
                <option value="RM">RM - Reprov. Média</option>
                <option value="RF">RF - Reprov. Falta</option>
                <option value="RMF">RMF - Reprov. Média e Falta</option>
                </select>
            </div>
            <div class="h-select">
                <button type="button" @click.prevent.stop="duplicar(itemPeriodo, itemDisciplina, $event)"
                :disabled="!(itemDisciplina.cargaHoraria > 0 && itemDisciplina.situacao)"><i
                    class="fa fa-copy" /></button>

                <button type="button" @click.prevent.stop="excluir(itemPeriodo, itemDisciplina, $event)"
                :disabled="itemPeriodo.disciplinas.length<=1"><i class="fa fa-trash" /></button>
            </div>
        </div>
    </div>
      `,
});
  