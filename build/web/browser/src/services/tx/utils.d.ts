import bn from 'bn.js';
import PaymentInfoModel from "../../models/paymentInfo";
import CoinModel from "../../models/coin";
import AccountKeySetModel from "../../models/key/accountKeySet";
import TxHistoryModel from "../../models/txHistory";
export interface TxInputType {
    inputCoinStrs: CoinModel[];
    totalValueInputBN: bn;
    commitmentIndices: number[];
    myCommitmentIndices: number[];
    commitmentStrs: string[];
}
export interface CreateHistoryParam {
    txId: string;
    lockTime: number;
    nativePaymentInfoList: PaymentInfoModel[];
    privacyPaymentInfoList?: PaymentInfoModel[];
    nativeFee: number;
    privacyFee?: number;
    tokenId?: TokenIdType;
    tokenSymbol?: TokenSymbolType;
    tokenName?: TokenNameType;
    nativeSpendingCoinSNs: string[];
    privacySpendingCoinSNs?: string[];
    nativeListUTXO: string[];
    privacyListUTXO?: string[];
    nativePaymentAmount: number;
    privacyPaymentAmount?: number;
    meta?: any;
    txType?: any;
    privacyTokenTxType?: any;
    accountPublicKeySerialized: string;
    historyType: number;
    usePrivacyForPrivacyToken?: boolean;
    usePrivacyForNativeToken: boolean;
}
/**
 * Parse number to bn (big number), min value is bn(0) (zero)
 * @param amount
 */
export declare function toBNAmount(amount: number): bn;
/**
 *
 * @param paymentInfoList
 */
export declare function getTotalAmountFromPaymentList(paymentInfoList: PaymentInfoModel[]): bn;
/**
 * Prepare data for sending native token
 *
 * @param accountKeySet Sender account ket set
 * @param availableNativeCoins  Sender's native coins use to spend
 * @param nativePaymentAmountBN Amount to send
 * @param nativeTokenFeeBN Fee to send (native fee)
 */
export declare function getNativeTokenTxInput(accountKeySet: AccountKeySetModel, availableNativeCoins: CoinModel[], nativePaymentAmountBN: bn, nativeTokenFeeBN: bn, usePrivacy?: boolean): Promise<TxInputType>;
/***
 * Prepare data for send privacy token
 *
 * @param accountKeySet Sender account ket set
 * @param availableNativeCoins  Sender's native coins use to spend
 * @param privacyPaymentAmountBN Amount to send
 * @param privacyTokenFeeBN Fee to send (privacy token fee)
 */
export declare function getPrivacyTokenTxInput(accountKeySet: AccountKeySetModel, privacyAvailableCoins: CoinModel[], tokenId: TokenIdType, privacyPaymentAmountBN: bn, privacyTokenFeeBN: bn, usePrivacy?: boolean): Promise<TxInputType>;
export declare function initTx(handler: Function, param: object): Promise<any>;
/**
 * Create output coins
 *
 * @param totalAmountToTransferBN Amount will be transfered
 * @param totalAmountToSpendBN Amount uses to send
 * @param paymentInfoList
 */
export declare function createOutputCoin(totalAmountToTransferBN: bn, totalAmountToSpendBN: bn, paymentInfoList: PaymentInfoModel[]): Promise<string[]>;
export declare function encryptPaymentMessage(paymentInfoList: PaymentInfoModel[]): PaymentInfoModel[];
export declare function sendB58CheckEncodeTxToChain(handler: Function, b58CheckEncodeTx: string): Promise<{
    txId: string;
}>;
export declare function getCoinInfoForCache(coins: CoinModel[]): {
    serialNumberList: string[];
    listUTXO: string[];
};
export declare function createHistoryInfo({ txId, lockTime, nativePaymentInfoList, privacyPaymentInfoList, nativePaymentAmount, privacyPaymentAmount, nativeFee, privacyFee, tokenId, tokenSymbol, tokenName, nativeSpendingCoinSNs, privacySpendingCoinSNs, nativeListUTXO, privacyListUTXO, meta, txType, privacyTokenTxType, accountPublicKeySerialized, historyType, usePrivacyForPrivacyToken, usePrivacyForNativeToken }: CreateHistoryParam): TxHistoryModel;
export declare function getBurningAddress(beaconHeight?: number): Promise<any>;
//# sourceMappingURL=utils.d.ts.map