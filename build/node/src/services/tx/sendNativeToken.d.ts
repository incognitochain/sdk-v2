import bn from 'bn.js';
import { TxInputType } from "./utils";
import PaymentInfoModel from "../../models/paymentInfo";
import AccountKeySetModel from "../../models/key/accountKeySet";
import CoinModel from "../../models/coin";
interface SendParam {
    accountKeySet: AccountKeySetModel;
    availableCoins: CoinModel[];
    nativePaymentInfoList: PaymentInfoModel[];
    nativeFee: number;
}
interface CreateNativeTxParam {
    nativeTxInput: TxInputType;
    nativePaymentInfoList: PaymentInfoModel[];
    nativeTokenFeeBN: bn;
    nativePaymentAmountBN: bn;
    privateKeySerialized: string;
    usePrivacyForNativeToken?: boolean;
    metaData?: any;
    initTxMethod: Function;
    customExtractInfoFromInitedTxMethod?(resInitTxBytes: Uint8Array): ({
        b58CheckEncodeTx: string;
        lockTime: number;
    });
}
export declare function extractInfoFromInitedTxBytes(resInitTxBytes: Uint8Array): {
    b58CheckEncodeTx: string;
    lockTime: number;
};
export declare function createTx({ nativeTokenFeeBN, nativePaymentAmountBN, nativeTxInput, nativePaymentInfoList, privateKeySerialized, usePrivacyForNativeToken, metaData, initTxMethod, customExtractInfoFromInitedTxMethod }: CreateNativeTxParam): Promise<{
    b58CheckEncodeTx: string;
    lockTime: number;
}>;
export default function sendNativeToken({ nativePaymentInfoList, nativeFee, accountKeySet, availableCoins }: SendParam): Promise<import("../../..").TxHistoryModel>;
export {};
//# sourceMappingURL=sendNativeToken.d.ts.map