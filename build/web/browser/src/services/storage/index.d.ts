interface ImplementInterface {
    setMethod(key: string, data: string): Promise<any>;
    getMethod(key: string): Promise<any>;
    removeMethod(key: string): Promise<any>;
    namespace: string;
}
export declare class StorageService {
    namespace: string;
    setMethod: (key: string, data: string) => any;
    getMethod: (key: string) => any;
    removeMethod: (key: string) => any;
    constructor(namespace?: string);
    implement({ setMethod, getMethod, removeMethod, namespace }: ImplementInterface): void;
    _getKey(key: string): string;
    set(key: string, data: any): Promise<any>;
    get(key: string): Promise<any>;
    remove(key: string): Promise<any>;
}
declare const storage: StorageService;
export default storage;
//# sourceMappingURL=index.d.ts.map