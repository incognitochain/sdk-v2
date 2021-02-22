interface ISetConfig {
    logMethod: (message: string) => void;
    chainURL: string;
    apiURL: string;
    mainnet: boolean;
    wasmPath: string;
    api2URL?: string;
    deviceId: string;
    deviceToken: string;
}
export declare function getConfig(): {
    apiURL: string;
    chainURL: string;
    api2URL: string;
    dexBinanceApiURL: string;
    logMethod: (message: string) => void;
    mainnet: boolean;
    wasmPath: string;
    deviceId: string;
    deviceToken: string;
    token: string;
};
export declare const getToken: (deviceId: string, deviceToken: string) => Promise<any>;
export declare const setConfig: (newConfig: ISetConfig) => void;
export {};
//# sourceMappingURL=index.d.ts.map