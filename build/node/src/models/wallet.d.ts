import BaseModel from "./baseModel";
import MasterAccountModel from "./account/masterAccount";
declare class WalletModel extends BaseModel {
    seed: Uint8Array;
    entropy: number[];
    passPhrase: string;
    mnemonic: string;
    masterAccount: MasterAccountModel;
    name: string;
    constructor();
}
export default WalletModel;
//# sourceMappingURL=wallet.d.ts.map