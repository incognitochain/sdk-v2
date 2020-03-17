/**
 * @return {number}
 */
declare function getShardIDFromLastByte(lastByte: number): number;
declare function convertHashToStr(hash: Uint8Array): string;
declare function byteToHexString(uint8arr: Uint8Array): string;
declare function hexStringToByte(str: string): Uint8Array;
declare function newHashFromStr(str: string): Uint8Array;
declare function base64ArrayBuffer(arrayBuffer: any): string;
declare function convertDecimalToNanoAmount(decimalAmount: number, decimals: number): number;
export { convertDecimalToNanoAmount, getShardIDFromLastByte, newHashFromStr, convertHashToStr, hexStringToByte, byteToHexString, base64ArrayBuffer };
//# sourceMappingURL=common.d.ts.map