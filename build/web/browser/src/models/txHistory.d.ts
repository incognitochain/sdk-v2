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
    decentralizedWithdrawData?: IDecentralizedWithdrawData;
    centralizedWithdrawData?: ICentralizedWithdrawData;
}
export interface IDecentralizedWithdrawData {
    incognitoAmount: string;
    requestedAmount: string;
    paymentAddress: string;
    burningTxId: string;
    userFeeId: string;
    userFeeSelection: number;
    userFeeLevel: number;
}
export interface ICentralizedWithdrawData {
    burningTxId: string;
    userFeeSelection: number;
    userFeeLevel: number;
    tempAddress: string;
    privacyFee?: string;
    nativeFee?: string;
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
    decentralizedWithdrawData?: IDecentralizedWithdrawData;
    centralizedWithdrawData?: ICentralizedWithdrawData;
    constructor({ txId, txType, lockTime, status, nativeTokenInfo, privacyTokenInfo, meta, accountPublicKeySerialized, historyType, memo, decentralizedWithdrawData, centralizedWithdrawData, }: TxHistoryModelParam);
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
        decentralizedWithdrawData: IDecentralizedWithdrawData;
        centralizedWithdrawData: ICentralizedWithdrawData;
    };
}
export {};
//# sourceMappingURL=txHistory.d.ts.map