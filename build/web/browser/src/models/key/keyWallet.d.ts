import BaseModel from "../baseModel";
import AccountKeySetModel from "./accountKeySet";
declare class KeyWalletModel extends BaseModel {
    depth: number;
    childNumber: Uint8Array;
    chainCode: Uint8Array;
    keySet: AccountKeySetModel;
    constructor();
}
export default KeyWalletModel;
//# sourceMappingURL=keyWallet.d.ts.map