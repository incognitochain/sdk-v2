# Table of Contents
1. [Install](#install)
2. [Usage](#usage)
	1. [NodeJS](#nodejs)
	2. [Browser](#browser)
	3. [React Native](#reactnative)
	4. [Implement storage](#implementstorage)
3. [API](#api)
	1. [Services](#api_service)
	2. [WalletInstance](#api_walletinstance)
	3. [MasterAccount](#api_masteraccount)
	4. [AccountInstance](#api_accountinstance)
	5. [NativeTokenInstance](#api_nativetokeninstance)
	6. [PrivacyTokenInstance](#api_privacytokeninstance)
	7. [KeyWalletModel](#api_keywalletmodel)
	8. [AccountKeySetModel](#api_accountketsetmodel)
	9. [TxHistoryModel](#api_txhistorymodel)
	10. [PaymentInfoModel](#api_paymentinfomodel)
	11. [BridgeHistoryModel](#api_bridgehistorymodel)
4. [Examples](#examples)


## Install <a name="install"></a>

`$ yarn add https://github.com/incognitochain/sdk-v2`


## Usage <a name="usage"></a>

### NodeJS <a name="nodejs"></a>
```javascript
const incognitoJs = require('incognito-js/build/node');
```
Load WebAssembly:
```javascript
await incognitoJs.goServices.implementGoMethodUseWasm();
```

Follow this step [Implement storage](#implementstorage).

### Browser <a name="browser"></a>
ES module
```javascript 
import * as incognitoJs from 'incognito-js';
```

or

`<script src="incognito-js/build/web/browser/index.js"></script>`

`incognitoJs` is attached to your browser window object.

Load WebAssembly:
```javascript
await incognitoJs.goServices.implementGoMethodUseWasm();
```

Follow this step [Implement storage](#implementstorage).

### React Native <a name="reactnative"></a>

Use [react-native-incognito-js](https://github.com/incognitochain/react-native-incognito-js) for React Native and then follow this step [Implement storage](#implementstorage).

### Implement storage <a name="implementstorage"></a>

`incognitoJs` need to cache some data into storage to work correctly like coin infomation, tx history,... So please implement `incognitoJs` storage service:

```javascript
incognitoJs.storageService.implement({
  // namespace: 'YOUR-STORAGE-NAMESPACE',
  setMethod: (key: string, value: string) {
  	return new Promise((resolve, reject) => {
    	// store data to storage device, for example:
        // localStorage on Browser
        // AsyncStorage on React Native
        
        resolve();
        
        if (error) {
        	reject(error);
        }
    });
  },
  getMethod: (key: string) {
  	return new Promise(() => {
    	// get data from device storage
    });
  },
  removeMethod: (key: string) {
  	return new Promise(() => {
    	// remove data from device storage
    });
  },
});
```

## API <a name="api"></a>

###	Service <a name='api_service'></a>

| Service   |      Method      |  Return value | Description
|----------|:-------------:|------:|------:|
| historyServices |  checkCachedHistories() | Promise\<boolean> |Check status all cached histories|
| historyServices |    getTxHistoryByPublicKey(publicKeySerialized: string, tokenId?: string)   |  Promise<[TxHistoryModel](#api_txhistorymodel)[]> | Get histories belong to the account |
| walletServices | setPrivacyUtilRandomBytesFunc(func: function) | void|Implement random bytes function |
|goServices|implementGoMethodUseWasm()|Promise|Implement WebAssembly automatically (for browser & node)|
|goServices|implementGoMethodManually([set of go methods](#gomethodparam))|void|Implement go methods manually (for React Native)|
|goServices|GO_METHOD_NAMES||All of Go method name|
|storageService|implement([set of methods](#implementstorageparam))|void|Implement storage|
|bridgeServices|removeBridgeHistory({ historyId: number, currencyType: number, isDecentralized: boolean })||Cancel/remove a deposit/withrawal history|
|setConfig([config param](#configparam))||void|Set config|
|getConfig()|[config param](#configparam)||Get config|
|CONSTANT||||
|[WalletInstance](#api_walletinstance)|||Wallet class|
|[AccountInstance](#api_accountinstance)|||Account class|
|[NativeTokenInstance](#api_nativetokeninstance)|||Native token class|
|[PrivacyTokenInstance](#api_privacytokeninstance)|||Privacy token class|

### Storage implement object param <a name="implementstorageparam"></a> 
* setMethod(key: string, data: string) : Promise<any>;
* getMethod(key: string) : Promise<any>;
* removeMethod(key: string) : Promise<any>
* namespace: string; (optional)

### Config param <a name="configparam"></a>
* chainURL: string
* apiURL: string
* mainnet: boolean `// update this property will change apiURL & chainURL if they are not defined`
* logMethod: (message: string) => void (pass `null` to disable log)

#### Go method name <a name="gomethodparam"></a>
* deriveSerialNumber: (data: string) => string;
* initPrivacyTx: (data: string) => string;
* randomScalars: (data: string) => string;
* staking: (data: string) => string;
* stopAutoStaking: (data: string) => string;,
* initPrivacyTokenTx: (data: string) => string;
* withdrawDexTx: (data: string) => string;
* initPTokenTradeTx: (data: string) => string;
* initPRVTradeTx: (data: string) => string;
* initPTokenContributionTx: (data: string) => string;
* initPRVContributionTx: (data: string) => string;
* initWithdrawRewardTx: (data: string) => string;
* initBurningRequestTx: (data: string) => string;
* generateKeyFromSeed: (data: string) => string;
* scalarMultBase: (data: string) => string;
* hybridEncryptionASM: (data: string) => string;
* hybridDecryptionASM: (data: string) => string;
* generateBLSKeyPairFromSeed: (data: string) => string;

#
### WalletInstance <a name="api_walletinstance"></a>

|Public Method|Param|Return|Description|
|----------|:-------------:|------:|------:|
|init|passPhrase: string, name?: string|Promise\<WalletInstance>|Init new wallet|
|restore|encryptedWallet: string, password: string|Promise\<WalletInstance>|[Static method] Restore wallet from backup string|
|backup|password: string|string|Get encrypted backup string|

|Public Property|Type|Default value|Description|
|----------|:-------------:|------:|------:|
|seed|Uint8Array|||
|entropy|number[ ]|||
|passPhrase|string||Wallet pass phrase|
|mnemonic|string|||
|masterAccount|[MasterAccount](#api_masteraccount)||The main account in wallet|
|name|string||Wallet name|

Example:
```javascript
// Init a wallet
const walletInstance = new incognito.WalletInstance();
const wallet = await walletInstance.init('here-is-pass-pharse', 'MY-WALLET-NAME');

// Backup
const backupString = wallet.backup('backup-password');

// Restore from backup
const restoredWallet = await incognito.WalletInstance.restore(backupString,'backup-password');

// Get info
wallet.name === 'MY-WALLET-NAME'  // true
```

#
### MasterAccount <a name='api_masteraccount'></a>
MasterAccount is a special account, the Incognito wallet is only have one MasterAccount, this account can contain many Accounts (or [AccountInstance](#api_accountinstance))
|Public Method|Param|Return|Description|
|----------|:-------------:|------:|------:|
|addAccount|name: string, shardId?: number|Promise\<[AccountInstance](#api_accountinstance)>|Create a child account, `shardId` will be randomly selected if not provided|
|removeAccount|name: string|void|Remove an account|
|getAccounts||<[AccountInstance](#api_accountinstance)>[ ]|Get account list|
|importAccount|name: string, privateKey: string|Promise\<[AccountInstance](#api_accountinstance)>|Import account from its private key|
|getBackupData||object|Return backup string|
|restoreFromBackupData|backupString: string|MasterAccount|Restore from backup string|

|Public Property|Type|Default value|Description|
|----------|:-------------:|------:|------:|
|child|array|[ ]|Array of chilren account|
|key|[KeyWalletModel](#api_keywalletmodel)||Key wallet|

Example:
```javascript
// Add a new account
const account = await wallet.masterAccount.addAccount('New account');

// Add a new account in Shard 2
const account = await wallet.masterAccount.addAccount('New account', 2);

// Import an account
const account = await wallet.masterAccount.importAccount('My account', 'here-is-account-private-key');

// Get all accounts
const accounts = wallet.masterAccount.getAccounts();
```

#
### AccountInstance <a name="api_accountinstance"></a>
AccountInstance is child account belong to [MasterAccount](#api_masteraccount)
|Public Method|Param|Return|Description|
|----------|:-------------:|------:|------:|
|getBLSPublicKeyB58CheckEncode||Promise \<string>|Get BLS public key|
|followTokenById|tokenId: string|void|Add a token id to following list|
|unfollowTokenById|tokenId: string|void|Remove a token id from following list|
|issuePrivacyToken|{tokenName: string, tokenSymbol: string, supplyAmount: number, nativeTokenFee: number}|Promise\<[TxHistoryModel](#api_txhistorymodel)>|Issue new Incognito token|
|getFollowingPrivacyToken|tokenId?: string|Promise\<[PrivacyTokenInstance](#api_privacytokeninstance) \| [PrivacyTokenInstance](#api_privacytokeninstance)[]>|Get following token(s), if `tokenId` is not provided, all tokens will be returned|
|getBackupData||object|Return backup string|
|restoreFromBackupData|backupString: string|AccountInstance|Restore from backup string|
|getNodeRewards||Promise\<any>|For Node only - Get rewards|
|getNodeStatus||Promise\<any>|For Node only - Get node status|

|Public Property|Type|Default value|Description|
|----------|:-------------:|------:|------:|
|name|string||Account name|
|isImport|boolean|false|Is this account was imported or not|
|key|[KeyWalletModel](#api_keywalletmodel)||Key wallet|
|nativeToken|[NativeTokenInstance](#api_nativetokeninstance)||Native token is PRV|
|privacyTokenIds|string[]||List of following [PrivacyTokenInstance](#api_privacytokeninstance) id|

Example:
```javascript
// Follow a token
account.followTokenById('token-id-here');

// Unfollow a token
account.unfollowTokenById ('token-id-here');

// Issue a new  token
const history = await account.issuePrivacyToken({ tokenName: 'NAME', tokenSymbol: 'SYMBOL',supplyAmount: 10000, nativeTokenFee: 10 })

// Get all following token info
const tokens = await account.getFollowingPrivacyToken();

// Get token ABC info
const tokenABC = await account.getFollowingPrivacyToken('token-abc-id');
```

#
### NativeTokenInstance <a name="api_nativetokeninstance"></a>
|Public Method|Param|Return|Description|
|----------|:-------------:|------:|------:|
|getTotalBalance||Promise\<BigNumber>|Get total balance (including pending coins)|
|getAvaiableBalance||Promise\<BigNumber>|Get available balance|
|getTxHistories||Promise<[TxHistoryModel](#api_txhistorymodel)[]>|Get all transaction histories (only cached on local)|
|transfer|paymentInfoList: [PaymentInfoModel](#api_paymentinfomodel)[], nativeFee: number|Promise\<[TxHistoryModel](#api_txhistorymodel)>|Send in Incognito chain|
|requestStaking|rewardReceiverPaymentAddress: string, nativeFee: number|Promise\<[TxHistoryModel](#api_txhistorymodel)>|[Node] Send staking request|
|pdeContribution|pdeContributionPairID: string, contributedAmount: number, nativeFee: number|Promise\<[TxHistoryModel](#api_txhistorymodel)>|[pDEX] Send PDE contribution|
|requestTrade|tokenIdBuy: string, sellAmount: number, minimumAcceptableAmount: number, nativeFee: number, tradingFee: number|Promise\<[TxHistoryModel](#api_txhistorymodel)>|Send trade request|
|withdrawNodeReward||Promise\<[TxHistoryModel](#api_txhistorymodel)>|[Node] Withdraw reward from node|

|Public Property|Type|Default value|Description|
|----------|:-------------:|------:|------:|
|isNativeToken|boolean|true|Is native token|
|name|string||Token name|
|tokenId|string||Token ID|
|symbol|string||Token symbol|
|accountKeySet|[AccountKeySetModel ](#api_accountketsetmodel)||Account Key set|

Example:
```javascript
// Get total balance
const balanceBN = await account.nativeToken.getTotalBalance();
const balance = balanceBN.toNumber();

// Transfer
 const history = await account.nativeToken.transfer([
    {
      paymentAddressStr: 'receiver-payment-address',
      amount: 10,
      message: ''
    },
    {
    	... more receivers (max 32 receivers)
    }
  ], 10));
}
```

#
### PrivacyTokenInstance <a name="api_privacytokeninstance"></a>
|Public Method|Param|Return|Description|
|----------|:-------------:|------:|------:|
|getTotalBalance||Promise\<BigNumber>|Get total balance (including pending coins)|
|getAvaiableBalance||Promise\<BigNumber>|Get available balance|
|getTxHistories||Promise<[TxHistoryModel](#api_txhistorymodel)[]>|Get all transaction histories (only cached on local)|
|hasExchangeRate||Promise\<boolean>|Is the token has valuable, if true, the token can be used for fee|
|transfer|paymentInfoList: [PaymentInfoModel](#api_paymentinfomodel)[], nativeFee: number, privacyFee: number|Promise\<[TxHistoryModel](#api_txhistorymodel)>|Send in Incognito chain|
|burning|outchainAddress: string, burningAmount: number, nativeFee: number, privacyFee: number|Promise\<[TxHistoryModel](#api_txhistorymodel)>|Burn the token|
|pdeContribution|pdeContributionPairID: string, contributedAmount: number, nativeFee: number, privacyFee: number|Promise\<[TxHistoryModel](#api_txhistorymodel)>|[pDEX] Send PDE contribution|
|requestTrade|tokenIdBuy: string, sellAmount: number, minimumAcceptableAmount: number, nativeFee: number, privacyFee: number, tradingFee: number|Promise\<[TxHistoryModel](#api_txhistorymodel)>|Send trade request|
|withdrawNodeReward||Promise\<[TxHistoryModel](#api_txhistorymodel)>|[Node] Withdraw reward from node|
|bridgeGenerateDepositAddress||Promise\<string>|Get a temporary deposit address (expired after 60 minutes)|
|bridgeWithdraw|outchainAddress: string, decimalAmount: number, nativeFee: number = 0, privacyFee: number = 0, memo?: string|Promise|Withdraw bridged coins (Convert privacy token to origin, your privacy token will be burned and the origin will be returned). Please notice: withdrawal uses the fee (nativeFee or privacyFee) for burning coins|
|bridgeGetHistory||Promise\<[BridgeHistoryModel](#api_bridgehistorymodel)[]>|Get deposit/withdrawal history|

|Public Property|Type|Default value|Description|
|----------|:-------------:|------:|------:|
|isPrivacyToken|boolean|true|Is privacy token|
|name|string||Token name|
|tokenId|string||Token ID|
|symbol|string||Token symbol in Incognito chain|
|accountKeySet|[AccountKeySetModel ](#api_accountketsetmodel)||Account Key set|
|totalSupply|number||Total supply amount was issued|
|bridgeInfo|object||External infomations from other chain for this token (only tokens have the `bridgeInfo` can deposit/withdraw)|

#### bridgeInfo
* symbol: string; `// symbol in other chain`
* pSymbol: string; `// bridge token symbol`
* name: string; `// bridge token name`
* decimals: number; `// decimals in other chain`
* pDecimals: number; `// decimals in Incognito chain`
* contractID: string;
* verified: boolean; `// verified by Incognito`
* type: number; `defined in TOKEN_INFO_CONSTANT.BRIDGE_PRIVACY_TOKEN.TYPE`
* currencyType: number; `defined in TOKEN_INFO_CONSTANT.BRIDGE_PRIVACY_TOKEN.CURRENCY_TYPE`
* status: number;

#
### KeyWalletModel <a name='api_keywalletmodel'></a>
|Public Property|Type|Default value|Description|
|----------|:-------------:|------:|------:|
|keySet|[AccountKeySetModel](#api_accountketsetmodel)||Account Key set|

#
### AccountKeySetModel <a name='api_accountketsetmodel'></a>
|Public Property|Type|Default value|Description|
|----------|:-------------:|------:|------:|
|privateKeySerialized|string||Private key|
|paymentAddressKeySerialized|string||Payment address|
|viewingKeySerialized|string||Viewing key|
|publicKeySerialized|string||Public key|
|privateKey|PrivateKeyModel ||Private key byte|
|paymentAddress|PaymentAddressKeyModel  ||Payment address key byte|
|viewingKey|ViewingKeyModel ||Viewing key byte|
|publicKeyCheckEncode|string|||
|miningSeedKey|string|||
|validatorKey|string|||


#
### TxHistoryModel <a name='api_txhistorymodel'></a>
Tx histories include all transaction histories, not deposit and withdraw and stored in client storage.
|Public Property|Type|Default value|Description|
|----------|:-------------:|------:|------:|
|txId|string|||
|txType|string||Define in [CONSTANT](#api_service).TX_CONSTANT.TX_TYPE|
|lockTime|number|||
|status|number||Define in [CONSTANT](#api_service).TX_CONSTANT.TX_STATUS. Call `historyServices.checkCachedHistories()` to update status.|
|nativeTokenInfo|object||Include native token info (fee, amount, coins, payment info)|
|privacyTokenInfo|object||Include privacy token info (fee, amount, coins, payment info)|
|meta|any|||
|accountPublicKeySerialized|string|||
|historyType|number||Define in [CONSTANT](#api_service).TX_CONSTANT.HISTORY_TYPE|


#
### PaymentInfoModel <a name='api_paymentinfomodel'></a>
|Public Property|Type|Default value|Description|
|----------|:-------------:|------:|------:|
|paymentAddressStr|string|||
|amount|number||||
|message|string|||

#
### BridgeHistoryModel <a name='api_bridgehistorymodel'></a>
Bridge histories include deposit and withdraw transactions and stored in backend.
|Public Property|Type|Default value|Description|
|----------|:-------------:|------:|------:|
|id|number|||
|userID|number||||
|address|string|||
|expiredAt|string|||
|addressType|number||defined in TOKEN_INFO_CONSTANT.BRIDGE_PRIVACY_TOKEN.ADDRESS_TYPE|
|status|number||defined in TOKEN_INFO_CONSTANT.BRIDGE_PRIVACY_TOKEN.HISTORY_STATUS|
|currencyType|number||defined in TOKEN_INFO_CONSTANT.BRIDGE_PRIVACY_TOKEN.CURRENCY_TYPE|
|walletAddress|string|||
|userPaymentAddress|string|||
|requestedAmount|string|||
|receivedAmount|string|||
|incognitoAmount|string|||
|ethereumTx|string|||
|incognitoTx|string|||
|erc20TokenTx|string|||
|privacyTokenAddress|string|||
|erc20TokenAddress|string|||
|createdAt|string|||
|updatedAt|string|||
|decentralized|number||0 is centralized, 1 is decentralized|
|outChainTx|string|||
|inChainTx|string|||


## Examples <a name="examples"></a>
### NodeJS

Source file: `sample/test-node.js`

Command:
`yarn test:node`

### Browser

Source file: `sample/index.html`

Command:
`yarn test:browser`


### React Native

See the [Incognito Wallet Template](https://github.com/incognitochain/incognito-wallet-template)

