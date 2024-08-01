const fs = require("fs");

const NOME_ARQUIVO_GERADO = "arquivo-publicacao.html";
const URL_SCRIPT_VUE = 'https://unpkg.com/vue@2'

prepararArquivo();

function prepararArquivo() {
  //TODO rodar sanitizer no html gerado
  let html = `<div id="app-calc-ip"></div>`;

  //Importando lib do vue2
  html+=`\n<script src="${URL_SCRIPT_VUE}"></script>`

  html += gerarTagScript(lerArquivo("./app/calculadora-indice-prioridade.js"));
  html += lerArquivosDaPasta("./app/components");

  //console.log('######### html final ######\n', html)
  escreverArquivoHtml(html);
}

function lerArquivo(path) {
  return fs.readFileSync(path, "utf8");
}

function lerArquivosDaPasta(path) {
  const files = fs.readdirSync(path);
  let htmlDaPasta = "";
  //console.log(files);
  files.forEach((f) => {
    let caminhoCompleto = `${path}/${f}`;
    //console.log(caminhoCompleto)
    htmlDaPasta += gerarTagScript(lerArquivo(caminhoCompleto));
  });
  return htmlDaPasta;
}

function gerarTagScript(conteudo) {
  return `\n<script>\n${conteudo}\n</script>`;
}

function escreverArquivoHtml(html) {
  fs.writeFile(NOME_ARQUIVO_GERADO, html, (err) => {
    if (err) throw err;
    console.info(`O arquivo "${NOME_ARQUIVO_GERADO}" foi criado com sucesso!`);
  });
}
