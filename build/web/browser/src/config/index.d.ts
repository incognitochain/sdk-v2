declare type Config = {
    logMethod: (message: string) => void;
    chainURL: string;
};
declare type SetConfigName = {
    logMethod?: (message: string) => void;
    chainURL?: string;
};
export declare function getConfig(): Config;
export declare function setConfig(newConfig: SetConfigName): void;
export {};
//# sourceMappingURL=index.d.ts.map