// MIT License

// Copyright (c) 2018 Xavier Decuyper

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const { Blockchain } = require("./blockchain");
const readline = require("readline");

const rl = readline.createInterface(process.stdin, process.stdout);
let difficulty = 1;
const strBlockChain = new Blockchain();

rl.setPrompt(`
  <---> strBlockChain <--->

  MENU
  1 -> Ler blockchain de um arquivo
  2 -> Minerar blocos pendentes
  3 -> Selecionar dificuldade de mineração (atual: ${difficulty})
  4 -> Criar novo bloco
  5 -> Verificar integridade da blockchain
  6 -> Exibir a blockchain
  7 -> Salvar a blockchain em um arquivo
  8 -> Alterar o conteudo da blockchain (para fins de teste)

  Escolha uma opção: 
  `);

rl.prompt();

rl.on("line", (option) => {
  switch (parseInt(option)) {
    case 1:
      strBlockChain.readChainFromFile("./chain.json");
      break;

    case 2:
      strBlockChain.minePendingBlockContents(difficulty);
      break;

    case 3:
      rl.question("Insira a nova dificuldade: ", (newDifficulty) => {
        difficulty = newDifficulty;
      });
      break;

    case 4:
      rl.question("Insira o conteúdo do novo bloco: ", (blockContent) => {
        strBlockChain.addBlockContent(blockContent);
      });
      break;

    case 5:
      console.log(
        strBlockChain.isChainValid()
          ? "A blockchain eh valida"
          : "A blockchain nao eh valida"
      );
      break;

    case 6:
      console.log("case 6");
      console.log(strBlockChain.chain);
      break;

    case 7:
      strBlockChain.writeChainToFile("./chain.json");
      break;
  }
  rl.prompt();
});


// Uncomment this line if you want to test tampering with the chain
// savjeeCoin.chain[1].transactions[0].amount = 10;