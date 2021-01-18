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
    bridgeGenerateDepositAddress(): Promise<any>;
    bridgeGetHistory(): Promise<any>;
    bridgeRetryHistory({ id, decentralized, walletAddress, addressType, currencyType, userPaymentAddress, privacyTokenAddress, erc20TokenAddress, outChainTx, }: {
        id: number;
        decentralized: number;
        walletAddress: string;
        addressType: number;
        currencyType: number;
        userPaymentAddress: string;
        privacyTokenAddress: string;
        erc20TokenAddress: string;
        outChainTx: string;
    }): Promise<any>;
    bridgeRemoveHistory({ id, currencyType, decentralized, }: {
        id: number;
        currencyType: number;
        decentralized: number;
    }): Promise<any>;
    bridgeWithdrawEstUserFee({ requestedAmount, incognitoAmount, paymentAddress, memo, }: {
        requestedAmount: string;
        incognitoAmount: string;
        paymentAddress: string;
        memo?: string;
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
    bridgeWithdrawCentralized({ burningTxId, userFeeSelection, userFeeLevel, tempAddress, privacyFee, nativeFee, }: {
        burningTxId: string;
        userFeeSelection: number;
        userFeeLevel: number;
        tempAddress: string;
        privacyFee?: string;
        nativeFee?: string;
    }): Promise<any>;
    bridgeWithdrawDecentralized({ incognitoAmount, requestedAmount, paymentAddress, burningTxId, userFeeId, userFeeSelection, userFeeLevel, }: {
        incognitoAmount: string;
        requestedAmount: string;
        paymentAddress: string;
        burningTxId: string;
        userFeeId: string;
        userFeeSelection: number;
        userFeeLevel: number;
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