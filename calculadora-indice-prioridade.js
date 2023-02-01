
const paragrafo1 = '§ 1º Para estudantes com apenas um período cursado, TA, QR, CHA e CHC serão calculados considerando-se apenas o período cursado.'
const paragrafo2 = '§ 2º No caso de apenas um período cursado, se CHC for menor que 256h (duzentas e cinquenta e seis horas) então CHC será igual a 256h (duzentas e cinquenta e seis horas).'

const paragrafo3 = '§ 3º No caso dos dois últimos períodos cursados, se CHC for menor que 512h (quinhentas e doze horas), então CHC será igual a 512 (quinhentas e doze horas).'

const valorMaximoTI=1
const valorMaximoTA=1
const valorMaximoIP=110

const truncarDuasCasasDecimais = (valor) => {
console.log(valor)
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

      /*
        Para exibir ao final do cálculo
      */
      disciplinasFormatado: [],
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
    console.log("anosPeriodosDisponiveis: ")
    console.log(this.anosPeriodosDisponiveis)

    console.log("FIM Mounted()\n-----------------")
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
      console.log("TA: ")
      let ta = truncarDuasCasasDecimais(cha / chc)
      
      return ta > 1 ? valorMaximoTA : ta
    },
    calcularTaxaIntegralizacao(chi, cht) {
      console.log("TI: ")
      let ti = truncarDuasCasasDecimais(chi / cht)
      return ti > 1 ? valorMaximoTI : ti
    },
    calcularIndicePrioridade(ta, ti, qr) {
      console.log("IP: ")
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
      this.disciplinasFormatado = []
      let disciplinaIndex = 0

      let indexGeral = 0

      this.periodos.forEach(periodo => {

        disciplinaIndex = 0

        periodo.disciplinas.forEach(disciplina => {

          if (disciplinaIndex === 0) {
            this.disciplinasFormatado.push({
              anoPeriodo: periodo.descricao
            })
          }

          indexGeral++
          
          this.disciplinasFormatado.push({
            anoPeriodo: null,
            index: indexGeral,
            cargaHoraria: disciplina.cargaHoraria,
            situacao: disciplina.situacao
          })

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

      console.log("Índices calculados!!!")
      console.log(this.calc)

      this.etapa = 4

    },


    //TODO: Apagar na versão final
    preencherUmPeriodosDeTeste() {
      this.anoPeriodoAtual = "2022/2"
      this.qtdPeriodos = 1
      this.inputCHT = 3200
      this.inputCHI = 128
      this.periodos = [
        {
          descricao: "2022/2",
          disciplinas: [
            {
              //disciplina: "Disciplina 001",
              cargaHoraria: "64",
              situacao: "AP"
            },
            {
              //disciplina: "Disciplina 002",
              cargaHoraria: "64",
              situacao: "AP"
            }
          ]
        }
      ]

      this.etapa = 3
    },


    //TODO: Apagar na versão final
    preencherDoisPeriodosDeTeste() {
      this.anoPeriodoAtual = "2023/1"
      this.qtdPeriodos = 2
      this.inputCHT = 2988
      this.inputCHI = 2732
      this.periodos = [
        {
          descricao: "2022/1",
          disciplinas: [
            {
              //disciplina: "disciplina 1",
              cargaHoraria: "64",
              situacao: "AP"
            },
            {
              //disciplina: "disciplina 2",
              cargaHoraria: "64",
              situacao: "AP"
            },
            {
              //disciplina: "disciplina 3",
              cargaHoraria: "64",
              situacao: "AP"
            },
            {
              //disciplina: "disciplina 4",
              cargaHoraria: "64",
              situacao: "AP"
            }
          ]
        },
        {
          descricao: "2022/2",
          disciplinas: [
            {
              //disciplina: "disciplina 5",
              cargaHoraria: "64",
              situacao: "AP"
            },
            {
              //disciplina: "disciplina 6",
              cargaHoraria: "64",
              situacao: "AP"
            }
          ]
        }
      ]

      this.etapa = 3
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
    <div>

    <button v-on:click="reiniciarCalculo()" v-if="etapa>1"><i class="fa fa-undo" /> Reiniciar cálculo</button>
    <br /><br />



    <template v-if="etapa===1">
      <h4>Informe a quantidade de períodos</h4>
      <button v-on:click="definirPeriodos(1)" style="width: 4rem; height: 4rem">1</button>
      &nbsp;
      <button v-on:click="definirPeriodos(2)" style="width: 4rem; height: 4rem">2</button>

      <!--TODO: Remover este botão na versão final-->
      <br /><br /><br /><br />
      <button v-on:click="preencherUmPeriodosDeTeste()"><i class="fa fa-exclamation" /> Preencher 1 períodos de teste</button>      
      <br /><br />
      <button v-on:click="preencherDoisPeriodosDeTeste()"><i class="fa fa-exclamation" /> Preencher 2 períodos de teste</button>
      <br /><br />


    </template>



    <template v-if="etapa===2">

      <label>Informe o Ano/Período atual</label>
      <br />

      <button v-for="(item, index) of anosPeriodosSelecionaveis"
        v-on:click="selecionarAnoPeriodoAtual(item)" style="width: 6rem; height: 2rem">{{item}}</button>


    </template>

    <br /><br /><br />

    <template v-if="etapa===3">
      <form @submit.prevent="calcular">
        <label for="cht">CHT*</label>
        <input id="cht" type="number" ref="inputCHTRef" v-model.number="inputCHT" min="1" required></input>
        <br />

        <label for="chi">CHI*</label>
        <input id="chi" type="number" v-model.number="inputCHI" min="1" required></input>
        <br /><br />

        <div style="border:1; border" v-for="(itemPeriodo, indexPeriodo) of periodos">
          <h4>{{itemPeriodo.descricao}}</h4>

          <table>
            <thead>
              <th>#</th>
              <th>*Carga horária</th>
              <th>*Situação</th>
            </thead>
            <tbody>
              <tr v-for="(itemDisciplina, indexDisciplina) of itemPeriodo.disciplinas">
                <td>
                  {{getNumeroLinha(indexPeriodo, indexDisciplina)}}
                </td>
                <td>
                  <input type="number" v-model.number="itemDisciplina.cargaHoraria" min="1" max="9999" :ref="'inputCHDisciplinas_'+indexPeriodo+'_Ref'" required></input>
                </td>
                <td>
                  <select v-model="itemDisciplina.situacao" required>

                    <option value="AP">AP - Aprovado</option>
                    <option value="RM">RM - Reprov. Média</option>
                    <option value="RF">RF - Reprov. Falta</option>
                    <option value="RMF">RMF - Reprov. Média e Falta</option>
                  </select>
                </td>
                <td>
                  <button type="button" @click.prevent.stop="duplicar(itemPeriodo, itemDisciplina, $event)" :disabled="!(itemDisciplina.cargaHoraria > 0 && itemDisciplina.situacao)"><i
                      class="fa fa-copy" /></button>
                </td>                
                <td>
                  <button type="button" @click.prevent.stop="excluir(itemPeriodo, itemDisciplina, $event)" :disabled="itemPeriodo.disciplinas.length<=1"><i
                      class="fa fa-trash" /></button>
                </td>
              </tr>
            </tbody>
          </table>
          <button type="button" @click.prevent="adicionar(itemPeriodo)"><i class="fa fa-plus" /> disciplina</button>

        </div>

        <br/><br/><br/>
        <button type="submit" ><i
                      class="fa fa-calculator" />Calcular</button>
      </form>                    
    </template>

    <template v-if="etapa===4">
      <div style="border:1; border" >
        
        <table>
          <thead>
            <th>#</th>
            <th>Carga horária</th>
            <th>Situação</th>
          </thead>
          <tbody>



            <tr v-for="(item, indexDisciplina) of disciplinasFormatado">


            <template v-if="item.anoPeriodo===null">
                <td>
                    {{item.index}}
                </td>
                <td>
                    {{item.cargaHoraria}}
                </td>
                <td>
                    {{item.situacao}}
                </td>
            </template>

            <template v-else>
                <td colspan="4" style="background-color: #c5ebff;">Período {{item.anoPeriodo}}</td>
            </template>            

            </tr>


          </tbody>
        </table>
      </div>
      <br />
      <br />

      <div v-show="paragrafosAplicados.length > 0">
        <h4>Regras aplicadas (painel expansível? Painel tipo warning?)</h4>
        <ul>
          <li v-for="(regra, index) of paragrafosAplicados">
          {{regra}}
          </li>
        </ul>
      </div>
      
      <div>
        <h4>Cálculo do IP</h4>


        <table>
          <tr>
            <th>QR</th>
            <td>{{calc.qr}}</td>
          </tr>
          <tr>
            <th>CHA</th>
            <td>{{calc.cha}}</td>
          </tr>
          <tr>
            <th>CHC</th>
            <td>{{calc.chc}}</td>
          </tr>
          <tr>
            <th>CHI</th>
            <td>{{calc.chi}}</td>
          </tr>
          <tr>
            <th>CHT</th>
            <td>{{calc.cht}}</td>
          </tr>
          <tr>
            <th>TA</th>
            <td>{{calc.ta}}</td>
          </tr>
          <tr>
            <th>Ti</th>
            <td>{{calc.ti}}</td>
          </tr>
          <tr>
            <th>IP</th>
            <td>{{calc.ip}}</td>
          </tr>
        </table>

      </div>
      <button v-on:click="()=> etapa=3"><i
      class="fa fa-edit" />Editar</button>

    </template>





    <hr /><br /><br /><br /><br /><br /><br /><br />
    <h5>debug</h5>
    <pre>paragrafosAplicados: {{paragrafosAplicados}}</pre>
    <pre>anoPeriodoAtual: {{anoPeriodoAtual}}</pre>
    <pre>qtdPeriodos: {{qtdPeriodos}}</pre>
    <pre>periodos: {{periodos}}</pre>
    <pre>disciplinasFormatado: {{disciplinasFormatado}}</pre>
    <pre>calc: {{calc}}</pre>

     <pre>anosPeriodosSelecionaveis: {{anosPeriodosSelecionaveis}}</pre>
      <pre>anosPeriodosDisponiveis: {{anosPeriodosDisponiveis}}</pre>
  </div>

    `,

}).$mount('#app-calc-ip');
