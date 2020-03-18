import "./src/utils/polyfill.ts";
import "./src/global";
import { checkCachedHistories, getTxHistoryByPublicKey } from "./src/services/history/txHistory";
import { implementGoMethodManually, implementGoMethodUseWasm } from "./src/go";
import { setPrivacyUtilRandomBytesFunc } from "./src/services/wallet";
import * as _TX_CONSTANT from "./src/constants/tx";
import * as _WALLET_CONSTANT from "./src/constants/wallet";
export { default as AccountInstance } from "./src/walletInstance/account/account";
export { default as NativeTokenInstance } from "./src/walletInstance/token/nativeToken";
export { default as PrivacyTokenInstance } from "./src/walletInstance/token/privacyToken";
export { default as WalletInstance } from "./src/walletInstance/wallet";
export { default as MasterAccount } from "./src/walletInstance/account/masterAccount";
export { default as KeyWalletModel } from "./src/models/key/keyWallet";
export { default as AccountKeySetModel } from "./src/models/key/accountKeySet";
export { default as PaymentInfoModel } from "./src/models/paymentInfo";
export { default as storageService } from "./src/services/storage";
export { default as TxHistoryModel } from "./src/models/txHistory";
export { setConfig, getConfig } from "./src/config";
export declare const historyServices: {
    checkCachedHistories: typeof checkCachedHistories;
    getTxHistoryByPublicKey: typeof getTxHistoryByPublicKey;
};
export declare const walletServices: {
    setPrivacyUtilRandomBytesFunc: typeof setPrivacyUtilRandomBytesFunc;
};
export declare const goServices: {
    implementGoMethodManually: typeof implementGoMethodManually;
    implementGoMethodUseWasm: typeof implementGoMethodUseWasm;
    GO_METHOD_NAMES: string[];
};
export declare const bridgeServices: {
    removeBridgeHistory: ({ historyId, currencyType, isDecentralized }: {
        historyId: number;
        currencyType: number;
        isDecentralized: boolean;
    }) => Promise<import("axios").AxiosResponse<any>>;
};
export declare const CONSTANT: {
    TX_CONSTANT: typeof _TX_CONSTANT;
    WALLET_CONSTANT: typeof _WALLET_CONSTANT;
    TOKEN_INFO_CONSTANT: {
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
    NUM_COIN_PROPERTIES: 7;
    NUM_PROOF_PROPERTIES: 14;
    ENCODE_VERSION: 0;
    SIG_PUB_KEY_SIZE: 32;
    SIG_NO_PRIVACY_SIZE: 64;
    SIG_PRIVACY_SIZE: 96;
    SPENDING_KEY_SIZE: 32;
    PUBLIC_KEY_SIZE: 32;
    PAYMENT_ADDR_SIZE: 64;
    TRANSMISSION_KEY_SIZE: 32;
    VIEWING_KEY_SIZE: 64;
    ENCRYPTED_RANDOMNESS_SIZE: 48;
    ENCRYPTED_SYM_KEY_SIZE: 66;
    ELGAMAL_CIPHERTEXT_SIZE: 66;
    AES_BLOCK_SIZE: 16;
    HASH_SIZE: 32;
    INPUT_COINS_NO_PRIVACY_SIZE: 175;
    OUTPUT_COINS_NO_PRIVACY_SIZE: 145;
    INPUT_COINS_PRIVACY_SIZE: 39;
    OUTPUT_COINS_PRIVACY_SIZE: 221;
    ED25519_KEY_SIZE: 32;
    DEFAULT_NATIVE_FEE: 100;
};
//# sourceMappingURL=index.d.ts.map