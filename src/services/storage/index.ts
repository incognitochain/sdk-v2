interface ImplementInterface {
  setMethod(key: string, data: string) : Promise<any>;
  getMethod(key: string) : Promise<any>;
  removeMethod(key: string) : Promise<any>
  namespace: string;
};

export class StorageService {
  namespace: string;
  setMethod: (key: string, data: string) => Promise<any>;
  getMethod: (key: string) => Promise<string>;
  removeMethod: (key: string) => Promise<any>;

  constructor(namespace?: string) {
    this.namespace = namespace;
    this.setMethod = null;
    this.getMethod = null;
    this.removeMethod = null;
  }

  implement({ setMethod, getMethod, removeMethod, namespace } : ImplementInterface) {
    this.setMethod = setMethod;
    this.getMethod = getMethod;
    this.removeMethod = removeMethod;
    this.namespace = namespace;
  }

  _getKey(key: string) {
    return this.namespace ? `${this.namespace}-${key}` : key;
  }

  async set(key: string, data: any) {
    const dataStr = JSON.stringify(data);
    return await this.setMethod(this._getKey(key), dataStr);
  }

  async get(key: string) {
    const dataStr =  await this.getMethod(this._getKey(key));
    return JSON.parse(dataStr);
  }

  async remove(key: string) {
    return await this.removeMethod(this._getKey(key));
  }
}

const storage = new StorageService();

export default storage;