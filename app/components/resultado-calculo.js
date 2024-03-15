Vue.component("resultado-calculo", {
  components: {
    //Chips: chips,
    SelectButton: selectbutton,
    //'CardNovaDisciplina': card-nova-disciplina
  },
  props: ["paragrafosAplicados", "calc"],
  data() {
    return {
    };
  },
  methods: {
    voltarEdicao() {
      this.$emit("update:etapa", 2);
    }
  },
  template: `
  <div>
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
      <button v-on:click="voltarEdicao()"><i class="fa fa-edit" />Editar</button>
    </div>
    `,
});
