import KeyWalletModel from "../../models/key/keyWallet";
export declare function generatePrivateKey(seed: any): KeyBytes;
export declare function generatePublicKey(privateKey: KeyBytes): KeyBytes;
export declare function generateReceivingKey(privateKey: KeyBytes): KeyBytes;
export declare function generateTransmissionKey(receivingKey: KeyBytes): KeyBytes;
export declare function generateCommitteeKeyFromHashPrivateKey(hashPrivateKeyBytes: Uint8Array, publicKeyBytes: Uint8Array): Promise<string>;
export declare function generateBLSPubKeyB58CheckEncodeFromSeed(seed: number[]): Promise<string>;
export declare function generateMasterKey(seed: Uint8Array): KeyWalletModel;
//# sourceMappingURL=generator.d.ts.map