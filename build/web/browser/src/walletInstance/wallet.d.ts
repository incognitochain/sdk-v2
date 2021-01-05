/// <reference types="node" />
import WalletModel from "../models/wallet";
import { MasterAccount } from "./account";
declare class Wallet implements WalletModel {
    seed: Buffer;
    mnemonic: string;
    masterAccount: MasterAccount;
    name: string;
    constructor();
    static restore(encryptedWallet: string, password: string): Promise<Wallet>;
    init(name?: string): Promise<this>;
    restore(name: string, mnemonic: string, seed: Buffer, masterAccount: MasterAccount): Promise<void>;
    import(name: string, mnemonic: string): Promise<void>;
    isIncorrectBIP44(): Promise<boolean>;
    backup(password: string): string;
}
export default Wallet;
//# sourceMappingURL=wallet.d.ts.map