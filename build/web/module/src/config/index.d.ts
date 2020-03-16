declare type SetConfigName = {
    logMethod?: (message: string) => void;
    chainURL?: string;
    apiURL?: string;
    mainnet?: boolean;
};
export declare function getConfig(): {
    apiURL: string;
    chainURL: string;
    logMethod: (message: string) => void;
    mainnet: boolean;
};
export declare function setConfig(newConfig: SetConfigName): void;
export {};
//# sourceMappingURL=index.d.ts.map