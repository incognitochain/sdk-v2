import { ED25519_KEY_SIZE } from '@src/constants/constants';
import { convertUint8ArrayToArray } from './utils';
import goMethods from '../go';

const { base64Decode, base64Encode } = require('./utils');

// publicKeyBytes is public key encryption, it is a 32-byte array
// msg is a bytes array 
// returns ciphertext in bytes array 
async function hybridEncryption(publicKeyBytes: KeyBytes, msgBytes: ArrayLike<number>) {
  let dataBytes = new Uint8Array(publicKeyBytes.length + msgBytes.length);
  dataBytes.set(publicKeyBytes, 0);
  dataBytes.set(msgBytes, ED25519_KEY_SIZE);
  let dataEncoded = base64Encode(convertUint8ArrayToArray(dataBytes));

  if (typeof goMethods.hybridEncryptionASM === 'function') {
    let ciphertextEncoded = await goMethods.hybridEncryptionASM(dataEncoded);

    let ciphertextBytes = base64Decode(ciphertextEncoded);
    return ciphertextBytes;
  } else {
    throw new Error('Can not encrypt message with public key');
  }
}

// publicKeyBytes is public key encryption, it is a 32-byte array
// msg is a bytes array  
// returns plaintext in bytes array
async function hybridDecryption(privateKeyBytes: KeyBytes, ciphertextBytes: ArrayLike<number>) {
  let dataBytes = new Uint8Array(privateKeyBytes.length + ciphertextBytes.length);
  dataBytes.set(privateKeyBytes, 0);
  dataBytes.set(ciphertextBytes, ED25519_KEY_SIZE);
  let dataEncoded = base64Encode(convertUint8ArrayToArray(dataBytes));

  if (typeof goMethods.hybridDecryptionASM === 'function') {
    let plainTextEncoded = await goMethods.hybridDecryptionASM(dataEncoded);
    if (plainTextEncoded === null){
      throw new Error('Can not decrypt message with private key');
    }
    let plainTextBytes = base64Decode(plainTextEncoded);
    return plainTextBytes;
  } else {
    throw new Error('Can not find hybridDecryptionASM function');
  }
}

export {
  hybridEncryption, hybridDecryption
};