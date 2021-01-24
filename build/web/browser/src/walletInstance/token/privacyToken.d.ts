import Token from "./token";
import PrivacyTokenModel from "../../models/token/privacyToken";
import AccountKeySetModel from "../../models/key/accountKeySet";
import PaymentInfoModel from "../../models/paymentInfo";
import PrivacyTokenApiModel, { BridgeInfoInterface } from "../../models/bridge/privacyTokenApi";
interface PrivacyTokenParam {
    privacyTokenApi: PrivacyTokenApiModel;
    accountKeySet: AccountKeySetModel;
}
declare class PrivacyToken extends Token implements PrivacyTokenModel {
    tokenId: string;
    name: string;
    symbol: string;
    isPrivacyToken: boolean;
    totalSupply: string;
    bridgeInfo: BridgeInfoInterface;
    constructor({ accountKeySet, privacyTokenApi }: PrivacyTokenParam);
    get bridgeErc20Token(): boolean;
    get bridgeEthereum(): boolean;
    get bridgeBinance(): boolean;
    get bridgeBEP2(): boolean;
    get bridgeDecentralized(): boolean;
    get bridgeDecentralizedNumber(): 0 | 1;
    hasExchangeRate(): Promise<boolean>;
    getNativeAvailableCoins(): Promise<import("../../models/coin").default[]>;
    transfer({ paymentInfoList, nativeFee, privacyFee, memo, }: {
        paymentInfoList: PaymentInfoModel[];
        nativeFee?: string;
        privacyFee?: string;
        memo?: string;
    }): Promise<import("../../..").TxHistoryModel>;
    pdeContribution(pdeContributionPairID: string, contributedAmount: string, nativeFee: string, privacyFee: string): Promise<import("../../..").TxHistoryModel>;
    requestTrade(tokenIdBuy: TokenIdType, sellAmount: string, minimumAcceptableAmount: string, nativeFee: string, privacyFee: string, tradingFee: string): Promise<import("../../..").TxHistoryModel>;
    getEstFeeFromNativeFee({ nativeFee }: {
        nativeFee: number;
    }): Promise<any>;
    bridgeGenerateDepositAddress({ signPublicKey, }: {
        signPublicKey?: string;
    }): Promise<any>;
    bridgeGetHistory({ signPublicKey }: {
        signPublicKey?: string;
    }): Promise<any>;
    bridgeRetryHistory({ id, addressType, privacyTokenAddress, erc20TokenAddress, outChainTx, signPublicKey, }: {
        id: number;
        addressType: number;
        privacyTokenAddress: string;
        erc20TokenAddress: string;
        outChainTx: string;
        signPublicKey?: string;
    }): Promise<any>;
    bridgeRemoveHistory({ id, signPublicKey, }: {
        id: number;
        signPublicKey?: string;
    }): Promise<any>;
    bridgeGetHistoryById({ signPublicKey, historyId, }: {
        signPublicKey?: string;
        historyId: number;
    }): Promise<any>;
    bridgeWithdrawEstUserFee({ requestedAmount, incognitoAmount, paymentAddress, memo, signPublicKey, }: {
        requestedAmount: string;
        incognitoAmount: string;
        paymentAddress: string;
        memo?: string;
        signPublicKey?: string;
    }): Promise<any>;
    bridgeBurningDecentralized({ outchainAddress, burningAmount, nativeFee, privacyFee, privacyPaymentInfoList, nativePaymentInfoList, memo, }: {
        outchainAddress: string;
        burningAmount: string;
        nativeFee: string;
        privacyFee: string;
        privacyPaymentInfoList: PaymentInfoModel[];
        nativePaymentInfoList?: PaymentInfoModel[];
        memo?: string;
    }): Promise<import("../../..").TxHistoryModel>;
    bridgeBurningCentralized({ privacyPaymentInfoList, nativePaymentInfoList, nativeFee, privacyFee, memo, }: {
        privacyPaymentInfoList: PaymentInfoModel[];
        nativePaymentInfoList?: PaymentInfoModel[];
        nativeFee?: string;
        privacyFee?: string;
        memo?: string;
    }): Promise<import("../../..").TxHistoryModel>;
    bridgeWithdrawCentralized({ burningTxId, userFeeSelection, userFeeLevel, tempAddress, privacyFee, nativeFee, signPublicKey, }: {
        burningTxId: string;
        userFeeSelection: number;
        userFeeLevel: number;
        tempAddress: string;
        privacyFee?: string;
        nativeFee?: string;
        signPublicKey?: string;
    }): Promise<any>;
    bridgeWithdrawDecentralized({ incognitoAmount, requestedAmount, paymentAddress, burningTxId, userFeeId, userFeeSelection, userFeeLevel, signPublicKey, }: {
        incognitoAmount: string;
        requestedAmount: string;
        paymentAddress: string;
        burningTxId: string;
        userFeeId: string;
        userFeeSelection: number;
        userFeeLevel: number;
        signPublicKey?: string;
    }): Promise<any>;
    bridgeWithdrawCheckValAddress({ address }: {
        address: string;
    }): Promise<any>;
    bridgeGetMinMaxWithdraw(): Promise<{
        minAmount: any;
        maxAmount: any;
    }>;
}
export default PrivacyToken;
//# sourceMappingURL=privacyToken.d.ts.map