import goMethods from '../go';
import { base64Decode, base64Encode } from './utils';

// seed is bytes array
async function generateBLSKeyPair(seed: any) {
  let seedStr = base64Encode(seed);

  if (typeof goMethods.generateBLSKeyPairFromSeed === 'function') {
    let keyPairEncoded = await goMethods.generateBLSKeyPairFromSeed(seedStr);
    let keyPairBytes = base64Decode(keyPairEncoded);

    let privateKey = keyPairBytes.slice(0, 32);
    let publicKey = keyPairBytes.slice(32);

    return {
      blsPrivateKey: privateKey,
      blsPublicKey: publicKey
    };
  } else {
    throw new ErrorCode('Can not generate bls key pair');
  }
}

export {
  generateBLSKeyPair
};

