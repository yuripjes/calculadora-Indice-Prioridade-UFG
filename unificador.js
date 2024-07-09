const fs = require("fs");

prepararArquivo();

function prepararArquivo() {
  //TODO rodar sanitizer no html gerado
  let html = `<div id="app-calc-ip"></div>`;

  html += gerarTagScript(lerArquivo("./app/calculadora-indice-prioridade.js"));

  //console.log('######### html final ######\n', html)
  escreverArquivoHtml(html);
}

function lerArquivo(path) {
  return fs.readFileSync(path, "utf8");
}

function gerarTagScript(conteudo) {
  return `\n<script>\n${conteudo}\n</script>`;
}

function escreverArquivoHtml(html) {
  fs.writeFile("arquivo-publicacao.html", html, (err) => {
    if (err) throw err;
    console.info("O arquivo foi criado com sucesso!");
  });
}
