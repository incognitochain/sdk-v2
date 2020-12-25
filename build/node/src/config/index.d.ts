declare type SetConfigName = {
    logMethod?: (message: string) => void;
    chainURL?: string;
    apiURL?: string;
    mainnet?: boolean;
    wasmPath?: string;
    api2URL?: string;
};
export declare function getConfig(): {
    apiURL: string;
    chainURL: string;
    api2URL: string;
    logMethod: (message: string) => void;
    mainnet: boolean;
    wasmPath: string;
};
export declare function setConfig(newConfig: SetConfigName): void;
export {};
//# sourceMappingURL=index.d.ts.map