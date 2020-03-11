declare type Config = {
    logMethod: Function;
    chainURL: string;
};
declare type SetConfigName = {
    logMethod?: Function;
    chainURL?: string;
};
export declare function getConfig(): Config;
export declare function setConfig(newConfig: SetConfigName): void;
export {};
//# sourceMappingURL=index.d.ts.map