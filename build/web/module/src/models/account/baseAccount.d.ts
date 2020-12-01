import BaseModel from "../baseModel";
import KeyWalletModel from "../key/keyWallet";
declare class BaseAccountModel extends BaseModel {
    name: string;
    key: KeyWalletModel;
    constructor(name: string, key: KeyWalletModel);
}
export default BaseAccountModel;
//# sourceMappingURL=baseAccount.d.ts.map