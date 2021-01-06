/// <reference types="node" />
import BaseModel from "./baseModel";
import MasterAccountModel from "./account/masterAccount";
declare class WalletModel extends BaseModel {
    seed: Buffer;
    mnemonic: string;
    masterAccount: MasterAccountModel;
    name: string;
    constructor();
}
export default WalletModel;
//# sourceMappingURL=wallet.d.ts.map