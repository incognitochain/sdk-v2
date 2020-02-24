interface ImplementInterface {
    setMethod: Function;
    getMethod: Function;
    removeMethod: Function;
    namespace: string;
}
export declare class Storage {
    namespace: string;
    setMethod: Function;
    getMethod: Function;
    removeMethod: Function;
    constructor(namespace?: string);
    implement({ setMethod, getMethod, removeMethod, namespace }: ImplementInterface): void;
    _getKey(key: string): string;
    set(key: string, data: any): Promise<any>;
    get(key: string): Promise<any>;
    remove(key: string): Promise<any>;
}
declare const storage: Storage;
export default storage;
//# sourceMappingURL=index.d.ts.map