declare const _default: {
    NATIVE_TOKEN: {
        tokenId: string;
        name: string;
        symbol: string;
    };
    BRIDGE_PRIVACY_TOKEN: {
        TYPE: {
            COIN: number;
            TOKEN: number;
        };
        CURRENCY_TYPE: {
            ETH: number;
            BTC: number;
            ERC20: number;
            BNB: number;
            BNB_BEP2: number;
            USD: number;
        };
        ADDRESS_TYPE: {
            DEPOSIT: number;
            WITHDRAW: number;
        };
        HISTORY_STATUS: {
            CENTRALIZED: {
                ReceivedDepositAmount: number;
                MintingPrivacyToken: number;
                MintedPrivacyToken: number;
                SendingToMasterAccount: number;
                SendedToMasterAccount: number;
                ReceivedWithdrawAmount: number;
                BurningPrivacyToken: number;
                BurnedPrivacyToken: number;
                SendingToUserAddress: number;
                SendedToUserAddress: number;
                RejectedIssueFromIncognito: number;
                RejectedBurnFromIncognito: number;
                OtaExpired: number;
            };
            DECENTRALIZED: {
                EthReceivedDepositAmount: number;
                EthRequestAcceptWithDraw: number;
                EthAcceptedWithDraw: number;
                EthSendingToContract: number;
                SentToIncognito: number;
                RejectedFromIncognito: number;
                EthMintedPrivacyToken: number;
                EthReceivedWithdrawTx: number;
                FailedGettingBurnProof: number;
                BurnProofInvalid: number;
                ReleasingToken: number;
                ReleaseTokenSucceed: number;
                ReleaseTokenFailed: number;
                EtaExpired: number;
            };
        };
    };
};
export default _default;
//# sourceMappingURL=tokenInfo.d.ts.map