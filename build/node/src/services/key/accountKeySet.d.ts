import AccountKeySetModel from "../../models/key/accountKeySet";
export declare function getKeySetFromPrivateKeyBytes(privateKeyBytes: KeyBytes): AccountKeySetModel;
export declare function getBLSPublicKeyB58CheckEncode(miningSeedKey: number[]): Promise<string>;
export declare function generateKeySet(seed: string): AccountKeySetModel;
export declare function getBackupData(keySet: AccountKeySetModel): {
    publicKeyBytes: number[];
    transmissionKeyBytes: number[];
    privateKeyBytes: number[];
    receivingKeyBytes: number[];
};
export declare function restoreKeySetFromBackupData(data: any): AccountKeySetModel;
//# sourceMappingURL=accountKeySet.d.ts.map