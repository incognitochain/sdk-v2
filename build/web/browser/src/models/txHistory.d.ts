import PaymentInfoModel from './paymentInfo';
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
    devInfo?: any;
}
export declare class TxHistoryModel {
    txId: string;
    txType: string;
    lockTime: number;
    status: number;
    nativeTokenInfo: NativeTokenHistoryInfo;
    privacyTokenInfo: PrivacyTokenHistoryInfo;
    meta: any;
    accountPublicKeySerialized: string;
    devInfo: any;
    constructor({ txId, txType, lockTime, status, nativeTokenInfo, privacyTokenInfo, meta, accountPublicKeySerialized, devInfo }: TxHistoryModelParam);
    toJson(): {
        txId: string;
        txType: string;
        lockTime: number;
        status: number;
        nativeTokenInfo: NativeTokenHistoryInfo;
        privacyTokenInfo: PrivacyTokenHistoryInfo;
        meta: any;
        accountPublicKeySerialized: string;
        devInfo: any;
    };
}
export {};
//# sourceMappingURL=txHistory.d.ts.map