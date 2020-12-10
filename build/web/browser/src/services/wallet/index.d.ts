/// <reference types="node" />
export declare function setPrivacyUtilRandomBytesFunc(f: Function): void;
export declare function initWalletData(passPhrase: string): {
    mnemonic: string;
    seed: Buffer;
};
/**
  * Backup the wallet, encrypt with `password` (if not provided, use passPhrase instead), return a encrypted text
  * @param {string} password
  */
export declare function encryptWalletData(walletData: object, password: string): string;
export declare function decryptWalletData(encryptString: string, password: string): Promise<any>;
//# sourceMappingURL=index.d.ts.map