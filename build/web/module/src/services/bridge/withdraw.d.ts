export declare const genCentralizedWithdrawAddress: ({ amount, paymentAddress, walletAddress, tokenId, currencyType, memo }: {
    amount: number;
    paymentAddress: string;
    walletAddress: string;
    tokenId: string;
    currencyType: number;
    memo?: string;
}) => Promise<string>;
export declare const addETHTxWithdraw: ({ amount, originalAmount, paymentAddress, walletAddress, tokenId, burningTxId, currencyType }: {
    amount: number;
    paymentAddress: string;
    walletAddress: string;
    tokenId: string;
    currencyType: number;
    originalAmount: number;
    burningTxId: string;
}) => Promise<import("axios").AxiosResponse<any>>;
export declare const addERC20TxWithdraw: ({ amount, originalAmount, paymentAddress, walletAddress, tokenContractID, tokenId, burningTxId, currencyType }: {
    amount: number;
    paymentAddress: string;
    walletAddress: string;
    tokenId: string;
    currencyType: number;
    originalAmount: number;
    burningTxId: string;
    tokenContractID: string;
}) => Promise<import("axios").AxiosResponse<any>>;
export declare const updatePTokenFee: ({ fee, paymentAddress }: {
    fee: number;
    paymentAddress: string;
}) => Promise<import("axios").AxiosResponse<any>>;
//# sourceMappingURL=withdraw.d.ts.map