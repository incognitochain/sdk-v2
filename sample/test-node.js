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

    try {
      let result = incognito.keyServices.checkPaymentAddress(
        '12RsmnBZgeSvkewuYMC4xctgt8FRGvpShmJo4z1J5S9YsoUng1y8dUU9BC4R18jdFBLRQnDgvE54KJSiH6GpRthiSVVZ2UxX961AmRQ'
      );
      console.log('PAYMENT_ADDR_VALID', result);
    } catch (error) {
      console.debug(error);
    }

    // console.log(
    //   'PAYMENT_ADDR_VALID_PRIVATE_KEY',
    //   incognito.keyServices.checkPaymentAddress(
    //     '112t8rnXJDs4NNtaG1Am1MxEgtsG1RfffBmBFd3TBe9PXFfP3cabTFJU3wS3wdN9WxnRc6GbRDLtQTdnZyW1V9nRBp8AiMmfF3XeCKv1Wkgy'
    //   )
    // );
    // console.log(
    //   'PAYMENT_ADDR_VALID_PAYMENT_ADDRESS',
    //   incognito.keyServices.checkPaymentAddress(
    //     '12RsmnBZgeSvkewuYMC4xctgt8FRGvpShmJo4z1J5S9YsoUng1y8dUU9BC4R18jdFBLRQnDgvE54KJSiH6GpRthiSVVZ2UxX961AmRQ'
    //   )
    // );
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
      // state.privacyToken = await state.importedAccount.getPrivacyTokenById(
      //   // 'a0a22d131bbfdc892938542f0dbe1a7f2f48e16bc46bf1c5404319335dc1f0df' //tomo,
      //   '880ea0787f6c1555e59e3958a595086b7802fc7a38276bcd80d4525606557fbc',//zil
      // );

      // const txPRV = await state.importedAccount.nativeToken.transfer(
      //   [
      //     {
      //       paymentAddressStr:
      //         '12RsmnBZgeSvkewuYMC4xctgt8FRGvpShmJo4z1J5S9YsoUng1y8dUU9BC4R18jdFBLRQnDgvE54KJSiH6GpRthiSVVZ2UxX961AmRQ',
      //       amount: '69000',
      //       message: 'send prv',
      //     },
      //   ],
      //   '100'
      // );
      // console.debug('txPRV', txPRV);

      // await section('GET TOTAL BALANCE PRIVACY TOKEN', async () => {
      //   console.log((await state.privacyToken.getTotalBalance()).toNumber());
      // });

      // await section('GET AVAILABALE BALANCE PRIVACY TOKEN', async () => {
      //   console.log((await state.privacyToken.getAvaiableBalance()).toNumber());
      // });
      // if (state.privacyToken instanceof incognito.PrivacyTokenInstance) {
      // const txNative = await state.privacyToken.transfer(
      //   [
      //     {
      //       paymentAddressStr:
      //         '12RsmnBZgeSvkewuYMC4xctgt8FRGvpShmJo4z1J5S9YsoUng1y8dUU9BC4R18jdFBLRQnDgvE54KJSiH6GpRthiSVVZ2UxX961AmRQ',
      //       amount: '1248',
      //       message: 'send 880ea0787f6c1555e59e3958a595086b7802fc7a38276bcd80d4525606557fbc',
      //     },
      //   ],
      //   '100',
      //   ''
      // );
      // console.log(`txNative`, txNative);
      // const txPrivacy = await state.privacyToken.transfer(
      //   [
      //     {
      //       paymentAddressStr:
      //         '12RsmnBZgeSvkewuYMC4xctgt8FRGvpShmJo4z1J5S9YsoUng1y8dUU9BC4R18jdFBLRQnDgvE54KJSiH6GpRthiSVVZ2UxX961AmRQ',
      //       amount: '30814',
      //       message: 'send zil',
      //     },
      //   ],
      //   '',
      //   '100'
      // );
      // console.log(`txPrivacy`, txPrivacy);
      // }
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
