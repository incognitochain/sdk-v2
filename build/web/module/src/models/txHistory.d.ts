import PaymentInfoModel from "./paymentInfo";
interface NativeTokenHistoryInfo {
    fee: number;
    amount: number;
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
interface TxHistoryModelParam {
    txId: string;
    txType: string;
    lockTime: number;
    status: number;
    nativeTokenInfo: NativeTokenHistoryInfo;
    privacyTokenInfo?: PrivacyTokenHistoryInfo;
    meta?: any;
    accountPublicKeySerialized: string;
    historyType?: number;
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
    constructor({ txId, txType, lockTime, status, nativeTokenInfo, privacyTokenInfo, meta, accountPublicKeySerialized, historyType }: TxHistoryModelParam);
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
    };
}
export {};
//# sourceMappingURL=txHistory.d.ts.map