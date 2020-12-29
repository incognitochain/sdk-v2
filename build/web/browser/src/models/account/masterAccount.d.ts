import BaseAccountModel from "./baseAccount";
import AccountModel from "./account";
import KeyWalletModel from "../key/keyWallet";
declare class MasterAccountModel extends BaseAccountModel {
    child: AccountModel[];
    constructor(name: string, key: KeyWalletModel, child: AccountModel[]);
}
export default MasterAccountModel;
//# sourceMappingURL=masterAccount.d.ts.map