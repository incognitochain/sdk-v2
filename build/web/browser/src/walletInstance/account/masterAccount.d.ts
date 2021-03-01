/// <reference types="node" />
import BaseAccount from "./baseAccount";
import MasterAccountModel from "../../models/account/masterAccount";
import Account from "./account";
interface MasterAccountInterface extends MasterAccountModel {
}
declare class MasterAccount extends BaseAccount implements MasterAccountInterface {
    seed: Buffer;
    child: Account[];
    deletedIndexes: number[];
    constructor(name: string, seed: Buffer);
    static restoreFromBackupData(data: any, seed: Buffer): MasterAccount;
    init(): Promise<this>;
    getAccountByName(name: string): Account;
    getAccountByPrivateKey(privateKeySerialized: string): Account;
    addAccount(name: string, shardId?: number, index?: number, depth?: number): Promise<Account | any>;
    removeAccount(name: string): void;
    getAccounts(): Account[];
    createAccountByPrivateKey(name: string, privateKey: string): Promise<Account>;
    importAccount(name: string, privateKey: string): Promise<Account>;
    getBackupData(): {
        deletedIndexes: number[];
        name: string;
        key: {
            chainCode: number[];
            childNumber: number[];
            depth: number;
            keySet: {
                publicKeyBytes: number[];
                transmissionKeyBytes: number[];
                privateKeyBytes: number[];
                receivingKeyBytes: number[];
            };
        };
        child: {
            name: string;
            key: {
                chainCode: number[];
                childNumber: number[];
                depth: number;
                keySet: {
                    publicKeyBytes: number[];
                    transmissionKeyBytes: number[];
                    privateKeyBytes: number[];
                    receivingKeyBytes: number[];
                };
            };
            privacyTokenIds: string[];
            isImport: boolean;
        }[];
    };
    createAccountWithIndex({ name, index, }: {
        name: string;
        index: number;
    }): Promise<Account | any>;
}
export default MasterAccount;
//# sourceMappingURL=masterAccount.d.ts.map