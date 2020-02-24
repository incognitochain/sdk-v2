declare class CustomError extends Error {
    code: any;
    description: any;
    date: any;
    stackTrace: any;
    stackTraceCode: any;
    constructor(errorObj: any, message: any, detailError?: any);
}
declare class RPCError extends Error {
    code: any;
    description: any;
    stackTrace: any;
    stackTraceCode: any;
    constructor(method: any, detailError: any);
}
declare const ErrorObject: {
    UnexpectedErr: {
        code: number;
        description: string;
    };
    B58CheckDeserializedErr: {
        code: number;
        description: string;
    };
    B58CheckSerializedErr: {
        code: number;
        description: string;
    };
    ChooseBestCoinErr: {
        code: number;
        description: string;
    };
    NotEnoughCoinError: {
        code: number;
        description: string;
    };
    NotEnoughTokenError: {
        code: number;
        description: string;
    };
    InvalidBurnAddress: {
        code: number;
        description: string;
    };
    WrongPassPhraseErr: {
        code: number;
        description: string;
    };
    ExistedAccountErr: {
        code: number;
        description: string;
    };
    LoadWalletErr: {
        code: number;
        description: string;
    };
    NewEntropyErr: {
        code: number;
        description: string;
    };
    DeleteWalletErr: {
        code: number;
        description: string;
    };
    PrivateKeyInvalidErr: {
        code: number;
        description: string;
    };
    MnemonicInvalidErr: {
        code: number;
        description: string;
    };
    PrepareInputNormalTxErr: {
        code: number;
        description: string;
    };
    InitNormalTxErr: {
        code: number;
        description: string;
    };
    SendTxErr: {
        code: number;
        description: string;
    };
    InitWithrawRewardTxErr: {
        code: number;
        description: string;
    };
    GetTxByHashErr: {
        code: number;
        description: string;
    };
    InvalidNumberUTXOToDefragment: {
        code: number;
        description: string;
    };
    TxSizeExceedErr: {
        code: number;
        description: string;
    };
    InitCustomTokenTxErr: {
        code: number;
        description: string;
    };
    InitPrivacyTokenTxErr: {
        code: number;
        description: string;
    };
    EncryptMsgOutCoinErr: {
        code: number;
        description: string;
    };
    InvalidTypeTXToReplaceErr: {
        code: number;
        description: string;
    };
    GetStakingAmountErr: {
        code: number;
        description: string;
    };
    GetRewardAmountErr: {
        code: number;
        description: string;
    };
    GetOutputCoinsErr: {
        code: number;
        description: string;
    };
    GetMaxShardNumberErr: {
        code: number;
        description: string;
    };
    GetListCustomTokenErr: {
        code: number;
        description: string;
    };
    GetListPrivacyTokenErr: {
        code: number;
        description: string;
    };
    GetUnspentCustomTokenErr: {
        code: number;
        description: string;
    };
    GetUnspentPrivacyTokenErr: {
        code: number;
        description: string;
    };
    GetUnspentCoinErr: {
        code: number;
        description: string;
    };
    GetUnitFeeErr: {
        code: number;
        description: string;
    };
    GetActiveShardErr: {
        code: number;
        description: string;
    };
    HashToIdenticonErr: {
        code: number;
        description: string;
    };
};
export { CustomError, ErrorObject, RPCError, };
//# sourceMappingURL=errorhandler.d.ts.map