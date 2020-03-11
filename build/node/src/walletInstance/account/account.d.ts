import BaseAccount from "./baseAccount";
import { NativeToken, PrivacyToken } from "../token";
import AccountModel from "../../models/account/account";
import KeyWalletModel from "../../models/key/keyWallet";
interface AccountModelInterface extends AccountModel {
    nativeToken: NativeToken;
}
interface IssuePrivacyTokenInterface {
    tokenName: string;
    tokenSymbol: string;
    supplyAmount: number;
    nativeTokenFee: number;
}
declare class Account extends BaseAccount implements AccountModelInterface {
    isImport: boolean;
    nativeToken: NativeToken;
    privacyTokenIds: string[];
    private _blsPublicKeyB58CheckEncode;
    constructor(name: string, key: KeyWalletModel, isImport: boolean);
    static restoreFromBackupData(data: any): Account;
    init(): void;
    getBLSPublicKeyB58CheckEncode(): Promise<string>;
    followTokenById(tokenId: TokenIdType): void;
    unfollowTokenById(tokenId: TokenIdType): void;
    issuePrivacyToken({ tokenName, tokenSymbol, supplyAmount, nativeTokenFee }: IssuePrivacyTokenInterface): Promise<import("../../..").TxHistoryModel>;
    /**
     * Find by tokenId or all if tokenId is null
     * @param {*} tokenId
     */
    getFollowingPrivacyToken(tokenId: TokenIdType): Promise<PrivacyToken | PrivacyToken[]>;
    getBackupData(): {
        name: string;
        key: {
            chainCode: number[];
            childNumber: number[];
            depth: number;
            keySet: {
                publicKeyBytes: number[];
                transmissionKeyBytes: number[];
                privateKeyBytes: number[];
                receivingKeyBytes: number[];
            };
        };
        privacyTokenIds: string[];
        isImport: boolean;
    };
    getNodeRewards(): Promise<any>;
    getNodeStatus(): Promise<any>;
}
export default Account;
//# sourceMappingURL=account.d.ts.map