/// <reference types="node" />
import KeyWalletModel from "../../models/key/keyWallet";
export declare function generatePrivateKey(seed: Buffer): Promise<KeyBytes>;
export declare function generatePublicKey(privateKey: KeyBytes): Promise<KeyBytes>;
export declare function generateReceivingKey(privateKey: KeyBytes): Promise<KeyBytes>;
export declare function generateTransmissionKey(receivingKey: KeyBytes): Promise<KeyBytes>;
export declare function generateCommitteeKeyFromHashPrivateKey(hashPrivateKeyBytes: Uint8Array, publicKeyBytes: Uint8Array): Promise<string>;
export declare function generateBLSPubKeyB58CheckEncodeFromSeed(seed: number[]): Promise<string>;
export declare function generateKey(seed: Buffer, index?: number, depth?: number): Promise<KeyWalletModel>;
//# sourceMappingURL=generator.d.ts.map