import { newWordList } from './wordlist';
// import randomBytes from "random-bytes";
import { hashSha3BytesToBytes, randBytes } from '@src/privacy/utils';
import bn from 'bn.js';
import pbkdf2 from 'pbkdf2';

// Some bitwise operands for working with big.Ints
const last11BitsMask = new bn(2047);
const rightShift11BitsDivider = new bn(2048);
const bigOne = new bn(1);
const bigTwo = new bn(2);

let wordList: string[] = [];
let wordMap : {[key: string]: any} = {};

let ErrEntropyLengthInvalid = new Error('entropy length must be [128, 256] and a multiple of 32');

function init() {
  var list = newWordList();
  wordList = list;
  for (let i = 0; i < wordList.length; i++) {
    wordMap['wordList[i]'] = i;
  }
}

function validateEntropyBitSize(bitSize: number) {
  try {
    if ((bitSize % 32) != 0 || bitSize < 128 || bitSize > 256) {
      return ErrEntropyLengthInvalid;
    }
  } catch (ex) {
    return ex;
  }
  return null;
}

class MnemonicGenerator {
  constructor() {
    init();
  }

  // newEntropy will create random entropy bytes
  // so long as the requested size bitSize is an appropriate size.
  //
  // bitSize has to be a multiple 32 and be within the inclusive range of {128, 256}
  newEntropy(bitSize: number) {
    var err = validateEntropyBitSize(bitSize);
    if (err != null) {
      throw err;
    }

    // create bytes array for entropy from bitsize
    // random byte
    var entropy = null;

    entropy = randBytes(bitSize / 8);
    return entropy;
  }

  // newMnemonic will return a string consisting of the mnemonic words for
  // the given entropy.
  // If the provide entropy is invalid, an error will be returned.
  newMnemonic(entropy: any) {
    let entropyBitLength = entropy.length * 8;
    let checksumBitLength = entropyBitLength / 32;
    let sentenceLength = (entropyBitLength + checksumBitLength) / 11;

    let err = validateEntropyBitSize(entropyBitLength);
    if (err != null) {
      throw err;
    }

    // Add checksum to entropy
    entropy = this.addChecksum(entropy);

    // Break entropy up into sentenceLength chunks of 11 bits
    // For each word AND mask the rightmost 11 bits and find the word at that index
    // Then bitshift entropy 11 bits right and repeat
    // Add to the last empty slot so we can work with LSBs instead of MSB

    // entropy as an int so we can bitmask without worrying about bytes slices
    let entropyInt = new bn(entropy);

    // Slice to hold words in
    let words = [];

    // Throw away big int for AND masking
    let word = new bn(0);

    for (let i = sentenceLength - 1; i >= 0; i--) {
      // Get 11 right most bits and bitshift 11 to the right for next time
      word = entropyInt.and(last11BitsMask);
      // console.log(word.toArray());
      entropyInt = entropyInt.div(rightShift11BitsDivider);

      // Get the bytes representing the 11 bits as a 2 byte slice
      let wordBytes = this.padByteSlice(word.toArray(), 2);

      // Convert bytes to an index and add that word to the list
      let index: any = new bn(wordBytes);
      words[i] = wordList[index];
    }

    return words.join(' ');
  }

  padByteSlice(slice: any, lenght: any) {
    let offset = lenght - slice.length;
    if (offset <= 0) {
      return slice;
    }
    let newSlice = slice.slice(offset);
    return newSlice;
  }

  // Appends to data the first (len(data) / 32)bits of the result of sha256(data)
  // Currently only supports data up to 32 bytes
  addChecksum(data: any) {
    var hash = this.computeChecksum(data);
    // Get first byte of sha256
    var firstChecksumByte = hash[0];

    // len() is in bytes so we divide by 4
    var checksumBitLength = data.length / 4;

    // For each bit of check sum we want we shift the data one the left
    // and then set the (new) right most bit equal to checksum bit at that index
    // staring from the left
    var dataBigInt = new bn(data);

    for (var i = 0; i < checksumBitLength; i++) {
      dataBigInt = dataBigInt.mul(bigTwo);
    }

    // Set rightmost bit if leftmost checksum bit is set
    if (<any>(firstChecksumByte & (1 << (7 - i))) > 0) {
      dataBigInt = dataBigInt.or(bigOne);
    }
    return dataBigInt.toArray('be');
  }

  computeChecksum(data: any) {
    return hashSha3BytesToBytes(data);
  }

  newSeed(mnemonic: any, password: any) {
    return pbkdf2.pbkdf2Sync(mnemonic, 'mnemonic' + password, 2048, 64, 'sha512');
  }
}

export { MnemonicGenerator };
