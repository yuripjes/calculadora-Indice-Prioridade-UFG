const fs = require("fs");

prepararArquivo();


function prepararArquivo(){
    //gerar com funçoes proprias do html > Sanitizar > depois pegar o innerhtml
    //const parser = new DOMParser();
    let html = `<div id="app-calc-ip"></div>`

    html += gerarTagScript(lerArquivo('./app/calculadora-indice-prioridade.js'));
    


    //console.log('######### html final ######\n', html)
    escreverHtml(html);
}

function lerArquivo(path) {
    return fs.readFileSync(path, 'utf8')
   /* Função asíncrona
    let conteudo = '';
    console.log('lerArquivo: ', path)
    fs.readFile(path, 'utf-8', (err, data) /* callback *//* => {
        if (err) {
            //res.status(500).send(err);
            console.error('Erro ao ler arquivo', err)
            return;
        }
        console.log('Conteúdo do arquivo:', data);
        return data;
    });
    return conteudo;

    */
}

function gerarTagScript(conteudo){
return `\n<script>\n${conteudo}\n</script>`
}

function escreverHtml(html){
    fs.writeFile("arquivo-publicacao.html", html, (err) => {
        if (err) throw err;
        console.info("O arquivo foi criado com sucesso!");
      });
}