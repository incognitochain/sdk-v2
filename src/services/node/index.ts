import AccountKeySetModel from "@src/models/key/accountKeySet";
import rpc from "../rpc";

export async function getRewardAmount(accountKeySet: AccountKeySetModel) {
  const res = await rpc.getRewardAmount(accountKeySet.paymentAddressKeySerialized);
  
  return res.rewards;
}

export async function getStakerStatus(blsPubKeyB58CheckEncode: string) {
  const res = await rpc.getPublicKeyRole(`bls:${blsPubKeyB58CheckEncode}`);

  return res.status;
}