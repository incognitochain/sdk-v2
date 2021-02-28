/// <reference types="bn.js" />
import BaseTokenModel from "../../models/token/baseToken";
import AccountKeySetModel from "../../models/key/accountKeySet";
import PaymentInfoModel from "../../models/paymentInfo";
interface NativeTokenParam {
    tokenId: string;
    name: string;
    symbol: string;
    accountKeySet: AccountKeySetModel;
}
interface IPriorityList {
    key: string;
    tradingFee: number;
    number: number;
    gasPrice: number;
}
interface PriorityList {
    MEDIUM: IPriorityList;
    FAST: IPriorityList;
    FASTEST: IPriorityList;
}
export interface IQuote {
    maxAmountOut: number;
    maxAmountIn: number;
    expectAmount: string;
    protocol: string;
    dAppAddress: string;
    priorityList: PriorityList;
    network: string;
    crossTrade: boolean;
}
declare class Token implements BaseTokenModel {
    tokenId: string;
    name: string;
    symbol: string;
    accountKeySet: AccountKeySetModel;
    isNativeToken: boolean;
    isPrivacyToken: boolean;
    tokenAddress?: string;
    pDecimals?: number;
    decimals?: number;
    constructor({ accountKeySet, tokenId, name, symbol }: NativeTokenParam);
    getAllOutputCoins(tokenId: TokenIdType): Promise<import("../../models/coin").default[]>;
    deriveSerialNumbers(tokenId: TokenIdType): Promise<{
        coins: import("../../models/coin").default[];
        serialNumberList: string[];
    }>;
    /**
     *
     * @param tokenId use `null` for native token
     */
    getAvailableCoins(tokenId?: TokenIdType): Promise<import("../../models/coin").default[]>;
    /**
     *
     * @param tokenId use `null` for native token
     */
    getUnspentCoins(tokenId: TokenIdType): Promise<import("../../models/coin").default[]>;
    /**
     *
     * @param tokenId use `null` for native token
     */
    getAvaiableBalance(tokenId?: TokenIdType): Promise<import("bn.js")>;
    /**
     *
     * @param tokenId use `null` for native token
     */
    getTotalBalance(tokenId?: TokenIdType): Promise<string>;
    getTxHistories(): Promise<import("../../..").TxHistoryModel[]>;
    getTransactionByReceiver: ({ skip, limit, }: {
        skip: number;
        limit: number;
    }) => Promise<any>;
    transfer({ paymentInfoList, nativeFee, privacyFee, memo, }: {
        paymentInfoList: PaymentInfoModel[];
        nativeFee?: string;
        privacyFee?: string;
        memo?: string;
    }): void;
    withdrawNodeReward(): Promise<import("../../..").TxHistoryModel>;
    depositTrade({ depositAmount, depositFee, depositFeeTokenId, paymentAddress, priority, type, }: {
        depositAmount: number;
        depositFee: number;
        depositFeeTokenId: string;
        paymentAddress: string;
        priority: string;
        type: number;
    }): Promise<any>;
    calculateFee({ tokenFee, prvFee, isAddTradingFee, tradingFee }: {
        tokenFee: number;
        prvFee: number;
        isAddTradingFee: boolean;
        tradingFee?: number;
    }): {
        tokenNetworkFee: number;
        prvNetworkFee: number;
        prvAmount: number;
        serverFee: number;
        depositNetworkFee: number;
    };
    tradeAPI({ depositId, tradingFee, buyTokenId, buyAmount, }: {
        depositId: number;
        tradingFee?: number;
        buyTokenId: string;
        buyAmount: number;
    }): Promise<import("axios").AxiosResponse<any>>;
    toDecimals({ number }: {
        number: number;
    }): string;
    tradeKyber({ depositId, buyAmount, quote, slippage, buyTokenAddress, priority, tradingFee }: {
        depositId: string;
        buyAmount: number;
        quote: IQuote;
        slippage: number;
        buyTokenAddress: string;
        priority: string;
        tradingFee: number;
    }): Promise<import("axios").AxiosResponse<any>>;
}
export default Token;
//# sourceMappingURL=token.d.ts.map