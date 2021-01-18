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
    /**
     * Sync this wallet with the wallet stored on the api
     * This will get new keychains from the api (if have any)
     */
    sync(): Promise<void>;
    /**
     * This will update keychain list stored on api with this keychain list
     */
    update(): Promise<void>;
}
export default Wallet;
//# sourceMappingURL=wallet.d.ts.map