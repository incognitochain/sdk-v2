import AccountKeySetModel from "@src/models/key/accountKeySet";
import rpc from "../rpc";

export async function getRewardAmount(accountKeySet: AccountKeySetModel) {
  const res = await rpc.getRewardAmount(accountKeySet.paymentAddressKeySerialized);
  
  return res.rewards;
}