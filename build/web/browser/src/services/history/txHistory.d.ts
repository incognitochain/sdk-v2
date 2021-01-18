import TxHistoryModel, { IDecentralizedWithdrawData, ICentralizedWithdrawData } from "../../models/txHistory";
export declare function updateTxHistory(txHistory: TxHistoryModel): Promise<TxHistoryModel>;
export declare function checkCachedHistoryById(txId: string): Promise<TxHistoryModel>;
export declare function checkCachedHistories(): Promise<void>;
export declare const updateBurningDecentralizedWithdrawTxHistory: ({ txId, decentralizedWithdrawData, }: {
    txId: string;
    decentralizedWithdrawData: IDecentralizedWithdrawData;
}) => Promise<TxHistoryModel>;
export declare const updateBurningCentralizedWithdrawTxHistory: ({ txId, centralizedWithdrawData, }: {
    txId: string;
    centralizedWithdrawData: ICentralizedWithdrawData;
}) => Promise<TxHistoryModel>;
/**
 *
 * @param tokenId Use `null` for native token
 */
export declare function getTxHistoryByPublicKey(accountPublicKeySerialized: string, tokenId?: string): Promise<TxHistoryModel[]>;
//# sourceMappingURL=txHistory.d.ts.map