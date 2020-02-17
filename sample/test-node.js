
async function section(label, f) {
  if (typeof f === 'function') {
    console.time(label);
    console.log(`=========\t${label}\t=========`);
    await f();
    console.timeEnd(label);
    console.log('\n\n');
  }
}

function initWallet(incognito) {
  const wallet = new incognito.Wallet('wallet', 'pass');

  return wallet;
}

async function main() {
  const incognito = require('../build/node').default;

  if (incognito) {
    console.log('Incognito module', incognito);
    await section('LOAD WASM', incognito.loadWASM);

    await section('INIT WALLET', () => {
      const wallet = initWallet(incognito);
      console.log('Wallet', wallet.toString());
    });
  } else {
    throw new Error('Incognito module load failed');
  }
}

main();
