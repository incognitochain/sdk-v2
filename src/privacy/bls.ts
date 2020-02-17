import wasmMethods from '../wasm/methods';
import { base64Decode, base64Encode } from './utils';

// seed is bytes array
async function generateBLSKeyPair(seed: string) {
  let seedStr = base64Encode(seed);

  if (typeof wasmMethods.generateBLSKeyPairFromSeed === 'function') {
    let keyPairEncoded = await wasmMethods.generateBLSKeyPairFromSeed(seedStr);
    let keyPairBytes = base64Decode(keyPairEncoded);

    let privateKey = keyPairBytes.slice(0, 32);
    let publicKey = keyPairBytes.slice(32);

    return {
      blsPrivateKey: privateKey,
      blsPublicKey: publicKey
    };
  } else {
    throw new Error('Can not generate bls key pair');
  }
}

export {
  generateBLSKeyPair
};

