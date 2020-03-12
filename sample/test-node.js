const incognito = require('../build/node');

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
      logTask.failed.push(label);
    }
  }
}


async function main() {
  if (incognito) {
    console.log('Incognito module', incognito);
    await section('LOAD WASM', incognito.goServices.implementGoMethodUseWasm);

    await section('STORAGE IMPLEMENTATION', () => {
      incognito.storageService.implement({
        setMethod: () => null,
        getMethod: () => null,
        removeMethod: () => null
      });
    });

    await section('INIT WALLET', async () => {
      const wallet = new incognito.WalletInstance();
      await wallet.init('123', 'TEST');

      let encWallet;
      let newAccount;

      await section('BACKUP WALLET', async () => {
        encWallet = wallet.backup('2');
      });

      await section('RESTORE WALLET', async () => {
        await incognito.WalletInstance.restore(encWallet, '2');
      });

      await section('GET ALL ACCOUNTS', async () => {
        console.log(wallet.masterAccount.getAccounts());
      });

      await section('ADD ACCOUNT', async () => {
        newAccount = await wallet.masterAccount.addAccount('Test acc', 3);
        console.log(newAccount);

        await section('ACCOUNT KEYS', async () => {
          console.log(newAccount.key.keySet);
        });

        await section('ACCOUNT BLS KEY', async () => {
          console.log(await newAccount.getBLSPublicKeyB58CheckEncode());
        });
      });

      await section('IMPORT ACCOUNT', async () => {
        const account = await wallet.masterAccount.importAccount('Imported acc', '112t8rnX54YTL75HRsg6o7zjxLpYKL72iNQTaP5RRWY3VWcGEugSu1be8ApJYVFoW6wy9JeJFjBbodPCchexYTzjLdVYEBFE6XWEggHhKFyd');
        console.log(account);

        await section('GET TOTAL BALANCE NATIVE TOKEN', async () => {
          console.log((await account.nativeToken.getTotalBalance()).toNumber());
        });

        await section('GET AVAILABALE BALANCE NATIVE TOKEN', async () => {
          console.log((await account.nativeToken.getAvaiableBalance()).toNumber());
        });

        await section('ACCOUNT FOLLOW TOKEN', async () => {
          account.followTokenById('8fb58c65541b62a3eb8d99f62f4a9e2f8eaf99b9860f566674b3989e521594b2');
          console.log(account.privacyTokenIds);

          await section('ACCOUNT GET TOKEN INFO', async () => {
            console.log(await account.getFollowingPrivacyToken());
          });

          // await section('TRANSFER PRIVACY TOKEN', async () => {
          //   const token = await account.getFollowingPrivacyToken('8fb58c65541b62a3eb8d99f62f4a9e2f8eaf99b9860f566674b3989e521594b2');
          //   if (token instanceof incognito.PrivacyTokenInstance) {
          //     console.log(await token.transfer([
          //       {
          //         paymentAddressStr: newAccount.key.keySet.paymentAddressKeySerialized,
          //         amount: 10,
          //         message: ''
          //       }
          //     ], 10, 0));
          //   }
          // });

          await section('ACCOUNT UNFOLLOW TOKEN', async () => {
            account.unfollowTokenById('8fb58c65541b62a3eb8d99f62f4a9e2f8eaf99b9860f566674b3989e521594b2');
            console.log(account.privacyTokenIds);
          });
        });

        await section('ACCOUNT ISSUE NEW TOKEN', async () => {
          console.log(await account.issuePrivacyToken({ tokenName: 'TETS', tokenSymbol: 'TTT',supplyAmount: 1000000, nativeTokenFee: 10 }));
        });

        await section('ACCOUNT GET REWARDS', async () => {
          console.log(await account.getNodeRewards());
        });

        await section('ACCOUNT GET NODE STATUS', async () => {
          console.log(await account.getNodeStatus());
        });

        await section('GET TX HISTORIES NATIVE TOKEN', async () => {
          console.log(await account.nativeToken.getTxHistories());
        });

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

      await section('REMOVE ACCOUNT', async () => {
        await wallet.masterAccount.removeAccount('Imported acc');
      });
    });

    console.log('SUCCESS TASKS:', logTask.success.join(', '));
    console.log('FAILED TASKS:', logTask.failed.join(', '));
  } else {
    throw new Error('Incognito module load failed');
  }
}

main();
