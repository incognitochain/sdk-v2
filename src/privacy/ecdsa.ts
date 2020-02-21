import elliptic from 'elliptic';
import { hashKeccakBytesToBytes } from './utils';

const secp256k1 = new elliptic.ec('secp256k1');

// generateECDSAKeyPair generates ECDSA key pair from seed
function generateECDSAKeyPair(seed: any) {
  let hash = hashKeccakBytesToBytes(seed);
  let keyPair = secp256k1.keyFromPrivate(hash);
  let privateKey = keyPair.getPrivate();
  let publicKey = keyPair.getPublic();

  return {
    ecdsaPrivateKey: privateKey.toArray(),
    ecdsaPublicKey: publicKey.encodeCompressed()
  };
}

export {
  generateECDSAKeyPair,
};