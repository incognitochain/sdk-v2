import "./src/utils/polyfill.ts";
import "./src/global";
import { checkCachedHistories, getTxHistoryByPublicKey } from "./src/services/history/txHistory";
import { implementGoMethodManually, implementGoMethodUseWasm } from "./src/go";
import { setPrivacyUtilRandomBytesFunc } from "./src/services/wallet";
export { default as AccountInstance } from "./src/walletInstance/account/account";
export { default as NativeTokenInstance } from "./src/walletInstance/token/nativeToken";
export { default as PrivacyTokenInstance } from "./src/walletInstance/token/privacyToken";
export { default as WalletInstance } from "./src/walletInstance/wallet";
export { default as storageService } from "./src/services/storage";
export { setConfig, getConfig } from "./src/config";
export declare const historyServices: {
    checkCachedHistories: typeof checkCachedHistories;
    getTxHistoryByPublicKey: typeof getTxHistoryByPublicKey;
};
export declare const walletServices: {
    setPrivacyUtilRandomBytesFunc: typeof setPrivacyUtilRandomBytesFunc;
};
export declare const goServices: {
    implementGoMethodManually: typeof implementGoMethodManually;
    implementGoMethodUseWasm: typeof implementGoMethodUseWasm;
    GO_METHOD_NAMES: string[];
};
//# sourceMappingURL=index.d.ts.map