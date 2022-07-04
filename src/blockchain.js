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

const crypto = require("crypto");
const fs = require("fs");

class Block {
  /**
   * @param {number} timestamp
   * @param {string} blockContent
   * @param {string} previousHash
   */

  constructor({ previousHash = "", timestamp, blockContent, nonce = 0, hash }) {
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.blockContent = blockContent;
    this.nonce = nonce;
    if (hash) this.hash = hash;
    else this.hash = this.calculateHash();
  }

  /**
   * Returns the SHA256 of this block (by processing all the data stored
   * inside this block)
   *
   * @returns {string}
   */
  calculateHash() {
    return crypto
      .createHash("sha256")
      .update(
        this.previousHash + this.timestamp + this.blockContent + this.nonce
      )
      .digest("hex");
  }

  /**
   * Starts the mining process on the block. It changes the 'nonce' until the hash
   * of the block starts with enough zeros (= difficulty)
   *
   * @param {number} difficulty
   */
  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log(`Block mined: ${this.hash}`);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.pendingBlockContents = [];
  }

  /**
   * @returns {Block}
   */
  createGenesisBlock() {
    return new Block({
      timestamp: Date.parse("2017-01-01"),
      blockContent: "Genesis Block",
    });
  }

  readChainFromFile(path) {
    try {
      let file = JSON.parse(fs.readFileSync(path, "utf8"));
      this.chain = [];
      for (const block of file) {
        this.chain.push(new Block(block));
        console.log("Blockchain adicionada via arquivo");
      }
    } catch (error) {
      console.log("Erro ao carregar o arquivo");
    }
  }

  writeChainToFile(path) {
    fs.writeFileSync(path, JSON.stringify(this.chain));
  }

  /**
   * Returns the latest block on our chain. Useful when you want to create a
   * new Block and you need the hash of the previous Block.
   *
   * @returns {Block[]}
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Takes all the pending BlockContents, puts them in a Block and starts the
   * mining process.
   * @param {number} difficulty
   */
  minePendingBlockContents(difficulty) {
    while (this.pendingBlockContents.length > 0) {
      this.mineOneBlock();
    }
    console.log("No Block Contents to Mine!");
    return;
  }

  /**
   * Takes all the pending BlockContents, puts them in a Block and starts the
   * mining process.
   * @param {number} difficulty
   */
  mineOneBlock(difficulty) {
    const block = new Block({
      timestamp: Date.now(),
      blockContent: this.pendingBlockContents.shift(),
      previousHash: this.getLatestBlock().hash,
    });
    block.mineBlock(difficulty);

    console.log("Block successfully mined!");
    this.chain.push(block);
  }

  /**
   * Add a new BlockContent to the list of pending BlockContents (to be added
   * next time the mining process starts).
   *
   * @param {string} blockContent
   */
  addBlockContent(blockContent) {
    this.pendingBlockContents.push(blockContent);
    console.log(`block content added: ${blockContent}`);
  }

  /**
   * Loops over all the blocks in the chain and verify if they are properly
   * linked together and nobody has tampered with the hashes.
   *
   * @returns {boolean}
   */
  isChainValid() {
    // Check if the Genesis block hasn't been tampered with by comparing
    // the output of createGenesisBlock with the first block on our chain
    const realGenesis = JSON.stringify(this.createGenesisBlock());

    if (realGenesis !== JSON.stringify(this.chain[0])) {
      return false;
    }

    // Check the remaining blocks on the chain to see if there hashes and
    // signatures are correct
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (previousBlock.hash !== currentBlock.previousHash) {
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
    }

    return true;
  }
}

module.exports.Blockchain = Blockchain;
module.exports.Block = Block;
