import BaseAccount from "./baseAccount";
import MasterAccountModel from "../../models/account/masterAccount";
import Account from "./account";
interface MasterAccountInterface extends MasterAccountModel {
}
declare class MasterAccount extends BaseAccount implements MasterAccountInterface {
    child: Account[];
    constructor(name?: string);
    static restoreFromBackupData(data: any): MasterAccount;
    init(walletSeed: Uint8Array): Promise<this>;
    getAccountByName(name: string): Account;
    getAccountByPrivateKey(privateKeySerialized: string): Account;
    addAccount(name: string, shardId?: number): Promise<Account>;
    removeAccount(name: string): void;
    getAccounts(): Account[];
    importAccount(name: string, privateKey: string): Promise<Account>;
    getBackupData(): {
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
}
export default MasterAccount;
//# sourceMappingURL=masterAccount.d.ts.map