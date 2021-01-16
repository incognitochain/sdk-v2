export declare const checkValidAddress: (address: string, currencyType: number) => Promise<any>;
export declare const estUserFeeCentralizedWithdraw: ({ incognitoAmount, requestedAmount, paymentAddress, walletAddress, tokenId, currencyType, memo, }: {
    incognitoAmount: string;
    requestedAmount: string;
    paymentAddress: string;
    walletAddress: string;
    tokenId: string;
    currencyType: number;
    memo?: string;
}) => Promise<string>;
export declare const centralizedWithdraw: ({ privacyFee, tokenFee, address, userFeeSelection, userFeeLevel, incognitoTxToPayOutsideChainFee, }: {
    privacyFee: string;
    tokenFee: string;
    address: string;
    userFeeSelection: number;
    userFeeLevel: number;
    incognitoTxToPayOutsideChainFee: string;
}) => Promise<any>;
export declare const decentralizedWithdraw: ({ incognitoAmount, requestedAmount, paymentAddress, walletAddress, tokenId, incognitoTx, currencyType, erc20TokenAddress, id, userFeeSelection, userFeeLevel, }: {
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
}) => Promise<any>;
export declare const estUserFeeDecentralizedWithdraw: ({ tokenId, requestedAmount, currencyType, incognitoAmount, paymentAddress, walletAddress, erc20TokenAddress, }: {
    tokenId: string;
    requestedAmount: string;
    currencyType: number;
    incognitoAmount: string;
    paymentAddress: string;
    walletAddress: string;
    erc20TokenAddress?: string;
}) => Promise<any>;
//# sourceMappingURL=withdraw.d.ts.map