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
// Create new instance of Blockchain class
const difficulty = 4;
const strBlockChain = new Blockchain();

strBlockChain.readChainFromFile("./chain.json");

// Mine first block
strBlockChain.minePendingBlockContents(difficulty);

// Create a transaction & sign it with your key
const blockContent = "Este eh o conteudo do primeiro bloco";
strBlockChain.addBlockContent(blockContent);

// Mine block
strBlockChain.minePendingBlockContents(difficulty);

// Create second transaction
const blockContent2 = "Este eh o conteudo do segundo bloco";
strBlockChain.addBlockContent(blockContent2);

// Mine block
strBlockChain.minePendingBlockContents(difficulty);

console.log();
console.log(strBlockChain.chain);

strBlockChain.writeChainToFile("./chain.json");

// Uncomment this line if you want to test tampering with the chain
// savjeeCoin.chain[1].transactions[0].amount = 10;

// Check if the chain is valid
console.log();
console.log("Blockchain valid?", strBlockChain.isChainValid() ? "Yes" : "No");
