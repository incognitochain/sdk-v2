export declare const checkValidAddress: ({ address, currencyType, }: {
    address: string;
    currencyType: number;
}) => Promise<any>;
export declare const estUserFeeCentralizedWithdraw: ({ incognitoAmount, requestedAmount, paymentAddress, walletAddress, tokenId, currencyType, memo, signPublicKey, }: {
    incognitoAmount: string;
    requestedAmount: string;
    paymentAddress: string;
    walletAddress: string;
    tokenId: string;
    currencyType: number;
    memo?: string;
    signPublicKey?: string;
}) => Promise<string>;
export declare const centralizedWithdraw: ({ privacyFee, nativeFee, address, userFeeSelection, userFeeLevel, incognitoTxToPayOutsideChainFee, signPublicKey, }: {
    privacyFee: string;
    nativeFee: string;
    address: string;
    userFeeSelection: number;
    userFeeLevel: number;
    incognitoTxToPayOutsideChainFee: string;
    signPublicKey?: string;
}) => Promise<any>;
export declare const decentralizedWithdraw: ({ incognitoAmount, requestedAmount, paymentAddress, walletAddress, tokenId, incognitoTx, currencyType, erc20TokenAddress, id, userFeeSelection, userFeeLevel, signPublicKey, }: {
    incognitoAmount: string;
    requestedAmount: string;
    paymentAddress: string;
    walletAddress: string;
    tokenId: string;
    currencyType: number;
    incognitoTx: string;
    erc20TokenAddress?: string;
    id: string;
    userFeeSelection: number;
    userFeeLevel: number;
    signPublicKey?: string;
}) => Promise<any>;
export declare const estUserFeeDecentralizedWithdraw: ({ tokenId, requestedAmount, currencyType, incognitoAmount, paymentAddress, walletAddress, erc20TokenAddress, signPublicKey, }: {
    tokenId: string;
    requestedAmount: string;
    currencyType: number;
    incognitoAmount: string;
    paymentAddress: string;
    walletAddress: string;
    erc20TokenAddress?: string;
    signPublicKey?: string;
}) => Promise<any>;
//# sourceMappingURL=withdraw.d.ts.map