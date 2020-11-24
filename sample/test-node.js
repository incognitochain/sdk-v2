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
    } catch (e) {
      logTask.failed.push({ label, message: e && e.message });
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
      incognito.setConfig({
        mainnet: false,
        wasmPath: path.resolve(__dirname, '../privacy.wasm'),
      });
      console.log('Config after updating', incognito.getConfig());
    });

    await section('LOAD WASM', incognito.goServices.implementGoMethodUseWasm);

    await section('STORAGE IMPLEMENTATION', () => {
      incognito.storageService.implement({
        setMethod: () => null,
        getMethod: () => null,
        removeMethod: () => null,
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
      await incognito.WalletInstance.restore(state.encWallet, '2');
    });

    // await section('GET ALL ACCOUNTS', async () => {
    //   console.log(state.wallet.masterAccount.getAccounts());
    // });

    // await section('ADD ACCOUNT', async () => {
    //   state.newAccount = await state.wallet.masterAccount.addAccount('Test acc', 3);
    //   console.log(state.newAccount);
    // });

    // await section('ACCOUNT KEYS', async () => {
    //   console.log(state.newAccount.key.keySet);
    // });

    // await section('ACCOUNT BLS KEY', async () => {
    //   console.log(await state.newAccount.getBLSPublicKeyB58CheckEncode());
    // });

    await section('IMPORT ACCOUNT', async () => {
      state.importedAccount = await state.wallet.masterAccount.importAccount(
        'Imported acc',
        '112t8rnXJDs4NNtaG1Am1MxEgtsG1RfffBmBFd3TBe9PXFfP3cabTFJU3wS3wdN9WxnRc6GbRDLtQTdnZyW1V9nRBp8AiMmfF3XeCKv1Wkgy'
      );
      const tx = await state.importedAccount.nativeToken.transfer(
        [
          {
            paymentAddressStr:
              state.importedAccount.key.keySet.paymentAddressKeySerialized,
            amount: '15000000',
            message: 'send prv',
          },
        ],
        '100'
      );
      console.debug(`TXID`, tx);
    });

    // await section('GET TOTAL BALANCE NATIVE TOKEN', async () => {
    //   console.log((await state.importedAccount.nativeToken.getTotalBalance()).toNumber());
    // });

    // await section('GET AVAILABALE BALANCE NATIVE TOKEN', async () => {
    //   console.log((await state.importedAccount.nativeToken.getAvaiableBalance()).toNumber());
    // });

    // await section('ACCOUNT FOLLOW TOKEN', async () => {
    //   state.importedAccount.followTokenById('8fb58c65541b62a3eb8d99f62f4a9e2f8eaf99b9860f566674b3989e521594b2');
    //   console.log(state.importedAccount.privacyTokenIds);
    // });

    // await section('ACCOUNT GET ALL FOLLOWING TOKEN', async () => {
    //   const tokens = await state.importedAccount.getFollowingPrivacyToken();
    //   console.log(tokens);
    // });

    // await section('ACCOUNT GET TOKEN WITH ID', async () => {
    //   state.privacyToken = await state.importedAccount.getFollowingPrivacyToken('8fb58c65541b62a3eb8d99f62f4a9e2f8eaf99b9860f566674b3989e521594b2');
    //   console.log(state.privacyToken);
    // });

    // await section('GET TOTAL BALANCE PRIVACY TOKEN', async () => {
    //   console.log((await state.privacyToken.getTotalBalance()).toNumber());
    // });

    // await section('GET AVAILABALE BALANCE PRIVACY TOKEN', async () => {
    //   console.log((await state.privacyToken.getAvaiableBalance()).toNumber());
    // });

    await section('TRANSFER PRIVACY TOKEN', async () => {
      if (state.privacyToken instanceof incognito.PrivacyTokenInstance) {
        console.log(
          await state.privacyToken.transfer(
            [
              {
                paymentAddressStr:
                  state.newAccount.key.keySet.paymentAddressKeySerialized,
                amount: 10,
                message: '',
              },
            ],
            10,
            0
          )
        );
      }
    });

    // await section('ACCOUNT UNFOLLOW TOKEN', async () => {
    //   state.importedAccount.unfollowTokenById('8fb58c65541b62a3eb8d99f62f4a9e2f8eaf99b9860f566674b3989e521594b2');
    //   console.log(state.importedAccount.privacyTokenIds);
    // });

    // await section('ACCOUNT ISSUE NEW TOKEN', async () => {
    //   console.log(await account.issuePrivacyToken({ tokenName: 'TETS', tokenSymbol: 'TTT',supplyAmount: 1000000, nativeTokenFee: 10 }));
    // });

    // await section('ACCOUNT GET REWARDS', async () => {
    //   console.log(await state.importedAccount.getNodeRewards());
    // });

    // await section('ACCOUNT GET NODE STATUS', async () => {
    //   console.log(await state.importedAccount.getNodeStatus());
    // });

    // await section('GET TX HISTORIES NATIVE TOKEN', async () => {
    //   console.log(await state.importedAccount.nativeToken.getTxHistories());
    // });

    // await section('REMOVE ACCOUNT', async () => {
    //   await state.wallet.masterAccount.removeAccount('Imported acc');
    // });

    // await section('DEFRAGMENT NATIVE TOKEN', async () => {
    //   await state.importedAccount.nativeToken.defragment(1 * (10**9), 0.6 * (10**9), 5);
    // });

    console.log('SUCCESS TASKS:\n', logTask.success.join(', '));
    console.log(
      '\nFAILED TASKS:\n',
      logTask.failed
        .map(({ label, message }) => {
          return `${label}: ${message}`;
        })
        .join('\n')
    );
  } else {
    throw new Error('Incognito module load failed');
  }
}

main();
