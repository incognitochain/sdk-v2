import BridgeHistoryModel from "../../models/bridge/bridgeHistory";
export declare const getBridgeHistory: ({ paymentAddress, tokenId }: {
    paymentAddress: string;
    tokenId: string;
}) => Promise<BridgeHistoryModel[]>;
export declare const removeBridgeHistory: ({ historyId, currencyType, isDecentralized }: {
    historyId: number;
    currencyType: number;
    isDecentralized: boolean;
}) => Promise<import("axios").AxiosResponse<any>>;
//# sourceMappingURL=history.d.ts.map