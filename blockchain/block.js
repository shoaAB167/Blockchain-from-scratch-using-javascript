
const { DIFFICULTY, MINE_RATE } = require('../config');
//const SHA256 = require('crypto-js/sha256');
const ChainUtil = require('../chain-util');

class Block{
    constructor(timestamp,lastHash,hash,data,nonce, difficulty){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;//or for first block 
    }

    toString(){
        //back stick use to return template string
        return `Block - 
        Timestamp: ${this.timestamp}
        Last Hash: ${this.lastHash.substring(0,10)}
        Hash     : ${this.hash.substring(0,10)}
        Nonce    : ${this.nonce}
        Data     : ${this.data}
        Difficulty: ${this.difficulty}`;
    }

    static genesis(){
        return new this("Genesis time", "----", "f1r57-h45h", [], 0, DIFFICULTY);
    }

    static mineBlock(lastBlock, data){
        const lastHash = lastBlock.hash;
	    let hash, timestamp;
        let {difficulty} = lastBlock;
	    let nonce = 0;

	do {
        //proof of work
        nonce++;
        timestamp = Date.now();
        difficulty = Block.adjustDifficulty(lastBlock, timestamp);
        hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));
        
        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }



    static hash(timestamp, lastHash, data, nonce, difficulty) {
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`);
      }

    static blockHash(block) {
        const { timestamp, lastHash, data, nonce, difficulty } = block;
      return Block.hash(timestamp, lastHash, data, nonce, difficulty);
    }

    static adjustDifficulty(lastBlock, currentTime) {
        let { difficulty } = lastBlock;
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
      return difficulty;
    }

      

}

module.exports = Block;