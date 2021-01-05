export declare const getBridgeHistory: ({ paymentAddress, tokenId, }: {
    paymentAddress: string;
    tokenId: string;
}) => Promise<any>;
export declare const removeBridgeHistory: ({ historyId, currencyType, isDecentralized, }: {
    historyId: number;
    currencyType: number;
    isDecentralized: boolean;
}) => Promise<import("axios").AxiosResponse<any>>;
//# sourceMappingURL=history.d.ts.map