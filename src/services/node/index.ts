import AccountKeySetModel from "@src/models/key/accountKeySet";
import Validator from '@src/utils/validator';
import rpc from "../rpc";

export async function getRewardAmount(accountKeySet: AccountKeySetModel) {
  new Validator('accountKeySet', accountKeySet).required();

  const res = await rpc.getRewardAmount(accountKeySet.paymentAddressKeySerialized);
  
  return res.rewards;
}

export async function getStakerStatus(blsPubKeyB58CheckEncode: string) {
  new Validator('blsPubKeyB58CheckEncode', blsPubKeyB58CheckEncode).required().string();

  const res = await rpc.getPublicKeyRole(`bls:${blsPubKeyB58CheckEncode}`);

  return res.status;
}