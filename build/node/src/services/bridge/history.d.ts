export declare const getBridgeHistory: ({ walletAddress, tokenId, signPublicKey, }: {
    walletAddress: string;
    tokenId: string;
    signPublicKey?: string;
}) => Promise<any>;
export declare const retryBridgeHistory: ({ id, decentralized, walletAddress, addressType, currencyType, userPaymentAddress, privacyTokenAddress, signPublicKey, }: {
    id: number;
    decentralized: number;
    walletAddress: string;
    addressType: number;
    currencyType: number;
    userPaymentAddress: string;
    privacyTokenAddress: string;
    signPublicKey?: string;
}) => Promise<any>;
export declare const removeBridgeHistory: ({ id, currencyType, decentralized, signPublicKey, tokenId, walletAddress, paymentAddress, addressType, }: {
    id: number;
    currencyType: number;
    decentralized: number;
    signPublicKey?: string;
    tokenId: string;
    walletAddress: string;
    paymentAddress: string;
    addressType?: number;
}) => Promise<any>;
export declare const getBridgeHistoryById: ({ id, currencyType, signPublicKey, decentralized, }: {
    id: number;
    currencyType: number;
    signPublicKey?: string;
    decentralized: number;
}) => Promise<any>;
//# sourceMappingURL=history.d.ts.map