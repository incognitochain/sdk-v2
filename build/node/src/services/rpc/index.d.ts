import CoinModel from "../../models/coin";
declare class RpcClient {
    getOutputCoin: (paymentAdrr: string, viewingKey?: string, tokenID?: string) => Promise<{
        outCoins: CoinModel[];
    }>;
    hasSerialNumber: (paymentAddr: string, serialNumberStrs: any, tokenID?: string) => Promise<boolean[]>;
    hasSNDerivator: (paymentAddr: string, snds: any, tokenID?: any) => Promise<{
        existed: any;
    }>;
    randomCommitmentsProcess: (paymentAddr: any, inputCoinStrs: any, tokenID?: any) => Promise<{
        commitmentIndices: any;
        commitmentStrs: any;
        myCommitmentIndices: any;
    }>;
    sendRawTx: (serializedTxJson: any) => Promise<{
        txId: any;
    }>;
    sendRawTxCustomToken: (tx: any) => Promise<{
        txId: any;
    }>;
    sendRawTxCustomTokenPrivacy: (serializedTxJson: any) => Promise<{
        txId: any;
    }>;
    listCustomTokens: () => Promise<{
        listCustomToken: any;
    }>;
    listPrivacyCustomTokens: () => Promise<any>;
    getUnspentCustomToken: (paymentAddrSerialize: any, tokenIDStr: any) => Promise<{
        listUnspentCustomToken: any;
    }>;
    getEstimateFeePerKB: (paymentAddrSerialize: any, tokenIDStr?: any) => Promise<{
        unitFee: number;
    }>;
    getTransactionByHash: (txHashStr: any) => Promise<{
        isInBlock: any;
        isInMempool: any;
        err: any;
    } | {
        isInBlock: boolean;
        isInMempool: boolean;
        err?: undefined;
    }>;
    getStakingAmount: (type: any) => Promise<{
        res: number;
    }>;
    getActiveShard: () => Promise<{
        shardNumber: number;
    }>;
    getMaxShardNumber: () => Promise<{
        shardNumber: number;
    }>;
    hashToIdenticon: (hashStrs: any) => Promise<{
        images: any;
    }>;
    getRewardAmount: (paymentAddrStr: any) => Promise<{
        rewards: any;
    }>;
    getBeaconBestState: () => Promise<{
        bestState: any;
    }>;
    getPublicKeyRole: (publicKey: any) => Promise<{
        status: any;
    }>;
    getPDEState: (beaconHeight: any) => Promise<{
        state: any;
    }>;
    getPDETradeStatus: (txId: any) => Promise<{
        state: any;
    }>;
    getPDEContributionStatus: (pairId: any) => Promise<{
        state: any;
    }>;
    getPDEContributionStatusV2: (pairId: any) => Promise<{
        state: any;
    }>;
    getPDEWithdrawalStatus: (txId: any) => Promise<{
        state: any;
    }>;
    getBlockChainInfo: () => Promise<any>;
    listRewardAmount: () => Promise<any>;
    getBeaconBestStateDetail: () => Promise<any>;
    getBeaconHeight: () => Promise<any>;
    /**
     *
     * @param {string} tokenIDStr1
     * @param {string} tokenIDStr2, default is PRV
     */
    isExchangeRatePToken: (tokenIDStr1: any, tokenIDStr2?: string) => Promise<boolean>;
    getTransactionByReceiver: (paymentAdrr: any, viewingKey: any) => Promise<{
        receivedTransactions: any;
    }>;
    getListPrivacyCustomTokenBalance: (privateKey: any) => Promise<any>;
    getBurningAddress: (beaconHeight?: number) => Promise<any>;
}
declare const _default: RpcClient;
export default _default;
//# sourceMappingURL=index.d.ts.map