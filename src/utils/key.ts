import { checkDecode } from "./base58";

export function getKeyBytes(keyStr: string) {
  const keyBytes = checkDecode(keyStr).bytesDecoded;
  const keyType = keyBytes[0];
  return {keyType, keyBytes};
}

export function extractPaymentAddressKey(keyBytes: KeyBytes) {
  const publicKeyLength = keyBytes[1];
  const publicKeyBytes = keyBytes.slice(2, 2 + publicKeyLength);

  const transmisionKeyLength = keyBytes[publicKeyLength + 2];
  const transmissionKeyBytes = keyBytes.slice(publicKeyLength + 3, publicKeyLength + 3 + transmisionKeyLength);

  return {publicKeyBytes, transmissionKeyBytes};
}

export function extractPrivateKey(keyBytes: KeyBytes) {
  const depth = keyBytes[1];
  const childNumber = keyBytes.slice(2, 6);
  const chainCode = keyBytes.slice(6, 38);
  const keyLength = keyBytes[38];

  return {
    depth,
    childNumber,
    chainCode,
    keyLength
  };
}

export function extractViewingKey(keyBytes: KeyBytes) {
  const publicKeyLength = keyBytes[1];
  const publicKeyBytes = keyBytes.slice(2, 2 + publicKeyLength);

  const receivingKeyLength = keyBytes[publicKeyLength + 2];
  const receivingKeyBytes = keyBytes.slice(publicKeyLength + 3, publicKeyLength + 3 + receivingKeyLength);
  
  return {publicKeyBytes, receivingKeyBytes};
}