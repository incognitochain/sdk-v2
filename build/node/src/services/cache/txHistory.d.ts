import TxHistoryModel from "../../models/txHistory";
interface TxHistoryCache {
    [txId: string]: TxHistoryModel;
}
export declare function getTxHistoryCache(): Promise<TxHistoryCache>;
export declare function cacheTxHistory(txId: string, history: TxHistoryModel): Promise<void>;
export {};
//# sourceMappingURL=txHistory.d.ts.map