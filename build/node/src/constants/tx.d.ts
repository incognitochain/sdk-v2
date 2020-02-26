export declare const TxVersion = 1;
export declare const PRIVACY_TOKEN_TX_TYPE: {
    INIT: number;
    TRANSFER: number;
};
/**
 * @property NORMAL normal tx(send and receive coin)
 * @property SALARY salary tx(gov pay salary for block producer)
 * @property PRIVACY_TOKEN_WITHOUT_PRIVACY_MODE token  tx with no supporting privacy
 * @property PRIVACY_TOKEN_WITH_PRIVACY_MODE token  tx with supporting privacy
 */
export declare const TX_TYPE: {
    NORMAL: string;
    SALARY: string;
    PRIVACY_TOKEN_WITHOUT_PRIVACY_MODE: string;
    PRIVACY_TOKEN_WITH_PRIVACY_MODE: string;
};
export declare const STAKING_TYPES: {
    SHARD: number;
    BEACON: number;
};
export declare const TX_STATUS: {
    FAILED: number;
    SUCCESS: number;
    CONFIRMED: number;
};
export declare const HISTORY_TYPE: {
    ISSUE_TOKEN: number;
    SEND_NATIVE_TOKEN: number;
    SEND_PRIVACY_TOKEN: number;
    BURNING_REQUEST: number;
    PDE_CONTRIBUTION_NATIVE_TOKEN: number;
    PDE_CONTRIBUTION_PRIVACY_TOKEN: number;
    PDE_TRADE_REQUEST_NATIVE_TOKEN: number;
    PDE_TRADE_REQUEST_PRIVACY_TOKEN: number;
    STAKING_REQUEST: number;
    WITHDRAW_REWARD: number;
};
export declare const MaxInputNumberForDefragment = 50;
export declare const MaxInfoSize = 512;
//# sourceMappingURL=tx.d.ts.map