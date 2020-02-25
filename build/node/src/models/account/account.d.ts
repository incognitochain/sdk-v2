import BaseAccountModel from "./baseAccount";
import NativeTokenModel from "../token/nativeToken";
import KeyWalletModel from "../key/keyWallet";
declare class AccountModel extends BaseAccountModel {
    isImport: boolean;
    nativeToken: NativeTokenModel;
    privacyTokenIds: string[];
    constructor(name: string, key: KeyWalletModel);
}
export default AccountModel;
//# sourceMappingURL=account.d.ts.map