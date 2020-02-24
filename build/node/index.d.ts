import '@src/utils/polyfill.ts';
import '@src/global';
import { loadWASM } from '@src/wasm';
import WalletInstance from '@src/walletInstance/wallet';
import { checkCachedHistories, getTxHistoryByPublicKey } from '@src/services/history/txHistory';
declare const _default: {
    loadWASM: typeof loadWASM;
    WalletInstance: typeof WalletInstance;
    storageService: import("./src/services/storage").Storage;
    historyService: {
        checkCachedHistories: typeof checkCachedHistories;
        getTxHistoryByPublicKey: typeof getTxHistoryByPublicKey;
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map