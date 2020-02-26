import './wasm_exec';

//load WASM
let isWASMRunned = false;
const fileName = 'privacy.wasm';

async function _loadWasmOnNode(resolve: Function, reject: Function) {
  try {
    const path = require('path');
    const fs = require('fs');

    let pathName = path.resolve(path.dirname(`./${fileName}`), fileName);

    const go = new Go();
    let inst;
    const data = fs.readFileSync(pathName);
    
    const result = await WebAssembly.instantiate(data, go.importObject);
    inst = result.instance;
    go.run(inst);
    isWASMRunned = true;
    resolve();
  } catch (e) {
    reject(e);
  }
}

async function _loadWasmOnBrowser(resolve: Function, reject: Function) {
  try {
    const go = new Go();

    if (!WebAssembly.instantiateStreaming) { // polyfill
      WebAssembly.instantiateStreaming = async (resp, importObject) => {
        try {
          const source = await (await resp).arrayBuffer();
          return await WebAssembly.instantiate(source, importObject);
        } catch (e) {
          reject(e);
        }
      };
    }
    const result = await WebAssembly.instantiateStreaming(fetch(fileName).catch(e => reject(e)), go.importObject);
    const inst = result.instance;
    go.run(inst);
    isWASMRunned = true;
    resolve();
  } catch (e) {
    reject(e);
  }
}

export default function loadWasm() {
  return new Promise((resolve, reject) => {
    if (isWASMRunned) {
      console.info('WASM was loaded');
      return resolve();
    }

    if (__IS_WEB__) { // on web enviroment
      _loadWasmOnBrowser(resolve, reject);
    } else if (__IS_NODE__) { // on Nodejs
      _loadWasmOnNode(resolve, reject);
    }
  });
}
