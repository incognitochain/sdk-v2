import BaseAccountModel from "../../models/account/baseAccount";
import KeyWalletModel from "../../models/key/keyWallet";
interface BaseAccountInterface extends BaseAccountModel {
}
declare class BaseAccount implements BaseAccountInterface {
    name: string;
    key: KeyWalletModel;
    constructor(name: string);
    serializeKeys(): void;
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
    };
}
export default BaseAccount;
//# sourceMappingURL=baseAccount.d.ts.map