declare type ConfigName = 'chainURL';
declare type Config = {
    [k in ConfigName]: string;
};
declare type SetConfigName = {
    [k in ConfigName]?: string;
};
export declare function getConfig(): Config;
export declare function setConfig(newConfig: SetConfigName): void;
export {};
//# sourceMappingURL=index.d.ts.map