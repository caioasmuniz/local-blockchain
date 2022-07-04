const { Blockchain } = require("./blockchain");

let maxDifficulty = 6;
let numBlocks = 10;
const strBlockChain = new Blockchain();
let blockTime = { start: 0, finnish: 0, duration: 0 };
let difTime = [];
let times = [];

for (let difficulty = 0; difficulty <= maxDifficulty; difficulty++) {
  for (let block = 0; block < numBlocks; block++) {
    strBlockChain.addBlockContent(block.toString());
    blockTime.start = Date.now();
    strBlockChain.mineOneBlock(difficulty);
    blockTime.finnish = Date.now();
    blockTime.duration = blockTime.finnish - blockTime.start;
    difTime.push(blockTime);
    blockTime = { start: 0, finnish: 0, duration: 0 };
  }
  times.push(difTime);
  difTime = [];
}

console.log(times);
