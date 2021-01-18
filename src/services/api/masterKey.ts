import { WalletInstance } from '../../../index';
import { http } from '../http';

export const apiGetWalletAccounts = (wallet: WalletInstance) => {
  const masterAccountInfo = wallet.masterAccount.getSerializedInformations();
  const masterAccountPublicKey = masterAccountInfo.publicKey;
  return http
      .get(`hd-wallet/recovery?Key=${masterAccountPublicKey}`)
      .then((res: any) => res?.Accounts)
      .then((accounts) =>
          accounts.map((account: any) => ({
              name: account.Name,
              id: account.AccountID,
          })),
      )
      .catch(() => []);
};

export const apiUpdateWalletAccounts = (wallet: WalletInstance) => {
  const accounts = [];

  for (const account of wallet.masterAccount.getAccounts()) {
      const info = account.getSerializedInformations();
      accounts.push({
          name: account.name,
          id: info.index,
      });
  }

  const masterAccountInfo = wallet.masterAccount.getSerializedInformations();

  const accountInfos = accounts.map((item: any) => ({
      Name: item.name,
      AccountID: item.id,
  }));

  return http
      .put(`hd-wallet/recovery`, {
          Key: masterAccountInfo.publicKey,
          Accounts: accountInfos,
      })
      .catch((e) => e);
};
