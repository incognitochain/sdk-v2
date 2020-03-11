import bn from 'bn.js';
import { TxInputType } from "./utils";
import PaymentInfoModel from "../../models/paymentInfo";
import AccountKeySetModel from "../../models/key/accountKeySet";
import CoinModel, { CoinRawData } from "../../models/coin";
interface TokenInfo {
    tokenId: TokenIdType;
    tokenSymbol: TokenSymbolType;
    tokenName: TokenNameType;
}
interface SendParam extends TokenInfo {
    accountKeySet: AccountKeySetModel;
    nativeAvailableCoins: CoinModel[];
    privacyAvailableCoins: CoinModel[];
    nativePaymentInfoList: PaymentInfoModel[];
    privacyPaymentInfoList: PaymentInfoModel[];
    nativeFee: number;
    privacyFee: number;
}
interface CreateTxParam extends TokenInfo {
    nativeTxInput: TxInputType;
    nativePaymentInfoList: PaymentInfoModel[];
    nativeTokenFeeBN: bn;
    privacyTxInput: TxInputType;
    privacyPaymentInfoList: PaymentInfoModel[];
    privacyTokenFeeBN: bn;
    privateKeySerialized: string;
    nativePaymentAmountBN: bn;
    privacyPaymentAmountBN: bn;
    privacyTokenParamAdditional?: PrivacyTokenParam;
    usePrivacyForNativeToken?: boolean;
    usePrivacyForPrivacyToken?: boolean;
    metaData?: any;
    initTxMethod: Function;
    customExtractInfoFromInitedTxMethod?(resInitTxBytes: Uint8Array): ({
        b58CheckEncodeTx: string;
        lockTime: number;
        tokenID?: TokenIdType;
    });
}
interface PrivacyTokenParam {
    propertyID?: TokenIdType;
    propertyName?: TokenNameType;
    propertySymbol?: TokenSymbolType;
    amount?: number;
    tokenTxType?: TokenTxType;
    fee?: number;
    paymentInfoForPToken?: PaymentInfoModel[];
    tokenInputs?: CoinRawData[];
}
export declare function extractInfoFromInitedTxBytes(resInitTxBytes: Uint8Array): {
    b58CheckEncodeTx: string;
    lockTime: number;
    tokenID: string;
};
export declare function createTx({ nativeTxInput, nativePaymentInfoList, nativeTokenFeeBN, nativePaymentAmountBN, privacyTxInput, privacyPaymentInfoList, privacyTokenFeeBN, privacyPaymentAmountBN, privateKeySerialized, tokenId, tokenName, tokenSymbol, privacyTokenParamAdditional, usePrivacyForNativeToken, usePrivacyForPrivacyToken, metaData, initTxMethod, customExtractInfoFromInitedTxMethod, }: CreateTxParam): Promise<{
    b58CheckEncodeTx: string;
    lockTime: number;
    tokenID?: string;
}>;
export default function sendPrivacyToken({ accountKeySet, nativeAvailableCoins, privacyAvailableCoins, nativePaymentInfoList, privacyPaymentInfoList, nativeFee, privacyFee, tokenId, tokenSymbol, tokenName }: SendParam): Promise<import("../../..").TxHistoryModel>;
export {};
//# sourceMappingURL=sendPrivacyToken.d.ts.map