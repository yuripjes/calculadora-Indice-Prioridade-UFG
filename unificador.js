console.log("teste");

const fs = require("fs");
const data = "Testando a criação de arquivos";

fs.writeFile("arquivo-publicacao.html", data, (err) => {
  if (err) throw err;
  console.log("O arquivo foi criado!");
});
