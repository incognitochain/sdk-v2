import TxHistoryModel from "../../models/txHistory";
export declare function updateTxHistory(txHistory: TxHistoryModel): Promise<TxHistoryModel>;
export declare function checkCachedHistoryById(txId: string): Promise<TxHistoryModel>;
export declare function checkCachedHistories(): Promise<void>;
/**
 *
 * @param tokenId Use `null` for native token
 */
export declare function getTxHistoryByPublicKey(accountPublicKeySerialized: string, tokenId?: string): Promise<TxHistoryModel[]>;
declare const cacheServices: {
    updateTxHistory: typeof updateTxHistory;
    checkCachedHistoryById: typeof checkCachedHistoryById;
    checkCachedHistories: typeof checkCachedHistories;
    getTxHistoryByPublicKey: typeof getTxHistoryByPublicKey;
};
export default cacheServices;
//# sourceMappingURL=txHistory.d.ts.map