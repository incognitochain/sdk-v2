import Validator from '@src/utils/validator';

interface ImplementInterface {
  setMethod(key: string, data: string) : Promise<any>;
  getMethod(key: string) : Promise<any>;
  removeMethod(key: string) : Promise<any>
  namespace: string;
};

export class StorageService {
  namespace: string;
  setMethod: (key: string, data: string) => any;
  getMethod: (key: string) => any;
  removeMethod: (key: string) => any;

  constructor(namespace?: string) {
    this.namespace = namespace;
    this.setMethod = null;
    this.getMethod = null;
    this.removeMethod = null;
  }

  implement({ setMethod, getMethod, removeMethod, namespace } : ImplementInterface) {
    new Validator('setMethod', setMethod).required();
    new Validator('getMethod', getMethod).required();
    new Validator('removeMethod', removeMethod).required();
    new Validator('namespace', namespace).string();

    this.setMethod = setMethod;
    this.getMethod = getMethod;
    this.removeMethod = removeMethod;
    this.namespace = namespace;
  }

  _getKey(key: string) {
    return this.namespace ? `${this.namespace}-${key}` : key;
  }

  async set(key: string, data: any) {
    new Validator('key', key).required().string();

    const dataStr = JSON.stringify(data);
    return await this.setMethod(this._getKey(key), dataStr);
  }

  async get(key: string) {
    new Validator('key', key).required().string();

    const dataStr =  await this.getMethod(this._getKey(key));
    return JSON.parse(dataStr);
  }

  async remove(key: string) {
    new Validator('key', key).required().string();

    return await this.removeMethod(this._getKey(key));
  }
}

const storage = new StorageService();

export default storage;
