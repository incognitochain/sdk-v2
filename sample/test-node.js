/* eslint-disable no-unused-vars */
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
      shieldAccount: null,
      unshieldAccount: null,
    };

    console.log('Incognito module', incognito);

    incognito.setConfig({
      mainnet: false,
      wasmPath: path.resolve(__dirname, '../privacy.wasm'),
      deviceId: '1234',
      deviceToken: '1234',
    });
    console.log('Config after updating', incognito.getConfig());
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

    // try {
    //   let result = incognito.keyServices.checkPaymentAddress(
    //     '12RsmnBZgeSvkewuYMC4xctgt8FRGvpShmJo4z1J5S9YsoUng1y8dUU9BC4R18jdFBLRQnDgvE54KJSiH6GpRthiSVVZ2UxX961AmRQ'
    //   );
    //   console.log('PAYMENT_ADDR_VALID', result);
    // } catch (error) {
    //   console.debug(error);
    // }

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
      state.unshieldAccount = await state.wallet.masterAccount.importAccount(
        'unshield',
        '112t8rnYvp4J1mjBwrjyHWpdGJvq59Zf7dkPbi3CUwYZM6f384FQwpdgNpVPsWnQN2ugpKJQzeqwPT4Yk4HxDBDaoveeSNcThUgnw3p4UUkX'
      );
      state.shieldAccount = await state.wallet.masterAccount.importAccount(
        'shield',
        '112t8rnZCyrvapkNCFFBKEpesfDMK8oyfW9eewDDJkF9UkqUk1NTSoYFQJXaBhmBBdboLEaDmufLJTSZ71ZpaWeAH9k4Jny5DVCfvCJbZL7k'
      );
      state.account = await state.wallet.masterAccount.importAccount(
        'account',
        '112t8rnYgxdVVzLxuodo4FnFxyjafoayBTxB7FYbSosYF4NX4SswYVmJjLHTsdWfMQVfudcnwYkn7eGJpMimx7jpGoLVUjVwi3msAGdYHsFi'
      );

      // const hash = await incognito.rpcClient.getTransactionByHash(
      //   'f522cb4325e0e5260a3fcaca95053e0165eefe13b1689b023460a7416321f934'
      // );
      // console.debug('hash', hash);

      // try {
      //   const result = await state.privacyToken.bridgeGetMinMaxWithdraw();
      //   console.log(result);
      // } catch (error) {
      //   console.log(error);
      // }

      // try {
      //   const result = await state.privacyToken.bridgeWithdrawCheckValAddress({
      //     address: 'tbnb18gpq7t8p0zd8laqfr7cs6zphxvglnkm3svkwyx',
      //   });
      //   console.log('result', result);
      // } catch (error) {
      //   console.log(error);
      // }

      // // const paymentAddress = 'tbnb1q4jssmd7ppgz6dcw3kd86mqpxjfvq4gqxaw68h';

      // const list = await state.privacyToken.bridgeGetHistory();
      // console.log('list', list);
      // const result = await incognito.bridgeServices.getBridgeHistoryById({
      //   id: 418,
      //   currencyType: 10,
      // });
      // console.log('result', result);
      // const history = await state.privacyToken.getTransactionByReceiver(
      //   { skip: 0, limit: 10 }
      // );
      // // console.debug('HISTORY TOKEN', history);
      // const txPRV = await state.account.nativeToken.transfer({
      //   paymentInfoList: [
      //     {
      //       paymentAddressStr:
      //         '12RsmnBZgeSvkewuYMC4xctgt8FRGvpShmJo4z1J5S9YsoUng1y8dUU9BC4R18jdFBLRQnDgvE54KJSiH6GpRthiSVVZ2UxX961AmRQ',
      //       amount: '327317',
      //       message: 'send prv',
      //     },
      //   ],
      //   nativeFee: '100',
      //   memo: 'send PRV nha?',
      // });
      // console.debug('txPRV', txPRV);
      // // await section('GET TOTAL BALANCE PRIVACY TOKEN', async () => {
      //   console.log((await state.privacyToken.getTotalBalance()).toNumber());
      // });
      // await section('GET AVAILABALE BALANCE PRIVACY TOKEN', async () => {
      //   console.log((await state.privacyToken.getAvaiableBalance()).toNumber());
      // });
    });

    /** */
    // const tokenId =
    //   '880ea0787f6c1555e59e3958a595086b7802fc7a38276bcd80d4525606557fbc';
    // state.privacyToken = await state.unshieldAccount.getPrivacyTokenById(
    //   // 'a0a22d131bbfdc892938542f0dbe1a7f2f48e16bc46bf1c5404319335dc1f0df' //tomo,
    //   // '880ea0787f6c1555e59e3958a595086b7802fc7a38276bcd80d4525606557fbc' //zil
    //   // ffd8d42dc40a8d166ea4848baf8b5f6e9fe0e9c30d60062eb7d44a8df9e00854 //eth
    //   // '4584d5e9b2fc0337dfb17f4b5bb025e5b82c38cfa4f54e8a3d4fcdd03954ff82' //btc
    //   // '9fca0a0947f4393994145ef50eecd2da2aa15da2483b310c2c0650301c59b17d' //BNB
    //   // '716fd1009e2a1669caacc36891e707bfdf02590f96ebd897548e8963c95ebac0' //USDT mainnet
    //   // '4946b16a08a9d4afbdf416edf52ef15073db0fc4a63e78eb9de80f94f6c0852a' //USDT
    // 7450ad98cb8c967afb76503944ab30b4ce3560ed8f3acc3155f687641ae34135 LTC
    //   tokenId
    // );
    // const signPublicKey = await state.shieldAccount.getSignPublicKey();
    // let depositAddress = '';
    // let historyId;
    // let history;
    // state.privacyToken = await state.shieldAccount.getPrivacyTokenById(tokenId);

    // await section('BRIDGE GET HISTORIES', async () => {
    //   const histories = await state.privacyToken.bridgeGetHistory({
    //     signPublicKey,
    //   });
    //   console.debug('histories', histories[0]);
    // });

    // await section('BRIDGE GENERATE DEPOSIT ADDRESS', async () => {
    //   depositAddress = await state.privacyToken.bridgeGenerateDepositAddress({
    //     signPublicKey,
    //   });
    //   depositAddress = depositAddress.address;
    //   console.debug('depositAddress', depositAddress);
    // });

    // state.privacyToken = await state.unshieldAccount.getPrivacyTokenById(
    //   tokenId
    // );

    // await section('BRIDGE GET HISTORIES', async () => {
    //   const histories = await state.privacyToken.bridgeGetHistory({
    //     signPublicKey,
    //   });
    //   console.debug('histories', histories[0]);
    // });

    // await section('BRIDGE GET HISTORY BY ID', async () => {
    //   historyId = 985;
    //   history = await state.privacyToken.bridgeGetHistoryById({
    //     historyId,
    //     signPublicKey,
    //   });
    //   console.debug('history', history);
    // });

    // await section('BRIDGE REMOVE HISTORY BY ID', async () => {
    //   const remove = await state.privacyToken.bridgeRemoveHistory({
    //     id: historyId,
    //     signPublicKey,
    //   });
    //   console.debug('remove', remove);
    // });

    // await section('BRIDGE RETRY HISTORY BY ID', async () => {
    //   const retry = await state.privacyToken.bridgeRetryHistory({
    //     id: 987,
    //     addressType: 1,
    //     privacyTokenAddress:
    //       '7450ad98cb8c967afb76503944ab30b4ce3560ed8f3acc3155f687641ae34135',
    //     erc20TokenAddress: '',
    //     outChainTx: '',
    //     signPublicKey,
    //   });
    //   console.debug('retry', retry);
    // });

    // await section('TRANSFER PRIVACY TOKEN BY PRIVACY FEE', async () => {
    //   try {
    //     const tx = await state.privacyToken.transfer({
    //       paymentInfoList: [
    //         {
    //           paymentAddressStr:
    //             '12RsmnBZgeSvkewuYMC4xctgt8FRGvpShmJo4z1J5S9YsoUng1y8dUU9BC4R18jdFBLRQnDgvE54KJSiH6GpRthiSVVZ2UxX961AmRQ',
    //           amount: '1248',
    //           message: '',
    //         },
    //       ],
    //       nativeFee: '',
    //       privacyFee: '100',
    //       memo: 'Send token pay fee by ptoken',
    //     });
    //     console.log('tx', tx);
    //   } catch (error) {
    //     console.log('ERROR', error);
    //   }
    // });

    // await section('TRANSFER PRIVACY TOKEN BY NATIVE FEE', async () => {
    //   try {
    //     const tx = await state.privacyToken.transfer({
    //       paymentInfoList: [
    //         {
    //           paymentAddressStr:
    //             '12RsmnBZgeSvkewuYMC4xctgt8FRGvpShmJo4z1J5S9YsoUng1y8dUU9BC4R18jdFBLRQnDgvE54KJSiH6GpRthiSVVZ2UxX961AmRQ',
    //           amount: '10',
    //           message: '',
    //         },
    //       ],
    //       nativeFee: '100',
    //       privacyFee: '',
    //       memo: 'Send token pay fee by prv',
    //     });
    //     console.log('tx', tx);
    //   } catch (error) {
    //     console.log('ERROR', error);
    //   }
    // });

    // await section('BRIDGE WITHDRAW DECENTRALIZED BY TOKEN FEE', async () => {
    //   try {
    //     console.debug('signPublicKey', signPublicKey);
    //     let tokenFee;
    //     try {
    //       tokenFee = await state.privacyToken.getEstFeeFromNativeFee({
    //         nativeFee: 100,
    //       });
    //     } catch (error) {
    //       console.log('ERROR', error);
    //     }
    //     tokenFee = String(tokenFee);
    //     console.log('TOKEN_FEE', tokenFee);
    //     let incognitoAmount = '69';
    //     let requestedAmount = '0.000069';
    //     let paymentAddress = await state.privacyToken.bridgeGenerateDepositAddress(
    //       {
    //         signPublicKey,
    //       }
    //     );
    //     paymentAddress = paymentAddress.address;
    //     const userFees = await state.privacyToken.bridgeWithdrawEstUserFee({
    //       incognitoAmount,
    //       requestedAmount,
    //       paymentAddress,
    //       signPublicKey,
    //     });
    //     console.log('userFees', userFees);
    //     const txBurn = await state.privacyToken.bridgeBurningDecentralized({
    //       outchainAddress: paymentAddress,
    //       burningAmount: incognitoAmount,
    //       nativeFee: '',
    //       privacyFee: String(tokenFee),
    //       privacyPaymentInfoList: [
    //         {
    //           paymentAddressStr: userFees.FeeAddress,
    //           amount: userFees.TokenFees.Level1,
    //           message: '',
    //         },
    //       ],
    //       nativePaymentInfoList: [],
    //       memo: 'burn tx',
    //     });
    //     console.log('tx burn', txBurn);
    //     const withdraw = await state.privacyToken.bridgeWithdrawDecentralized({
    //       incognitoAmount,
    //       requestedAmount,
    //       paymentAddress,
    //       burningTxId: txBurn.txId,
    //       userFeeId: userFees.ID,
    //       userFeeSelection: 1,
    //       userFeeLevel: 1,
    //       signPublicKey,
    //     });
    //     console.log('withdraw', withdraw);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // });

    // await section('BRIDGE WITHDRAW DECENTRALIZED BY NATIVE FEE', async () => {
    //   try {
    //     let incognitoAmount = '96';
    //     let requestedAmount = '0.000096';
    //     state.privacyToken = await state.shieldAccount.getPrivacyTokenById(
    //       tokenId
    //     );
    //     state.privacyToken = await state.unshieldAccount.getPrivacyTokenById(
    //       tokenId
    //     );
    //     let paymentAddress = depositAddress;
    //     const userFees = await state.privacyToken.bridgeWithdrawEstUserFee({
    //       incognitoAmount,
    //       requestedAmount,
    //       paymentAddress,
    //       signPublicKey,
    //     });
    //     console.log('userFees', userFees);
    //     const txBurn = await state.privacyToken.bridgeBurningDecentralized({
    //       outchainAddress: paymentAddress,
    //       burningAmount: incognitoAmount,
    //       nativeFee: '100',
    //       privacyFee: '',
    //       privacyPaymentInfoList: [],
    //       nativePaymentInfoList: [
    //         {
    //           paymentAddressStr: userFees.FeeAddress,
    //           amount: userFees.PrivacyFees.Level1,
    //           message: '',
    //         },
    //       ],
    //       memo: 'burn tx',
    //     });
    //     console.log('tx burn', txBurn);
    //     const withdraw = await state.privacyToken.bridgeWithdrawDecentralized({
    //       incognitoAmount,
    //       requestedAmount,
    //       paymentAddress,
    //       burningTxId: txBurn.txId,
    //       userFeeId: userFees.ID,
    //       userFeeSelection: 2, // NATIVE FEE
    //       userFeeLevel: 1,
    //       signPublicKey,
    //     });
    //     console.log('withdraw', withdraw);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // });

    // await section('BRIDGE WITHDRAW CENTRALIZED BY TOKEN FEE', async () => {
    //   try {
    //     let tokenFee;
    //     try {
    //       tokenFee = await state.privacyToken.getEstFeeFromNativeFee({
    //         nativeFee: 100,
    //       });
    //     } catch (error) {
    //       console.log('ERROR', error);
    //     }
    //     tokenFee = String(tokenFee);
    //     console.log('TOKEN_FEE', tokenFee);
    //     let incognitoAmount = '69';
    //     let requestedAmount = '0.000000069';
    //     let paymentAddress = depositAddress;
    //     console.debug('paymentAddress', paymentAddress);
    //     const userFees = await state.privacyToken.bridgeWithdrawEstUserFee({
    //       incognitoAmount,
    //       requestedAmount,
    //       paymentAddress,
    //       signPublicKey,
    //     });
    //     console.log('userFees', userFees);
    //     let tempAddress = userFees.Address;
    //     const txBurn = await state.privacyToken.bridgeBurningCentralized({
    //       privacyPaymentInfoList: [
    //         {
    //           paymentAddressStr: tempAddress, //temp address
    //           amount: incognitoAmount + tokenFee,
    //           message: '',
    //         },
    //         {
    //           paymentAddressStr: userFees.FeeAddress, //fee(master) address
    //           amount: userFees.TokenFees.Level1,
    //           message: '',
    //         },
    //       ],
    //       nativePaymentInfoList: [],
    //       memo: 'burn tx zil',
    //     });
    //     console.log('tx burn', txBurn);
    //     const withdraw = await state.privacyToken.bridgeWithdrawCentralized({
    //       nativeFee: '',
    //       privacyFee: tokenFee,
    //       tempAddress,
    //       burningTxId: txBurn.txId,
    //       userFeeSelection: 1,
    //       userFeeLevel: 1,
    //       signPublicKey,
    //     });
    //     console.log('withdraw', withdraw);
    //   } catch (error) {
    //     console.log(error.repsonse.data);
    //   }
    // });

    // await section('BRIDGE WITHDRAW CENTRALIZED BY NATIVE FEE', async () => {
    //   try {
    //     let incognitoAmount = '96';
    //     let requestedAmount = '0.000000096';
    //     let paymentAddress = 'zil16229negqznpr3zjnzwank4we5jpmp5np0dgnww';
    //     const userFees = await state.privacyToken.bridgeWithdrawEstUserFee({
    //       incognitoAmount,
    //       requestedAmount,
    //       paymentAddress,
    //     });
    //     console.log('userFees', userFees);
    //     let tempAddress = userFees.Address;
    //     const txBurn = await state.privacyToken.bridgeBurningCentralized({
    //       privacyPaymentInfoList: [
    //         {
    //           paymentAddressStr: tempAddress, //temp address
    //           amount: incognitoAmount,
    //           message: '',
    //         },
    //       ],
    //       nativePaymentInfoList: [
    //         {
    //           paymentAddressStr: userFees.FeeAddress, //fee(master) address
    //           amount: userFees.PrivacyFees.Level1,
    //           message: '',
    //         },
    //         {
    //           paymentAddressStr: tempAddress, //temp address
    //           amount: '100',
    //           message: '',
    //         },
    //       ],
    //       memo: 'burn tx tomo',
    //     });
    //     console.log('tx burn', txBurn);
    //     const withdraw = await state.privacyToken.bridgeWithdrawCentralized({
    //       privacyFee: '',
    //       nativeFee: '100',
    //       tempAddress,
    //       burningTxId: txBurn.txId,
    //       userFeeSelection: 2, // NATIVE FEE
    //       userFeeLevel: 1,
    //     });
    //     console.log('withdraw', withdraw);
    //   } catch (error) {
    //     console.log(error.response.data);
    //   }
    // });

    // await section('GET TOTAL BALANCE NATIVE TOKEN', async () => {
    //   console.log(
    //     (await state.account.nativeToken.getTotalBalance()).toNumber()
    //   );
    // });

    // await section('GET AVAILABALE BALANCE NATIVE TOKEN', async () => {
    //   console.log(
    //     (await state.account.nativeToken.getAvaiableBalance()).toNumber()
    //   );
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
