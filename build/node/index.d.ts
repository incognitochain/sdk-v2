import "./src/utils/polyfill.ts";
import "./src/global";
import { checkCachedHistories, getTxHistoryByPublicKey } from "./src/services/history/txHistory";
import { implementGoMethodManually, implementGoMethodUseWasm } from "./src/go";
export { default as WalletInstance } from "./src/walletInstance/wallet";
export { default as storageService } from "./src/services/storage";
export declare const historyServices: {
    checkCachedHistories: typeof checkCachedHistories;
    getTxHistoryByPublicKey: typeof getTxHistoryByPublicKey;
};
export declare const goServices: {
    implementGoMethodManually: typeof implementGoMethodManually;
    implementGoMethodUseWasm: typeof implementGoMethodUseWasm;
    GO_METHOD_NAMES: string[];
};
//# sourceMappingURL=index.d.ts.map