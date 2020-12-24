/// <reference types="node" />
declare function newMnemonic(): string;
declare function newSeed(mnemonic: string): Buffer;
declare function validateMnemonic(mnemonic: string): boolean;
export declare const mnemonicService: {
    newMnemonic: typeof newMnemonic;
    newSeed: typeof newSeed;
    validateMnemonic: typeof validateMnemonic;
};
export default mnemonicService;
//# sourceMappingURL=mnemonic.d.ts.map