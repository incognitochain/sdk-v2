import WalletModel from "../models/wallet";
import { MasterAccount } from "./account";
declare class Wallet implements WalletModel {
    seed: Uint8Array;
    entropy: number[];
    passPhrase: string;
    mnemonic: string;
    masterAccount: MasterAccount;
    name: string;
    constructor();
    static restore(encryptedWallet: string, password: string): Promise<Wallet>;
    init(passPhrase: string, name?: string): Promise<this>;
    import(name: string, passPhrase: string, mnemonic: string, entropy: number[], seed: Uint8Array, masterAccount: MasterAccount): void;
    backup(password: string): string;
}
export default Wallet;
//# sourceMappingURL=wallet.d.ts.map