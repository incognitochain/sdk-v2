const incognito = require('../build/node');
const path = require('path');

const logTask = {
  success: [],
  failed: [],
};

async function section(label, f) {
  if (typeof f === 'function') {
    try {
      console.time(label);
      console.log(`=========\t${label}\t=========`);
      await f();
      console.timeEnd(label);
      console.log('\n\n');

      logTask.success.push(label);
    } catch(e) {
      logTask.failed.push({label, message: e && e.message});
    }
  }
}


async function main() {
  if (incognito) {
    const state = {
      wallet: null,
      account: null,
      privacyToken: null,
      encWallet: null,
      newAccount: null,
      importedAccount: null,
    };

    console.log('Incognito module', incognito);

    await section('SET CONFIG', () => {
      incognito.setConfig({ mainnet: false, wasmPath: path.resolve(__dirname, '../', 'privacy.wasm') });
      console.log('Config after updating', incognito.getConfig());
    });

    await section('LOAD WASM', incognito.goServices.implementGoMethodUseWasm);

    await section('STORAGE IMPLEMENTATION', () => {
      incognito.storageService.implement({
        setMethod: () => null,
        getMethod: () => null,
        removeMethod: () => null
      });
    });

    await section('INIT WALLET', async () => {
      state.wallet = new incognito.WalletInstance();
      await state.wallet.init('123', 'TEST');
    });

    await section('BACKUP WALLET', async () => {
      state.encWallet = state.wallet.backup('2');
    });

    await section('RESTORE WALLET', async () => {
      await incognito.WalletInstance.restore('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', '2');
    });

    await section('GET ALL ACCOUNTS', async () => {
      console.log(state.wallet.masterAccount.getAccounts());
    });

    await section('ADD ACCOUNT', async () => {
      state.newAccount = await state.wallet.masterAccount.addAccount('Test acc', 3);
      console.log(state.newAccount);
    });

    await section('ACCOUNT KEYS', async () => {
      console.log(state.newAccount.key.keySet);
    });

    await section('ACCOUNT BLS KEY', async () => {
      console.log(await state.newAccount.getBLSPublicKeyB58CheckEncode());
    });

    await section('IMPORT ACCOUNT', async () => {
      state.importedAccount = await state.wallet.masterAccount.importAccount('Imported acc', '112t8rnX54YTL75HRsg6o7zjxLpYKL72iNQTaP5RRWY3VWcGEugSu1be8ApJYVFoW6wy9JeJFjBbodPCchexYTzjLdVYEBFE6XWEggHhKFyd');
      console.log(state.importedAccount);



      // await section('TRANSFER NATIVE TOKEN', async () => {
      //   console.log(await account.nativeToken.transfer([
      //     {
      //       paymentAddressStr: newAccount.key.keySet.paymentAddressKeySerialized,
      //       amount: 10,
      //       message: ''
      //     }
      //   ], 10));
      // });
    });

    await section('GET TOTAL BALANCE NATIVE TOKEN', async () => {
      console.log((await state.importedAccount.nativeToken.getTotalBalance()).toNumber());
    });

    await section('GET AVAILABALE BALANCE NATIVE TOKEN', async () => {
      console.log((await state.importedAccount.nativeToken.getAvaiableBalance()).toNumber());
    });

    await section('ACCOUNT FOLLOW TOKEN', async () => {
      state.importedAccount.followTokenById('8fb58c65541b62a3eb8d99f62f4a9e2f8eaf99b9860f566674b3989e521594b2');
      console.log(state.importedAccount.privacyTokenIds);
    });

    await section('ACCOUNT GET ALL FOLLOWING TOKEN', async () => {
      const tokens = await state.importedAccount.getFollowingPrivacyToken();
      console.log(tokens);
    });

    await section('ACCOUNT GET TOKEN WITH ID', async () => {
      state.privacyToken = await state.importedAccount.getFollowingPrivacyToken('8fb58c65541b62a3eb8d99f62f4a9e2f8eaf99b9860f566674b3989e521594b2');
      console.log(state.privacyToken);
    });

    await section('GET TOTAL BALANCE PRIVACY TOKEN', async () => {
      console.log((await state.privacyToken.getTotalBalance()).toNumber());
    });

    await section('GET AVAILABALE BALANCE PRIVACY TOKEN', async () => {
      console.log((await state.privacyToken.getAvaiableBalance()).toNumber());
    });

    await section('TRANSFER PRIVACY TOKEN', async () => {
      if (state.privacyToken instanceof incognito.PrivacyTokenInstance) {
        console.log(await state.privacyToken.transfer([
          {
            paymentAddressStr: state.newAccount.key.keySet.paymentAddressKeySerialized,
            amount: 10,
            message: ''
          }
        ], 10, 0));
      }
    });

    await section('ACCOUNT UNFOLLOW TOKEN', async () => {
      state.importedAccount.unfollowTokenById('8fb58c65541b62a3eb8d99f62f4a9e2f8eaf99b9860f566674b3989e521594b2');
      console.log(state.importedAccount.privacyTokenIds);
    });

    // await section('ACCOUNT ISSUE NEW TOKEN', async () => {
    //   console.log(await account.issuePrivacyToken({ tokenName: 'TETS', tokenSymbol: 'TTT',supplyAmount: 1000000, nativeTokenFee: 10 }));
    // });

    await section('ACCOUNT GET REWARDS', async () => {
      console.log(await state.importedAccount.getNodeRewards());
    });

    await section('ACCOUNT GET NODE STATUS', async () => {
      console.log(await state.importedAccount.getNodeStatus());
    });

    await section('GET TX HISTORIES NATIVE TOKEN', async () => {
      console.log(await state.importedAccount.nativeToken.getTxHistories());
    });

    await section('REMOVE ACCOUNT', async () => {
      await state.wallet.masterAccount.removeAccount('Imported acc');
    });

    await section('DEFRAGMENT NATIVE TOKEN', async () => {
      await state.importedAccount.nativeToken.defragment(1 * (10**9), 0.6 * (10**9), 5);
    });

    console.log('SUCCESS TASKS:\n', logTask.success.join(', '));
    console.log('\nFAILED TASKS:\n', logTask.failed.map(({ label, message}) => {
      return `${label}: ${message}`;
    }).join('\n'));
  } else {
    throw new Error('Incognito module load failed');
  }
}

main();
