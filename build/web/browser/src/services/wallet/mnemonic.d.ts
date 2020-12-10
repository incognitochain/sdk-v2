/// <reference types="node" />
declare function newMnemonic(): string;
declare function newSeed(mnemonic: string): Buffer;
declare function validateMnemonic(mnemonic: string): boolean;
export { newMnemonic, newSeed, validateMnemonic, };
//# sourceMappingURL=mnemonic.d.ts.map