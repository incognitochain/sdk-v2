import TxHistoryModel from "../../models/txHistory";
export declare function updateTxHistory(txHistory: TxHistoryModel): Promise<TxHistoryModel>;
export declare function checkCachedHistories(): Promise<boolean>;
/**
 *
 * @param tokenId Use `null` for native token
 */
export declare function getTxHistoryByPublicKey(accountPublicKeySerialized: string, tokenId?: string): Promise<TxHistoryModel[]>;
//# sourceMappingURL=txHistory.d.ts.map