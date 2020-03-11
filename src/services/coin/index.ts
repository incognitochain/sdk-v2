import bn from 'bn.js';
import { checkEncode, checkDecode } from '@src/utils/base58';
import { ENCODE_VERSION, ED25519_KEY_SIZE } from '@src/constants/constants';
import rpcClient from '@src/services/rpc';
import goMethods from '@src/go';
import { base64Decode } from '@src/privacy/utils';
import { hybridDecryption } from '@src/privacy/hybridEncryption';
import CoinModel from '@src/models/coin';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import Validator from '@src/utils/validator';

/** getAllOutputCoins returns all output coins with tokenID, for native token: tokenId is null
   *
   */
export async function getAllOutputCoins(accountKeySet: AccountKeySetModel, tokenId: string): Promise<CoinModel[]> {
  new Validator('accountKeySet', accountKeySet).required();
  new Validator('tokenId', tokenId).required().string();

  const paymentAddress = accountKeySet.paymentAddressKeySerialized;
  const viewingKey = accountKeySet.viewingKeySerialized;
  const receivingKeyBytes = accountKeySet.viewingKey.receivingKeyBytes;

  let response = await rpcClient.getOutputCoin(paymentAddress, viewingKey, tokenId);
  let allOutputCoinStrs = response.outCoins;

  // decrypt ciphertext in each outcoin to get randomness and value
  if (!viewingKey) {
    for (let i = 0; i < allOutputCoinStrs.length; i++) {
      let value = parseInt(allOutputCoinStrs[i].value);
      if (value === 0) {
        let ciphertext = allOutputCoinStrs[i].coinDetailsEncrypted;
        let ciphertextBytes = checkDecode(ciphertext).bytesDecoded;
        if (ciphertextBytes.length > 0) {
          let plaintextBytes = await hybridDecryption(receivingKeyBytes, ciphertextBytes);

          let randomnessBytes = plaintextBytes.slice(0, ED25519_KEY_SIZE);
          let valueBytes = plaintextBytes.slice(ED25519_KEY_SIZE);
          let valueBN = new bn(valueBytes);

          allOutputCoinStrs[i].randomness = checkEncode(randomnessBytes, ENCODE_VERSION);
          allOutputCoinStrs[i].value = valueBN.toString();
        }
      }
    }
  }
  return allOutputCoinStrs;
}

/**
 * deriveSerialNumbers returns list of serial numbers of input coins
   *
   */
export async function deriveSerialNumbers(accountKeySet: AccountKeySetModel, coins: CoinModel[] = []) : Promise<{ coins: CoinModel[], serialNumberList: string[] }> {
  new Validator('accountKeySet', accountKeySet).required();
  new Validator('coins', coins).required().array();

  const privateKey = accountKeySet.privateKeySerialized;
  let serialNumberList = new Array(coins.length);
  let serialNumberBytes = new Array(coins.length);
  let snds = new Array(coins.length);

  if (coins?.length) {
    // calculate serial number (Call WASM/gomobile function)
    for (let i = 0; i < coins.length; i++) {
      snds[i] = coins[i].snDerivator;
    }
  
    let param = {
      privateKey,
      snds
    };
  
    let paramJson = JSON.stringify(param);
  
    let res = await goMethods.deriveSerialNumber(paramJson);
    if (res === null || res === '') {
      throw new ErrorCode('Can not derive serial number');
    }

    let tmpBytes = base64Decode(res);
    for (let i = 0; i < snds.length; i++) {
      serialNumberBytes[i] = tmpBytes.slice(i * ED25519_KEY_SIZE, (i + 1) * ED25519_KEY_SIZE);
      serialNumberList[i] = checkEncode(serialNumberBytes[i], ENCODE_VERSION);
      coins[i].serialNumber = serialNumberList[i];
    }
  }

  return {
    serialNumberList,
    coins,
  };
}

export function getValueFromCoins(coins: CoinModel[]): bn {
  new Validator('coins', coins).required().array();

  return coins?.reduce((totalAmount, coin) => totalAmount.add(new bn(coin.value)), new bn(0)) || new bn(0);
}

export function chooseBestCoinToSpent(coins: CoinModel[], amountBN: bn): {
  resultInputCoins: CoinModel[],
  remainInputCoins: CoinModel[],
  totalResultInputCoinAmount: bn
} {
  new Validator('coins', coins).required().array();
  new Validator('amountBN', amountBN).required();

  if  (amountBN.gt(new bn(0))) {
    let resultInputCoins: CoinModel[] = [];
    let remainInputCoins: CoinModel[] = [];
    let totalResultInputCoinAmount = new bn(0);
  
    // either take the smallest coins, or a single largest one
    let inCoinOverAmount = null;
    let inCoinsUnderAmount = [];
  
    for (let i = 0; i < coins.length; i++) {
      if (new bn(coins[i].value).cmp(amountBN) === -1) {
        inCoinsUnderAmount.push(coins[i]);
      } else if (inCoinOverAmount === null) {
        inCoinOverAmount = coins[i];
      } else if (new bn(inCoinOverAmount.value).cmp(new bn(coins[i].value)) === 1) {
        remainInputCoins.push(coins[i]);
      } else {
        remainInputCoins.push(inCoinOverAmount);
        inCoinOverAmount = coins[i];
      }
    }
  
    inCoinsUnderAmount.sort(function (a, b) {
      return new bn(a.value).cmp(new bn(b.value));
    });
  
    for (let i = 0; i < inCoinsUnderAmount.length; i++) {
      if (totalResultInputCoinAmount.cmp(amountBN) === -1) {
        totalResultInputCoinAmount = totalResultInputCoinAmount.add(new bn(inCoinsUnderAmount[i].value));
        resultInputCoins.push(inCoinsUnderAmount[i]);
      } else {
        remainInputCoins.push(inCoinsUnderAmount[i]);
      }
    }
  
    console.log('chooseBestCoinToSpent inCoinOverAmount: ', inCoinOverAmount);
  
    if (inCoinOverAmount != null && (new bn(inCoinOverAmount.value).cmp(amountBN.mul(new bn(2))) === 1 || totalResultInputCoinAmount.cmp(amountBN) === -1)) {
      remainInputCoins.push(...resultInputCoins);
      resultInputCoins = [inCoinOverAmount];
      totalResultInputCoinAmount = new bn(inCoinOverAmount.value);
    } else if (inCoinOverAmount != null) {
      remainInputCoins.push(inCoinOverAmount);
    }
  
    if (totalResultInputCoinAmount.cmp(amountBN) === -1) {
      throw new ErrorCode('Not enough coin');
    } else {
      console.timeEnd('chooseBestCoinToSpent');
      return {
        resultInputCoins: resultInputCoins,
        remainInputCoins: remainInputCoins,
        totalResultInputCoinAmount: totalResultInputCoinAmount
      };
    }
  } else {
    return {
      resultInputCoins: <CoinModel[]>[],
      remainInputCoins: coins,
      totalResultInputCoinAmount: new bn(0)
    };
  }  
};