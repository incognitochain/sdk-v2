interface CentralizedDepositParam {
    paymentAddress: string;
    walletAddress: string;
    tokenId: string;
    currencyType: number;
}
declare type ETHDepositParam = CentralizedDepositParam;
interface ERC20DepositParam extends ETHDepositParam {
    tokenContractID: string;
}
export declare const genCentralizedDepositAddress: ({ paymentAddress, walletAddress, tokenId, currencyType }: CentralizedDepositParam) => Promise<any>;
export declare const genETHDepositAddress: ({ paymentAddress, walletAddress, tokenId, currencyType }: CentralizedDepositParam) => Promise<any>;
export declare const genERC20DepositAddress: ({ paymentAddress, walletAddress, tokenId, tokenContractID, currencyType }: ERC20DepositParam) => Promise<any>;
export {};
//# sourceMappingURL=deposit.d.ts.map