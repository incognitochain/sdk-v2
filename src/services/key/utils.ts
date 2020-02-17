import CryptoJS from 'crypto-js';
import { checkSumFirst4Bytes } from '@src/utils/base58';

export function addChecksumToBytes(data: Uint8Array) {
  let checksum = checkSumFirst4Bytes(data);

  let res = new Uint8Array(data.length + 4);
  res.set(data, 0);
  res.set(checksum, data.length);
  return res;
}

export function wordToByteArray(word: any, length: number) {
  var ba = [],
    xFF = 0xFF;
  if (length > 0)
    ba.push(word >>> 24);
  if (length > 1)
    ba.push((word >>> 16) & xFF);
  if (length > 2)
    ba.push((word >>> 8) & xFF);
  if (length > 3)
    ba.push(word & xFF);

  return ba;
}

export function wordArrayToByteArray(wordArray: any, length?: number) {
  if (Object.hasOwnProperty.call(wordArray, 'sigBytes') && Object.hasOwnProperty.call(wordArray, 'words')) {
    length = wordArray.sigBytes;
    wordArray = wordArray.words;
  }

  var result = [],
    bytes,
    i = 0;
  while (length > 0) {
    bytes = wordToByteArray(wordArray[i], Math.min(4, length));
    length -= bytes.length;
    result.push(bytes);
    i++;
  }
  return [].concat.apply([], result);
}

export function byteArrayToWordArray(ba: Uint8Array) {
  var wa: any[] = [],
    i;
  for (i = 0; i < ba.length; i++) {
    wa[(i / 4) | 0] |= ba[i] << (24 - 8 * i);
  }

  return CryptoJS.lib.WordArray.create(wa);
}