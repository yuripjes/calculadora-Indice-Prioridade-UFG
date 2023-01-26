//Vue.component("Conteudo", Conteudo);

/*  new Vue({
  data: () => ({ message: 'Row' }),
  template: `
  <div>
    <h1>{{message}} your boat</h1>
    <button v-on:click="message += ' row'">Add</button>
  </div>
  `
 
}).$mount('#app-calc-ip');*/

const paragrafo1 = '§ 1º Para estudantes com apenas um período cursado, TA, QR, CHA e CHC serão calculados considerando-se apenas o período cursado.'
const paragrafo2 = '§ 2º No caso de apenas um período cursado, se CHC for menor que 256h (duzentas e cinquenta e seis horas) então CHC será igual a 256h (duzentas e cinquenta e seis horas).'

const paragrafo3 = '§ 3º No caso dos dois últimos períodos cursados, se CHC for menor que 512h (quinhentas e doze horas), então CHC será igual a 512 (quinhentas e doze horas).'



var app = new Vue({
  data() {
    return {
      message: 'Row',
      etapa: 1,
      qtdPeriodos: 0,
      anoPeriodoAtual: null,
      anosPeriodosDisponiveis: [],//Para facilitar a obtenção dos anos-períodos anteriores ao que o usuário selecionar no combobox
      anosPeriodosSelecionaveis: [], //vai para o combobox, tem os dois itens iniciais e finais removidos
      /* primeiroPeriodo: {
           descricaoPeriodo: "",
           disciplinas: [
               {
                   disciplina: "",
                   cargaHoraria: "",
                   situacao: null
               }]
       },
       */
      inputCHT: undefined,
      inputCHI: undefined,
      periodos: [],
      inputMatricula: undefined,
      disciplinasFormatado: [],//para exibir ao final do cálculo
      calc: null,
      paragrafosAplicados: []
    }
  },
  computed: {
    /*
    TODO: APAGAR

    calc() {
        let qr = 0
        let chc = 0
        let somaCHC = 0// Para nao inicializar o CHC com 512 ou 256 (§ 2º e § 3º)
        let cha = 0
        let cht = 0
        let chi = 0
        let ta = 0
        let ti = 0
        let ip = 0

//TODO retirar variável computed e aproveitar este for no método Calcular()
        this.periodos.forEach(periodo => {
            periodo.disciplinas.forEach(disciplina => {
                if (this.verificaReprovacaoPorFalta(disciplina.situacao)) {
                    qr++
                }

                if (this.verificaCargaHorariaCursada(disciplina.situacao)) {
                    somaCHC += Number(disciplina.cargaHoraria)
                }

                if (this.verificaCargaHorariaAprovada(disciplina.situacao)) {
                    cha += Number(disciplina.cargaHoraria)
                }
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

        return {
            qr: this.formatarNumero(qr, 0),
            chc: this.formatarNumero(chc, 0),
            cha: this.formatarNumero(cha, 0),
            chi: this.formatarNumero(chi, 0), cht: this.formatarNumero(cht, 0),
            ta: this.formatarNumero(ta, 2),
            ti: this.formatarNumero(ti, 2),
            ip: this.formatarNumero(ip, 2)
        }
    },*/



  },
  mounted() {
    console.log("Mounted()")
    const anoAtual = new Date().getFullYear();


    this.anoPeriodoAtual = anoAtual + '/' + 1

    console.log("Ano/periodo atual: ")
    console.log(this.anoPeriodoAtual)
    for (let i = anoAtual - 2; i <= anoAtual + 2; i++) {
      for (let j = 1; j <= 2; j++) {
        this.anosPeriodosDisponiveis.push(i + '/' + j)

      }
    }


    this.anosPeriodosSelecionaveis = [...this.anosPeriodosDisponiveis.slice(1, -3)]
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
      this.inputMatricula = undefined



    },
    adicionar(itemPeriodo) {
      itemPeriodo.disciplinas.push({
        disciplina: "",
        cargaHoraria: "",
        situacao: null
      })

      this.$nextTick(()=>{
        let indexPeriodo = this.periodos.indexOf(itemPeriodo)
        let indexUltimaDisciplina = itemPeriodo.disciplinas.length-1

        if(indexPeriodo===0){
          this.$refs.inputDisciplinas_0_Ref[indexUltimaDisciplina].focus()
        }else if(indexPeriodo===1){
          this.$refs.inputDisciplinas_1_Ref[indexUltimaDisciplina].focus()
        }
      });


      console.log("Adicionou!")
    },
    limpar() {
      console.log("Limpou!!!")
    },
    excluir(itemPeriodo, obj) {
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
      let ta = (parseInt((cha / chc) * 100) / 100)
      ta <= 1 ? ta : 1
      return ta.toFixed(2)
    },
    calcularTaxaIntegralizacao(chi, cht) {
      return (parseInt((chi / cht) * 100) / 100).toFixed(2)
    },
    calcularIndicePrioridade(ta, ti, qr) {
      let ip = (parseInt(((100 * ta) + (10 * ti) - (3 * qr)) * 100) / 100)
      ip <= 110 ? ip : 110
      return ip.toFixed(2)
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
              disciplina: "",
              cargaHoraria: "",
              situacao: null
            }]
        }
        this.periodos.push(periodo)
      }

      this.qtdPeriodos = qtd
      this.etapa = 2
    },

    selecionarAnoPeriodoAtual() {
      // pegar duas posições atras no array que vai para o <select menu>
      let index = this.anosPeriodosDisponiveis.indexOf(this.anoPeriodoAtual)
      if (this.periodos.length === 1) {
        this.periodos[0].descricao = `${this.anosPeriodosDisponiveis[index - 1]}`
      } else if (this.periodos.length === 2) {
        this.periodos[0].descricao = `${this.anosPeriodosDisponiveis[index - 2]}`
        this.periodos[1].descricao = `${this.anosPeriodosDisponiveis[index - 1]}`
      }




      this.etapa = 3
      this.$nextTick(()=>{
        let self = this
        console.log(self.$refs) // Shows the mapRef object reference
        console.log(self.$refs.mapRef) // returns undefined ???
        this.$refs.inputMatriculaRef.focus();
      });
      
    },
    //TODO: trazer o calculo do IP para cá pois passamos a calcular somente ao clicar no botão
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

      this.periodos.forEach(periodo => {

        disciplinaIndex = 0

        periodo.disciplinas.forEach(disciplina => {

          if (disciplinaIndex === 0) {
            this.disciplinasFormatado.push({
              anoPeriodo: periodo.descricao
            })
          }

          this.disciplinasFormatado.push({
            anoPeriodo: null,
            disciplina: disciplina.disciplina,
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
        chi: this.formatarNumero(chi, 0), cht: this.formatarNumero(cht, 0),
        ta: this.formatarNumero(ta, 2),
        ti: this.formatarNumero(ti, 2),
        ip: this.formatarNumero(ip, 2)
      }

      console.log("Índices calculados!!!")
      console.log(this.calc)


      this.etapa = 4







      /*
      apagar abaixo
      
                  this.disciplinasFormatado = []
                  this.etapa = 4
                  for(let per=0; per< this.periodos.length; per++){
                      for(let dis=0; dis< this.periodos[per].disciplinas.length; dis++){
      
                          if(dis===0){
                              this.disciplinasFormatado.push({
                                  anoPeriodo:this.periodos[per].descricao
                              })
                          }
      
                          this.disciplinasFormatado.push({
                              anoPeriodo: null,
                              disciplina: this.periodos[per].disciplinas[dis].disciplina,
                              cargaHoraria: this.periodos[per].disciplinas[dis].cargaHoraria,
                              situacao: this.periodos[per].disciplinas[dis].situacao
                          })
                      }
                  }
                  console.log("Fim do cálculo!")
                  console.log(this.disciplinasFormatado)*/
    },


    //TODO: Apagar na versão final
    preencherUmPeriodosDeTeste() {
      this.inputMatricula = "201850000"
      this.anoPeriodoAtual = "2022/2"
      this.qtdPeriodos = 1
      this.inputCHT = 3200
      this.inputCHI = 128
      this.periodos = [
        {
          descricao: "2022/2",
          disciplinas: [
            {
              disciplina: "Disciplina 001",
              cargaHoraria: "64",
              situacao: "AP"
            },
            {
              disciplina: "Disciplina 002",
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
      this.inputMatricula = "201800001"
      this.anoPeriodoAtual = "2023/1"
      this.qtdPeriodos = 2
      this.inputCHT = 2988
      this.inputCHI = 2732
      this.periodos = [
        {
          descricao: "2022/1",
          disciplinas: [
            {
              disciplina: "disciplina 1",
              cargaHoraria: "64",
              situacao: "AP"
            },
            {
              disciplina: "disciplina 2",
              cargaHoraria: "64",
              situacao: "AP"
            },
            {
              disciplina: "disciplina 3",
              cargaHoraria: "64",
              situacao: "AP"
            },
            {
              disciplina: "disciplina 4",
              cargaHoraria: "64",
              situacao: "AP"
            }
          ]
        },
        {
          descricao: "2022/2",
          disciplinas: [
            {
              disciplina: "disciplina 5",
              cargaHoraria: "64",
              situacao: "AP"
            },
            {
              disciplina: "disciplina 6",
              cargaHoraria: "64",
              situacao: "AP"
            }
          ]
        }
      ]

      this.etapa = 3
    }

  },
  template: `
    <div>

    <button v-on:click="reiniciarCalculo()" v-if="etapa>1"><i class="fa fa-undo" /> Reiniciar cálculo</button>
    <br /><br />



    <template v-if="etapa===1">
      <h4>Informe a quantidade de períodos</h4>
      <button v-on:click="definirPeriodos(1)">1</button>
      <br /><br />
      <button v-on:click="definirPeriodos(2)">2</button>

      <!--TODO: Remover este botão -->
      <br /><br />
      <button v-on:click="preencherUmPeriodosDeTeste()"><i class="fa fa-exclamation" /> Preencher 1 períodos de teste</button>      
      <br /><br />
      <button v-on:click="preencherDoisPeriodosDeTeste()"><i class="fa fa-exclamation" /> Preencher 2 períodos de teste</button>
      <br /><br />


    </template>



    <template v-if="etapa===2">

      <label>Informe o Ano/Período atual</label>
      <br />

      <button v-for="(item, index) of anosPeriodosSelecionaveis"
        v-on:click="selecionarAnoPeriodoAtual(item)">{{item}}</button>



    </template>

    <br /><br /><br />

    <template v-if="etapa===3">
<form @submit.prevent="calcular">
      <label for="matricula">Matrícula (opcional)</label>
      <input id="matricula" type="number" ref="inputMatriculaRef" v-model="inputMatricula"></input>
      <br />

      <label for="cht">CHT*</label>
      <input id="cht" type="number" v-model="inputCHT" min="1" required></input>
      <br />

      <label for="chi">CHI*</label>
      <input id="chi" type="number" v-model="inputCHI" min="1" required></input>
      <br /><br />

      <div style="border:1; border" v-for="(itemPeriodo, indexPeriodo) of periodos">
        <h4>{{itemPeriodo.descricao}}</h4>

        




        <table>
          <thead>
            <th>Disciplina</th>
            <th>*Carga horária</th>
            <th>*Situação</th>
          </thead>
          <tbody>
            <tr v-for="(item, indexDisciplina) of itemPeriodo.disciplinas">
              <td>
                <input type="text" v-model="item.disciplina" :ref="'inputDisciplinas_'+indexPeriodo+'_Ref'"></input>
              </td>
              <td>
                <input type="number" v-model="item.cargaHoraria" min="1" max="9999" required></input>
              </td>
              <td>
                <select v-model="item.situacao" required>

                  <option value="AP">AP - Aprovado</option>
                  <option value="RM">RM - Reprov. Média</option>
                  <option value="RF">RF - Reprov. Falta</option>
                  <option value="RMF">RMF - Reprov. Média e Falta</option>
                </select>
              </td>
              <td>
                <button v-on:click="excluir(itemPeriodo, item)" :disabled="itemPeriodo.disciplinas.length<=1"><i
                    class="fa fa-trash" /></button>
              </td>
            </tr>
          </tbody>
        </table>
        <button v-on:click.prevent="adicionar(itemPeriodo)"><i class="fa fa-plus" /> disciplina</button>

      </div>

      <br/><br/><br/>
      <button type="submit" ><i
                    class="fa fa-calculator" />Calcular</button>
</form>                    
    </template>

    <template v-if="etapa===4">

    <table>
    <tr>
      <th>Matrícula:</th>
      <td>{{inputMatricula?inputMatricula:'-'}}</td>
    </tr>
    </table>
    <br/><br/>

      <div style="border:1; border" >
        
        <table>
          <thead>
            <th>Disciplina</th>
            <th>Carga horária</th>
            <th>Situação</th>
          </thead>
          <tbody>



            <tr v-for="(item, indexDisciplina) of disciplinasFormatado">


            <template v-if="item.anoPeriodo===null">
                <td>
                    {{item.disciplina?item.disciplina:'-'}}
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

      <div>
        <h4>Regras aplicadas (painel expansível?)</h4>
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
  </div>

    `,

}).$mount('#app-calc-ip');
