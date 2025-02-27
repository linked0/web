import { BytesLike } from "ethers";
export interface UserOperation {
  sender: string;
  signature: BytesLike;
}
