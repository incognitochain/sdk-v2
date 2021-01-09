export declare const getBridgeHistory: (payload: any) => Promise<any>;
export declare const retryBridgeHistory: (payload: any) => Promise<any>;
export declare const removeBridgeHistory: (payload: any) => Promise<any>;
export declare const getBridgeHistoryById: ({ id, currencyType, }: {
    id: number;
    currencyType: number;
}) => Promise<any>;
declare const bridgeServices: {
    getBridgeHistory: (payload: any) => Promise<any>;
    retryBridgeHistory: (payload: any) => Promise<any>;
    removeBridgeHistory: (payload: any) => Promise<any>;
    getBridgeHistoryById: ({ id, currencyType, }: {
        id: number;
        currencyType: number;
    }) => Promise<any>;
};
export default bridgeServices;
//# sourceMappingURL=history.d.ts.map