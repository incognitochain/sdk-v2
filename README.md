**Table of Contents**

[TOC]

# Get Started
## Install
`$ yarn add https://github.com/incognitochain/sdk-v2#develop` 
or
`$ yarn add https://github.com/incognitochain/sdk-v2`

Please use branch #develop. We are building sdk-v2.
Follow example at https://github.com/incognitochain/sdk-v2/blob/master/sample/test-node.js

## Usage 

### Nodejs

Copy wasm binary to your root project:

`cp node_modules/incognito-js/privacy.wasm .`

```javascript
const incognitoJs = require('incognito-js/build/node');

// Load WebAssembly:
await incognitoJs.goServices.implementGoMethodUseWasm();
```

Follow this step to [implement storage.](#Implement storage)

-------------
### Browser

Copy wasm binary to your root project:

`cp node_modules/incognito-js/privacy.wasm .`

Module
```javascript
import * as incognitoJs from 'incognito-js';

// Load WebAssembly:
await incognitoJs.goServices.implementGoMethodUseWasm();
```

Or import  Javascript file to html (`incognitoJs` object is attached to your browser window object.)
```html
<script src="...incognito-js/build/web/browser/index.js"></script>
<script>
	// Load WebAssembly:
	await incognitoJs.goServices.implementGoMethodUseWasm();
</script>
```
Follow this step to [implement storage.](#Implement storage)

-------------
### React Native

Please use [react-native-incognito-js](https://github.com/incognitochain/react-native-incognito-js) for React Native and follow this step to [implement storage.](#Implement storage)

### Implement storage

`incognitoJs` need to cache some data into storage to work correctly like coin infomation, tx history,... So please implement incognitoJs storage service:

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

# API
## Config

### setConfig

Usage:
```javascript
setConfig (
	logMethod: (message: string) => void (pass null to disable log)
	chainURL: string //
	apiURL: string
	mainnet: boolean // update this property will change apiURL & chainURL if they are not defined
	wasmPath: string // path to the binary file, the SDK will find the wasm in where it was executed
) => void
```

Example:
```javascript
const { setConfig  } = incognitoJs;

// config incognito JS use testnet
setConfig({ mainnet: false });

// config incognito JS use log
setConfig({ logMethod: function(logMessage) {
	console.log(`LOG: ${logMessage}`);
} });
```

### getConfig

Get current config.

## History services

### getTxHistoryByPublicKey
Get histories belong to an account (use account's `publicKeySerialized` as a key).

Usage:
```javascript
getTxHistoryByPublicKey(
	publicKeySerialized: string,
	tokenId?: string
) => Promise<TxHistoryModel[]>
```

Example:
```javascript
const { historyServices  } = incognitoJs;

// load all tx histories for native token
const histories = await historyServices.getTxHistoryByPublicKey(
	account.key.keySet.publicKeySerialized, // publicKeySerialized of the account
	null // token id or use null for native token
);
```

### checkCachedHistories
Get update for all cached tx histories (tx histories are send/init/burn/trade/contribute transactions).

Usage:
```javascript
checkCachedHistories() => Promise
```

Example:
```javascript
const { historyServices  } = incognitoJs;

await historyServices.checkCachedHistories(); // all tx histories were up to date

// load all tx histories for native token
const updatedHistories = await account.nativeToken.getTxHistories();
```

## Go Services

`incognitoJs` uses some methods implemented by Go to improve performance. Go will be built to WASM (Web Assembly) for Nodejs/browser enviroments and Gomobile for React Native.

### implementGoMethodUseWasm

Used on Nodejs/browser enviroments.


Usage:
```javascript
implementGoMethodUseWasm() => Promise
```

Example:
```javascript
const { goServices  } = incognitoJs;

await goServices.implementGoMethodUseWasm();

console.log('Go methods were implemented!')
```

### implementGoMethodManually

Implement go methods manually (for React Native).
Please use [react-native-incognito-js](https://github.com/incognitochain/react-native-incognito-js), it is a `incognitoJs` library wrapper, all Go methods have been implemented already.


Usage:
```javascript
// define Go methods
const implementData = {
	deriveSerialNumber: (data: string) => string;
	initPrivacyTx: (data: string) => string;
	randomScalars: (data: string) => string;
	staking: (data: string) => string;
	stopAutoStaking: (data: string) => string;,
	initPrivacyTokenTx: (data: string) => string;
	withdrawDexTx: (data: string) => string;
	initPTokenTradeTx: (data: string) => string;
	initPRVTradeTx: (data: string) => string;
	initPTokenContributionTx: (data: string) => string;
	initPRVContributionTx: (data: string) => string;
	initWithdrawRewardTx: (data: string) => string;
	initBurningRequestTx: (data: string) => string;
	generateKeyFromSeed: (data: string) => string;
	scalarMultBase: (data: string) => string;
	hybridEncryptionASM: (data: string) => string;
	hybridDecryptionASM: (data: string) => string;
	generateBLSKeyPairFromSeed: (data: string) => string;
};

// implement
implementGoMethodManually(implementData) => Promise
```

Example:
```javascript
const { goServices  } = incognitoJs;

await goServices.implementGoMethodManually({ ... });

console.log('Go methods were implemented!')
```

### Go method name

List of Go method names.

Example:
```javascript
const { goServices  } = incognitoJs;

console.log(goServices.GO_METHOD_NAMES)
```

## Wallet services

### setPrivacyUtilRandomBytesFunc

Implement random bytes function.

Usage:
```javascript
setPrivacyUtilRandomBytesFunc(Function) => void
```

Example:
```javascript
import myRandomByteFunction from '..';
const { walletServices  } = incognitoJs;

walletServices.setPrivacyUtilRandomBytesFunc(myRandomByteFunction);
```

## Storage Services

### implement

Implement storage.

Usage:
```javascript
// implement data
const data = {
	setMethod(key: string, data: string) : Promise;
	getMethod(key: string) : Promise;
	removeMethod(key: string) : Promise
	namespace: string; (optional)
};

// implement
implement(data) => void
```

Example:
```javascript
const { storageService  } = incognitoJs;

storageService.implement({ ... });
```

## Bridge Services
### removeBridgeHistory

Cancel/remove a deposit/withrawal history.

Usage:
```javascript
removeBridgeHistory({
	historyId: number,
	currencyType: number,
	isDecentralized: boolean
}) => Promise
```

Example:
```javascript
const { bridgeServices   } = incognitoJs;

bridgeServices.removeBridgeHistory({ ... });
```

## Constant

All of constants used in the library.


Example:
```javascript
const { CONSTANT } = incognitoJs;

console.log('Incognito JS constants:', CONSTANT);
```

## WalletInstance

|Public Property|Type|Default value|Description|
|----------|:-------------:|------:|------:|
|seed|Uint8Array|||
|entropy|number[ ]|||
|mnemonic|string|||
|masterAccount|MasterAccount||The main account in wallet|
|name|string||Wallet name|

### init

Init a new wallet.

Usage:
```javascript
init(passPhrase: string, name?: string) => Promise<WalletInstance>
```

Example:
```javascript
const { WalletInstance } = incognitoJs;

const wallet = new WalletInstance();
await wallet.init('my-passphrase', 'TEST-WALLET');

console.log('New wallet', wallet);
```
### backup
Backup wallet with password.

Usage:
```javascript
backup(password: string) => string
```

Example:
```javascript
const backupWalletString = wallet.backup('backup-password');

console.log('Backed up wallet string', backupWalletString);
```

### restore
Restore a wallet from backup.

Usage:
```javascript
restore(encryptedWallet: string, password: string) => Promise<WalletInstance>
```

Example:
```javascript
const { WalletInstance   } = incognitoJs;

const wallet = await WalletInstance.restore(backupWalletString, 'backup-password');

console.log('Restored wallet', wallet);
```

## MasterAccount

MasterAccount is a special account, the Incognito wallet is only have one MasterAccount, this account can contain many Accounts (or AccountInstance)

|Public Property|Type|Default value|Description|
|----------|:-------------:|------:|------:|
|child|array|[ ]|Array of chilren account|
|key|KeyWalletModel||Key wallet|

### getAccounts

Get all child accounts.

Usage:
```javascript
getAccounts() => <AccountInstance>[ ]
```

Example:
```javascript
const accounts = wallet.masterAccount.getAccounts();
console.log('Account list', accounts);
```

### addAccount

Create a child account, `shardId` will be randomly selected if not provided

Usage:
```javascript
addAccount(name: string, shardId?: number) => Promise<AccountInstance>
```

Example:
```javascript
// create an account with shard ID 3
const account1 = await wallet.masterAccount.addAccount('Account 1', 3);
console.log('Account with shard ID 3', account1);

// create an account with random shardID
const account2 = await wallet.masterAccount.addAccount('Account 2');
console.log('Account with random shard ID', account2);
```

### removeAccount

Remove an account by name.

Usage:
```javascript
removeAccount(name: string) => void
```

Example:
```javascript
// remove account name "Account 1"
wallet.masterAccount.removeAccount('Account 1');

console.log('Remaining accounts', wallet.masterAccount.getAccounts());
```

### importAccount

Import account from its private key.

Usage:
```javascript
importAccount(name: string, privateKey: string) => Promise<AccountInstance>
```

Example:
```javascript
// import account with private key "ABCDEF"
const importedAccount = await wallet.masterAccount.importAccount('Imported account', 'ABCDEF');

console.log('Imported account', importedAccount);
```

### getBackupData

Return backup object for the account.

Usage:
```javascript
getBackupData() => string
```

Example:
```javascript
const backupObject = wallet.masterAccount.getBackupData();
console.log('Account backup', backupObject);
```

### restoreFromBackupData

Restore from backup object for the account.

Usage:
```javascript
restoreFromBackupData(backupObject) => MasterAccount
```

Example:
```javascript
const { MasterAccount } = incognitoJs;
const masterAccount = MasterAccount.restoreFromBackupData(backupObject);

console.log('Restored master account', masterAccount);
```

## AccountInstance

AccountInstance is child account belong to MasterAccount

|Public Property|Type|Default value|Description|
|----------|:-------------:|------:|------:|
|name|string||Account name|
|isImport|boolean|false|Is this account was imported or not|
|key|KeyWalletModel||Key wallet|
|nativeToken|NativeTokenInstance||Native token is PRV|
|privacyTokenIds|string[]||List of following PrivacyTokenInstance id|

### getBLSPublicKeyB58CheckEncode

Get BLS public key.

Usage:
```javascript
getBLSPublicKeyB58CheckEncode() => Promise<string>
```

Example:
```javascript
const blsPublicKey = await account.getBLSPublicKeyB58CheckEncode();

console.log('BLS Public Key', blsPublicKey);
```

### followTokenById

Add a token id to following list of the account.

Usage:
```javascript
followTokenById(tokenId: string) => void
```

Example:
```javascript
// follow pBTC
account.followTokenById("b832e5d3b1f01a4f0623f7fe91d6673461e1f5d37d91fe78c5c2e6183ff39696");

const followingTokens = await account.getFollowingPrivacyToken();
console.log('Following tokens', followingTokens);
console.log('Following token ids', account.privacyTokenIds);
```

### unfollowTokenById

Remove a token id from following list.

Usage:
```javascript
unfollowTokenById(tokenId: string) => void
```

Example:
```javascript
// unfollow pBTC
account.unfollowTokenById("b832e5d3b1f01a4f0623f7fe91d6673461e1f5d37d91fe78c5c2e6183ff39696");

const followingTokens = await account.getFollowingPrivacyToken();
console.log('Following tokens', followingTokens);
console.log('Following token ids', account.privacyTokenIds);
```

### issuePrivacyToken

Issue new Incognito token.

Usage:
```javascript
issuePrivacyToken({
	tokenName: string,
	tokenSymbol: string,
	supplyAmount: number,
	nativeTokenFee: number
}) => Promise<TxHistoryModel>
```

Example:
```javascript
const history = await account.issuePrivacyToken({
	tokenName: 'test token',
	tokenSymbol: 'test',
	supplyAmount: 100000,
	nativeTokenFee: 20 // fee in nano PRV
});

console.log('Issued new token with history', history);
```

### getFollowingPrivacyToken

Get following token(s), if `tokenId` is not provided, all tokens will be returned.

Usage:
```javascript
getFollowingPrivacyToken(tokenId?: string)
	=> 	Promise<PrivacyTokenInstance | PrivacyTokenInstance[]>
```

Example:
```javascript
// Get all following tokens
const tokens = await account.getFollowingPrivacyToken();
console.log('All following tokens', tokens);

// Get follow token info with ID
const token = await account.getFollowingPrivacyToken('token-id');
console.log('Token info', token);
```

### getNodeRewards

For Node only - Get rewards.

Usage:
```javascript
getNodeRewards() => Promise<object>
```

Example:
```javascript
const rewards = await account.getNodeRewards();
console.log('All rewards', rewards);
```

### getNodeStatus

For Node only - Get node status.

Usage:
```javascript
getNodeStatus() => Promise<object>
```

Example:
```javascript
const status = await account.getNodeStatus();
console.log('Node status', status);
```

## NativeTokenInstance

|Public Property|Type|Default value|Description|
|----------|:-------------:|------:|------:|
|isNativeToken|boolean|true|Is native token|
|name|string||Token name|
|tokenId|string||Token ID|
|symbol|string||Token symbol|
|accountKeySet|AccountKeySetModel||Account Key set|

### getTotalBalance

Get total balance (including pending coins).

Usage:
```javascript
getTotalBalance() => Promise<BigNumber>
```

Example:
```javascript
const balanceBN = await account.nativeToken.getTotalBalance();
console.log('Native token total balance', balanceBN.toNumber());
```

### getAvaiableBalance

Get available balance.

Usage:
```javascript
getAvaiableBalance() => Promise<BigNumber>
```

Example:
```javascript
const balanceBN = await account.nativeToken.getAvaiableBalance();
console.log('Native token available balance', balanceBN.toNumber());
```

### getTxHistories

Get all transaction histories (cached on local).

Usage:
```javascript
getTxHistories() => Promise<TxHistoryModel[]>
```

Example:
```javascript
const histories = await account.nativeToken.getTxHistories();
console.log('Native token tx histories', histories);
```

### transfer

Send native token in Incognito chain.

Usage:
```javascript
transfer(paymentInfoList: PaymentInfoModel[], nativeFee: number)
	=> Promise<TxHistoryModel>
```

Example:
```javascript
const history = await account.nativeToken.transfer(
	[
		{
			paymentAddressStr: otherAccount.key.keySet.paymentAddressKeySerialized,
			amount: 10,
			message: ''
		}
	],
	20 // fee in nano PRV
);
console.log('Native token sent with history', history);
```

### requestStaking

[Node] Send staking request.

Usage:
```javascript
requestStaking(rewardReceiverPaymentAddress: string, nativeFee: number)
	=> Promise<TxHistoryModel>
```

Example:
```javascript
const history = await account.nativeToken.requestStaking(
	receiverAccount.key.keySet.paymentAddressKeySerialized,
	20 // fee in nano PRV
);
console.log('Native token sent stake request with history', history);
```

### pdeContribution

[pDEX] Send PDE contribution.

Usage:
```javascript
pdeContribution(
	pdeContributionPairID: string,
	contributedAmount: number,
	nativeFee: number
) => Promise<TxHistoryModel>
```

### requestTrade

Send trade request

Usage:
```javascript
requestTrade (
	tokenIdBuy: string,
	sellAmount: number,
	minimumAcceptableAmount: number,
	nativeFee: number,
	tradingFee: number
) => Promise<TxHistoryModel>
```

### withdrawNodeReward

[Node] Withdraw reward from node.

Usage:
```javascript
withdrawNodeReward() => Promise<TxHistoryModel>
```

## PrivacyTokenInstance

|Public Property|Type|Default value|Description|
|----------|:-------------:|------:|------:|
|isPrivacyToken|boolean|true|Is privacy token|
|name|string||Token name|
|tokenId|string||Token ID|
|symbol|string||Token symbol in Incognito chain|
|accountKeySet|AccountKeySetModel||Account Key set|
|totalSupply|number||Total supply amount was issued|
|[bridgeInfo](#bridgeInfo)|object||External infomations from other chain for this token (only tokens have the `bridgeInfo` can deposit/withdraw)|

#### bridgeInfo
* symbol: string; // symbol in other chain
* pSymbol: string; // bridge token symbol
* name: string; // bridge token name
* decimals: number; // decimals in other chain
* pDecimals: number; // decimals in Incognito chain
* contractID: string;
* verified: boolean; // verified by Incognito
* type: number; defined in TOKEN_INFO_CONSTANT.BRIDGE_PRIVACY_TOKEN.TYPE
* currencyType: number; defined in TOKEN_INFO_CONSTANT.BRIDGE_PRIVACY_TOKEN.CURRENCY_TYPE
* status: number;

### getTotalBalance

Get total balance (including pending coins).

Usage:
```javascript
getTotalBalance() => Promise<BigNumber>
```

Example:
```javascript
const token = await account.getFollowingPrivacyToken('token-id');
const balanceBN = await token.getTotalBalance();
console.log('Token total balance', balanceBN.toNumber());
```

### getAvaiableBalance

Get available balance.

Usage:
```javascript
getAvaiableBalance() => Promise<BigNumber>
```

Example:
```javascript
const token = await account.getFollowingPrivacyToken('token-id');
const balanceBN = await token.getAvaiableBalance();
console.log('Token available balance', balanceBN.toNumber());
```

### getTxHistories

Get all transaction histories (cached on local).

Usage:
```javascript
getTxHistories() => Promise<TxHistoryModel[]>
```

Example:
```javascript
const token = await account.getFollowingPrivacyToken('token-id');
const histories = await token.getTxHistories();
console.log('Token tx histories', histories);
```

### hasExchangeRate

Is the token has valuable, if true, the token can be used for fee.

Usage:
```javascript
hasExchangeRate() => Promise<boolean>
```

Example:
```javascript
const token = await account.getFollowingPrivacyToken('token-id');
const isHasRate = await token.hasExchangeRate();

console.log(`This token ${isHasRate === true ? 'has' : 'not has'} rate`);
```

### transfer

Send privacy token in Incognito chain.

Usage:
```javascript
transfer(
	paymentInfoList: PaymentInfoModel[],
	nativeFee: number,
	privacyFee: number
) => Promise<TxHistoryModel>
```

Example:
```javascript
const token = await account.getFollowingPrivacyToken('token-id');
const history = await token.transfer(
	[
		{
			paymentAddressStr: otherAccount.key.keySet.paymentAddressKeySerialized,
			amount: 10,
			message: ''
		}
	],
	20, // fee in nano PRV
	0 // the privacy token must has exchange rate to be fee
);
console.log('Privacy token sent with history', history);
```

### burning

Burn the token.

Usage:
```javascript
transfer(
	outchainAddress: string,
	burningAmount: number,
	nativeFee: number,
	privacyFee: number
) => Promise<TxHistoryModel>
```

Example:
```javascript
// burning ETH
const token = await account.getFollowingPrivacyToken('peth-token-id');
const history = await token.burning(
	'ETH wallet address',
	2000, // burning amount,
	20, // fee in nano PRV
	0 // the privacy token must has exchange rate to be fee
);
console.log('Privacy token burned with history', history);
```

### pdeContribution

[pDEX] Send PDE contribution.

Usage:
```javascript
pdeContribution(
	pdeContributionPairID: string,
	contributedAmount: number,
	nativeFee: number,
	privacyFee: number
) => Promise<TxHistoryModel>
```

### requestTrade

Send trade request.

Usage:
```javascript
requestTrade (
	tokenIdBuy: string,
	sellAmount: number,
	minimumAcceptableAmount: number,
	nativeFee: number,
	privacyFee: number,
	tradingFee: number
) => Promise<TxHistoryModel>
```

### withdrawNodeReward

[Node] Withdraw reward from node.

Usage:
```javascript
withdrawNodeReward() => Promise<TxHistoryModel>
```

### bridgeGenerateDepositAddress

Get a temporary deposit address (expired after 60 minutes).

Usage:
```javascript
bridgeGenerateDepositAddress() => Promise<string>
```

Example:
```javascript
// deposit ETH
const token = await account.getFollowingPrivacyToken('peth-token-id');
const ethDepositAddress = await token.bridgeGenerateDepositAddress();

console.log('ETH deposit address', ethDepositAddress);
```

### bridgeWithdraw

Withdraw bridged coins (Convert privacy token to origin, your privacy token will be burned and the origin will be returned). Please notice: withdrawal uses the fee (nativeFee or privacyFee) for burning coins.

Usage:
```javascript
bridgeWithdraw(
	outchainAddress: string,
	decimalAmount: number,
	nativeFee: number = 0,
	privacyFee: number = 0,
	memo?: string
) => Promise
```

Example:
```javascript
// withdraw 0.5 pETH to Ethereum wallet address "ETH-wallett-address'
const token = await account.getFollowingPrivacyToken('peth-token-id');
await token.bridgeWithdraw(
	'ETH-wallett-address',
	0.5,
	20,
	0
);

console.log('ETH withdrew');
```

### bridgeGetHistory

Get deposit/withdrawal history.

Usage:
```javascript
bridgeGetHistory() => Promise<BridgeHistoryModel[]>
```

## KeyWalletModel

|Public Property|Type|Default value|Description|
|----------|:-------------:|------:|------:|
|keySet|AccountKeySetModel||Account Key set|

## AccountKeySetModel

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

## TxHistoryModel

Tx histories include all transaction histories, not deposit and withdraw and stored in client storage.

|Public Property|Type|Default value|Description|
|----------|:-------------:|------:|------:|
|txId|string|||
|txType|string||Define in CONSTANT.TX_CONSTANT.TX_TYPE|
|lockTime|number|||
|status|number||Define in CONSTANT.TX_CONSTANT.TX_STATUS. Call `historyServices.checkCachedHistories()` to update status.|
|nativeTokenInfo|object||Include native token info (fee, amount, coins, payment info)|
|privacyTokenInfo|object||Include privacy token info (fee, amount, coins, payment info)|
|meta|any|||
|accountPublicKeySerialized|string|||
|historyType|number||Define in CONSTANT.TX_CONSTANT.HISTORY_TYPE|

## PaymentInfoModel

|Public Property|Type|Default value|Description|
|----------|:-------------:|------:|------:|
|paymentAddressStr|string|||
|amount|number||||
|message|string|||

## BridgeHistoryModel

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

# Examples

## NodeJS

Source file: `sample/test-node.js`

Command:
`yarn test:node`

## Browser

Source file: `sample/index.html`

Command:
`yarn test:browser`


## React Native

See the [Incognito Wallet Template](https://github.com/incognitochain/incognito-wallet-template)
