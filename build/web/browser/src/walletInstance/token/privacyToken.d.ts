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
    hasExchangeRate(): Promise<boolean>;
    getNativeAvailableCoins(): Promise<import("../../models/coin").default[]>;
    transfer({ paymentInfoList, nativeFee, privacyFee, memo, }: {
        paymentInfoList: PaymentInfoModel[];
        nativeFee?: string;
        privacyFee?: string;
        memo?: string;
    }): Promise<import("../../..").TxHistoryModel>;
    burning(outchainAddress: string, burningAmount: string, nativeFee: string, privacyFee: string): Promise<import("../../..").TxHistoryModel>;
    pdeContribution(pdeContributionPairID: string, contributedAmount: string, nativeFee: string, privacyFee: string): Promise<import("../../..").TxHistoryModel>;
    requestTrade(tokenIdBuy: TokenIdType, sellAmount: string, minimumAcceptableAmount: string, nativeFee: string, privacyFee: string, tradingFee: string): Promise<import("../../..").TxHistoryModel>;
    /**
     * Convert your crypto from other chains to privacy version from the Incognito chain - private 100%.
     * This method will generate a temporary address, this temp address will be expired in 60 minutes.
     * Then, send/transfer you crypto to this temp address, the process will be completed in several minutes.
     * Use `bridgeGetHistory` method to check the histories.
     */
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
    bridgeGetHistoryById({ id, currencyType, }: {
        id: string;
        currencyType: number;
    }): Promise<any>;
    private bridgeWithdrawCentralized;
    private bridgeWithdrawDecentralized;
    /**
     * Convert privacy token to origin, your privacy token will be burned and the origin will be returned
     * @param {number} decimalAmount accept amount in decimal number (ex: 1.2 ETH, 0.5 BTC,...)
     * @note aaa
     */
    bridgeWithdraw(outchainAddress: string, decimalAmount: string, nativeFee?: string, privacyFee?: string, memo?: string): Promise<void>;
}
export default PrivacyToken;
//# sourceMappingURL=privacyToken.d.ts.map