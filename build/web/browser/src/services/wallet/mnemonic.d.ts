/// <reference types="node" />
declare class MnemonicGenerator {
    constructor();
    newEntropy(bitSize: number): any;
    newMnemonic(entropy: any): string;
    padByteSlice(slice: any, lenght: any): any;
    addChecksum(data: any): number[];
    computeChecksum(data: any): number[];
    newSeed(mnemonic: any, password: any): Buffer;
}
export { MnemonicGenerator };
//# sourceMappingURL=mnemonic.d.ts.map