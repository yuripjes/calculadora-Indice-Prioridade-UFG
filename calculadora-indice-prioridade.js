
const paragrafo1 = '§ 1º Para estudantes com apenas um período cursado, TA, QR, CHA e CHC serão calculados considerando-se apenas o período cursado.'
const paragrafo2 = '§ 2º No caso de apenas um período cursado, se CHC for menor que 256h (duzentas e cinquenta e seis horas) então CHC será igual a 256h (duzentas e cinquenta e seis horas).'

const paragrafo3 = '§ 3º No caso dos dois últimos períodos cursados, se CHC for menor que 512h (quinhentas e doze horas), então CHC será igual a 512 (quinhentas e doze horas).'

const valorMaximoTI=1
const valorMaximoTA=1
const valorMaximoIP=110

const truncarDuasCasasDecimais = (valor) => {
  return (parseInt( valor * 100 ) / 100)
  /*return Number(
    valor.toString().match(/^\d+(?:\.\d{0,2})?/)
  )*/
}

var app = new Vue({
  data() {
    return {
      message: 'Row',
      etapa: 1,
      qtdPeriodos: 0,
      anoPeriodoAtual: null,
      anosPeriodosDisponiveis: [],//Para facilitar a obtenção dos anos-períodos anteriores ao que o usuário selecionar no combobox
      anosPeriodosSelecionaveis: [], //vai para o combobox, tem os dois itens iniciais e finais removidos

      inputCHT: undefined,
      inputCHI: undefined,
      periodos: [],
      inputMatricula: undefined,


      calc: null,
      paragrafosAplicados: [],
      ultimoId : 0
    }  
  },

  mounted() {
    const anoAtual = new Date().getFullYear();

    this.anoPeriodoAtual = anoAtual + '/' + 1

    for (let i = anoAtual - 3; i <= anoAtual + 2; i++) {
      for (let j = 1; j <= 2; j++) {
        this.anosPeriodosDisponiveis.push(i + '/' + j)

      }
    }

    this.anosPeriodosSelecionaveis = [...this.anosPeriodosDisponiveis.slice(4, 8)]

  },
  methods: {
    reiniciarCalculo() {
      this.etapa = 1

      this.qtdPeriodos = 0
      //////this.anoPeriodoAtual= null
      //////anosPeriodosDisponiveis:[],
      //////anosPeriodosSelecionaveis:[],

      this.inputCHT = undefined
      this.inputCHI = undefined
      this.periodos = []
    },
    adicionar(itemPeriodo) {
      itemPeriodo.disciplinas.push({
        selecionado: false,
        cargaHoraria: "",
        situacao: null
      })

      this.$nextTick(()=>{
        let indexPeriodo = this.periodos.indexOf(itemPeriodo)
        let indexUltimaDisciplina = itemPeriodo.disciplinas.length-1

        if(indexPeriodo===0){
          this.$refs.inputCHDisciplinas_0_Ref[indexUltimaDisciplina].focus()
        }else if(indexPeriodo===1){
          this.$refs.inputCHDisciplinas_1_Ref[indexUltimaDisciplina].focus()
        }
      });
    },
    duplicar(itemPeriodo, obj, $event) {
      itemPeriodo.disciplinas.push({...obj})
    },
    excluir(itemPeriodo, obj, $event) {
      let index = itemPeriodo.disciplinas.indexOf(obj)
      itemPeriodo.disciplinas.splice(index, 1);
    },
    verificaReprovacaoPorFalta(situacao) {
      return situacao === 'RF' || situacao === 'RMF'
    },
    verificaCargaHorariaCursada(situacao) {
      return situacao === 'AP' || situacao === 'RM' || situacao === 'RF' || situacao === 'RMF'
    },
    verificaCargaHorariaAprovada(situacao) {
      return situacao === 'AP'
    },
    contabilizaCargaHorariaCursada(somaCHC) {
      if (this.qtdPeriodos === 1) {
        this.paragrafosAplicados.push(paragrafo1)

        if (somaCHC < 256) {
          this.paragrafosAplicados.push(paragrafo2)
          return 256
        }
        return somaCHC;
      } else if (this.qtdPeriodos === 2) {

        if (somaCHC < 512) {
          this.paragrafosAplicados.push(paragrafo3)
          return 512
        }
        return somaCHC
      }
    },
    calcularTaxaAprovacao(cha, chc) {
      let ta = truncarDuasCasasDecimais(cha / chc)
      
      return ta > 1 ? valorMaximoTA : ta
    },
    calcularTaxaIntegralizacao(chi, cht) {
      let ti = truncarDuasCasasDecimais(chi / cht)
      return ti > 1 ? valorMaximoTI : ti
    },
    calcularIndicePrioridade(ta, ti, qr) {
      let ip = truncarDuasCasasDecimais((100 * ta) + (10 * ti) - (3 * qr))
      return ip > 110 ? valorMaximoIP : ip
    },
    formatarNumero(num, digitos) {
      return isNaN(num) ? '-' : Number(num).toLocaleString('pt-BR', { minimumFractionDigits: digitos, maximumFractionDigits: digitos })
    },
    definirPeriodos(qtd) {

      for (let i = 0; i < qtd; i++) {
        let periodo = {
          descricao: "",
          disciplinas: [
            {
              //disciplina: "",
              cargaHoraria: "",
              situacao: null
            }]
        }
        this.periodos.push(periodo)
      }

      this.qtdPeriodos = qtd
      this.etapa = 2
    },

    selecionarAnoPeriodoAtual(anoPeriodo) {
      // pegar duas posições atras no array que vai para o <select menu>
      let index = this.anosPeriodosDisponiveis.indexOf(anoPeriodo)
      if (this.periodos.length === 1) {
        this.periodos[0].descricao = `${this.anosPeriodosDisponiveis[index - 1]}`
      } else if (this.periodos.length === 2) {
        this.periodos[0].descricao = `${this.anosPeriodosDisponiveis[index - 2]}`
        this.periodos[1].descricao = `${this.anosPeriodosDisponiveis[index - 1]}`
      }

      this.etapa = 3
      this.$nextTick(()=>{
        this.$refs.inputCHTRef.focus();
      });
      
    },
    calcular() {

      let qr = 0
      let chc = 0
      let somaCHC = 0// Para nao inicializar o CHC com 512 ou 256 (§ 2º e § 3º)
      let cha = 0
      let cht = 0
      let chi = 0
      let ta = 0
      let ti = 0
      let ip = 0

      this.paragrafosAplicados = []

      let disciplinaIndex = 0

      let indexGeral = 0

      this.periodos.forEach(periodo => {

        disciplinaIndex = 0

        periodo.disciplinas.forEach(disciplina => {


          indexGeral++
          

          if (this.verificaReprovacaoPorFalta(disciplina.situacao)) {
            qr++
          }

          if (this.verificaCargaHorariaCursada(disciplina.situacao)) {
            somaCHC += Number(disciplina.cargaHoraria)
          }

          if (this.verificaCargaHorariaAprovada(disciplina.situacao)) {
            cha += Number(disciplina.cargaHoraria)
          }

          disciplinaIndex++
        });
      });

      qr = somaCHC > 0 ? qr : NaN

      chc = somaCHC > 0 ? this.contabilizaCargaHorariaCursada(somaCHC) : NaN //Para nao exibir CHC maior que zero sem o usuário preencher
      cha = cha > 0 ? cha : NaN

      cht = somaCHC > 0 ? this.inputCHT : NaN
      chi = somaCHC > 0 ? this.inputCHI : NaN

      ta = this.calcularTaxaAprovacao(cha, chc)
      ti = this.calcularTaxaIntegralizacao(chi, cht)
      ip = this.calcularIndicePrioridade(ta, ti, qr)

      this.calc = {
        qr: this.formatarNumero(qr, 0),
        chc: this.formatarNumero(chc, 0),
        cha: this.formatarNumero(cha, 0),
        chi: this.formatarNumero(chi, 0), 
        cht: this.formatarNumero(cht, 0),
        ta: this.formatarNumero(ta, 2),
        ti: this.formatarNumero(ti, 2),
        ip: this.formatarNumero(ip, 2)
      }

      this.etapa = 4

    },


    getProximoId(){
      this.ultimoId++
      return this.ultimoId
    },
    getNumeroLinha(indexPeriodo, indexDisciplina){
      if(indexPeriodo===0){
        return indexDisciplina + 1
      }else if(indexPeriodo ===1){
        return this.periodos[0].disciplinas.length+ (indexDisciplina +1)
      }
    }

  },
  template: `
  <div id="prioridade">
    <div class="content-calc-ip">

      <button v-on:click="reiniciarCalculo()" v-if="etapa>1"><i class="fa fa-undo" /> Reiniciar cálculo</button>

      <template v-if="etapa===1">
        <div class="msg-ip">
          <span class="t-msg-ip">Sugestões</span>
          <ul>
            <li>Antes de prosseguir, utilize o SIGAA para emitir seu extrato acadêmico e encontrar todas as informações necessárias (Menu Ensino > Emitir Extrato Acadêmico).</li>
            <li>Leia o Art. 54 do <a href="https://sistemas.ufg.br/consultas_publicas/resolucoes/arquivos/Resolucao_CEPEC_2022_1791.pdf" target="blank">RGCG</a> para entender como o IP é calculado.</li>
          </ul>
        </div>
        
        <h2>Informe a quantidade de semestres a serem considerados no cálculo</h2>
        <button v-on:click="definirPeriodos(1)">1</button>
        <button v-on:click="definirPeriodos(2)">2</button>
      </template>


      <template v-if="etapa===2">

        <h2>Informe o Ano/Período atual</h2>

        <div>
          <button v-for="(item, index) of anosPeriodosSelecionaveis"
            v-on:click="selecionarAnoPeriodoAtual(item)">{{item}}</button>
        </div>

      </template>


      <template v-if="etapa===3">
        <form @submit.prevent="calcular">
          <label for="cht" class="size-label1">CHT</label>
          <input id="cht" class="size-input1" type="number" ref="inputCHTRef" v-model.number="inputCHT" min="1"
            required></input>
          <br />

          <label for="chi" class="size-label1">CHI</label>
          <input id="chi" class="size-input1" type="number" v-model.number="inputCHI" min="1" required></input>


          <div class="semestre-ip" v-for="(itemPeriodo, indexPeriodo) of periodos">
            <h2>{{itemPeriodo.descricao}}</h2>

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

            <div class="h-select">
              <button type="button" @click.prevent="adicionar(itemPeriodo)"><i class="fa fa-plus" /> disciplina</button>
            </div>
          </div>

          <div class="h-select">
            <button type="submit"><i class="fa fa-calculator" />Calcular</button>
          </div>
        </form>
      </template>

      <template v-if="etapa===4">

        <div v-show="paragrafosAplicados.length > 0" class="msg-ip">
          <span class="t-msg-ip">Regras aplicadas</span>
          <ul>
            <li v-for="(regra, index) of paragrafosAplicados">
              {{regra}}
            </li>
          </ul>
        </div>


        <h2>Cálculo do IP</h2>
        <div class="formula-ip">
          <div class="item-formula-ip">
            100
          </div>
          <div class="item-formula-ip">
            <div class="l-form-ip">x</div>
          </div>
          <div class="item-formula-ip">
            <div>
              <div class="l-form-ip">TA</div>
              <div class="n-form-ip">{{calc.ta}}</div>
            </div>
            <div class="subitem-formula-ip">
              <div class="item-sub-formula-ip">
                <div class="l-form-ip">CHA</div>
                <div class="n-form-ip t-cor">{{calc.cha}}</div>
              </div>
              <div class="l-form-ip">/</div>
              <div class="item-sub-formula-ip">
                <div class="l-form-ip">CHC</div>
                <div class="n-form-ip t-cor">{{calc.chc}}</div>
              </div>
            </div>
          </div>
          <div class="item-formula-ip">
            <div class="l-form-ip">+</div>
          </div>
          <div class="item-formula-ip">
            <div>10</div>
          </div>
          <div class="item-formula-ip">
            <div class="l-form-ip">x</div>
          </div>
          <div class="item-formula-ip">
            <div>
              <div class="l-form-ip">TI</div>
              <div class="n-form-ip">{{calc.ti}}</div>
            </div>
            <div class="subitem-formula-ip">
              <div class="item-sub-formula-ip">
                <div class="l-form-ip">CHI</div>
                <div class="n-form-ip t-cor">{{calc.chi}}</div>
              </div>
              <div class="l-form-ip">/</div>
              <div class="item-sub-formula-ip">
                <div class="l-form-ip">CHT</div>
                <div class="n-form-ip t-cor">{{calc.cht}}</div>
              </div>
            </div>
          </div>
          <div class="item-formula-ip">
            <div class="l-form-ip">-</div>
          </div>
          <div class="item-formula-ip">
            <div>3</div>
          </div>
          <div class="item-formula-ip">
            <div class="l-form-ip">x</div>
          </div>
          <div class="item-formula-ip">
            <div class="l-form-ip">QR</div>
            <div class="n-form-ip">{{calc.qr}}</div>
          </div>
          <div class="item-formula-ip">
            <div class="l-form-ip">=</div>
          </div>
          <div class="item-formula-ip">
            <div class="l-form-ip t-size">IP</div>
            <div class="n-form-ip t-size">{{calc.ip}}</div>
          </div>
        </div>
        <button v-on:click="()=> etapa=3"><i class="fa fa-edit" />Editar</button>

      </template>


    </div>
  </div>

  `,

}).$mount('#app-calc-ip');
