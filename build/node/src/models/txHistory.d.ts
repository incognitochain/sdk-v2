import PaymentInfoModel from "./paymentInfo";
interface NativeTokenHistoryInfo {
    fee: string;
    amount: string;
    paymentInfoList: PaymentInfoModel[];
    usePrivacy: boolean;
    spendingCoinSNs: string[];
    listUTXO: string[];
}
interface PrivacyTokenHistoryInfo extends NativeTokenHistoryInfo {
    tokenId: TokenIdType;
    tokenName: TokenNameType;
    tokenSymbol: TokenSymbolType;
    privacyTokenTxType: number;
}
export interface TxHistoryModelParam {
    txId: string;
    txType: string;
    lockTime: number;
    status: number;
    nativeTokenInfo: NativeTokenHistoryInfo;
    privacyTokenInfo?: PrivacyTokenHistoryInfo;
    meta?: any;
    accountPublicKeySerialized: string;
    historyType?: number;
    memo?: string;
}
export default class TxHistoryModel {
    txId: string;
    txType: string;
    lockTime: number;
    status: number;
    nativeTokenInfo: NativeTokenHistoryInfo;
    privacyTokenInfo: PrivacyTokenHistoryInfo;
    meta: any;
    accountPublicKeySerialized: string;
    historyType: number;
    memo?: string;
    constructor({ txId, txType, lockTime, status, nativeTokenInfo, privacyTokenInfo, meta, accountPublicKeySerialized, historyType, memo, }: TxHistoryModelParam);
    toJson(): {
        txId: string;
        txType: string;
        lockTime: number;
        status: number;
        nativeTokenInfo: NativeTokenHistoryInfo;
        privacyTokenInfo: PrivacyTokenHistoryInfo;
        meta: any;
        accountPublicKeySerialized: string;
        historyType: number;
        memo: string;
    };
}
export {};
//# sourceMappingURL=txHistory.d.ts.map