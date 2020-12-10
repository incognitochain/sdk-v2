/// <reference types="node" />
import WalletModel from "../models/wallet";
import { MasterAccount } from "./account";
declare class Wallet implements WalletModel {
    seed: Buffer;
    passPhrase: string;
    mnemonic: string;
    masterAccount: MasterAccount;
    name: string;
    constructor();
    static restore(encryptedWallet: string, password: string): Promise<Wallet>;
    init(passPhrase: string, name?: string): Promise<this>;
    import(name: string, passPhrase: string, mnemonic: string, seed: Buffer, masterAccount: MasterAccount): Promise<void>;
    isIncorrectBIP44(): Promise<boolean>;
    backup(password: string): string;
}
export default Wallet;
//# sourceMappingURL=wallet.d.ts.map