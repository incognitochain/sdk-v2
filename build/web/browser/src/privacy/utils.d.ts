import bn from 'bn.js';
declare function setRandBytesFunc(f: Function): void;
declare function randBytes(n?: number): any;
declare function addPaddingBigInt(numInt: bn, fixedSize: number): number[];
declare function intToByteArr(n: number): number[];
declare function checkDuplicateBigIntArray(arr: any[]): boolean;
declare function convertIntToBinary(num: number, n: number): Uint8Array;
declare function convertBinaryToInt(binary: any): bn;
declare function hashSha3BytesToBytes(data: any): number[];
declare function hashKeccakBytesToBytes(data: any): number[];
declare function convertUint8ArrayToArray(data: any): any[];
declare function stringToBytes(str: any): any[];
declare function bytesToString(data: any): string;
declare function base64Decode(str: any): Uint8Array;
declare function base64Encode(bytesArray: any): string;
declare function toHexString(byteArray: any): string;
declare function pad(l: any): any;
export { addPaddingBigInt, intToByteArr, randBytes, checkDuplicateBigIntArray, convertIntToBinary, convertUint8ArrayToArray, stringToBytes, hashSha3BytesToBytes, setRandBytesFunc, base64Decode, base64Encode, convertBinaryToInt, hashKeccakBytesToBytes, toHexString, pad, bytesToString };
//# sourceMappingURL=utils.d.ts.map