import { ContractReceipt, ethers } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import { InputBox__factory } from "@cartesi/rollups";
import { InputAddedEvent } from "@cartesi/rollups/dist/src/types/contracts/inputs/IInputBox";
import { InputKeys } from "../../src/types";

const HARDHAT_LOCALHOST_RPC_URL = "http://localhost:8545";
const HARDHAT_DEFAULT_MNEMONIC =
  "test test test test test test test test test test test junk";
const INPUTBOX_ADDRESS = "0x59b22D57D4f067708AB0c00552767405926dc768";
const DAPP_ADDRESS = "0x70ac08179605af2d9e75782b8decdd3c22aa4d0c";
const accountIndex = 0;

export const getInputKeys = (receipt: ContractReceipt): InputKeys => {
  // get InputAddedEvent from transaction receipt
  const event = receipt.events?.find((e) => e.event === "InputAdded");
  console.log(event);
  if (!event) {
    throw new Error(
      `InputAdded event not found in receipt of transaction ${receipt.transactionHash}`
    );
  }

  const inputAdded = event as InputAddedEvent;
  return {
    input_index: inputAdded.args.inputIndex.toNumber(),
  };
};
export default async function HandleUpload(imageUrl: any) {
  const sendInput = async () => {
    try {
      const provider = new JsonRpcProvider(HARDHAT_LOCALHOST_RPC_URL);
      const signer = ethers.Wallet.fromMnemonic(
        HARDHAT_DEFAULT_MNEMONIC,
        `m/44'/60'/0'/0/${accountIndex}`
      ).connect(provider);
      const inputBox = InputBox__factory.connect(INPUTBOX_ADDRESS, signer);
      const inputBytes = ethers.utils.isBytesLike(imageUrl)
        ? imageUrl
        : ethers.utils.toUtf8Bytes(imageUrl);
      const tx = await inputBox.addInput(DAPP_ADDRESS, inputBytes);
      console.log(`Se envió la transacción: ${tx.hash}`);
      console.log("Esperando confirmación de la tx...");
      const receipt = await tx.wait(1);
      const inputKeys = getInputKeys(receipt);
      // const event = receipt.events?.find((e) => e.event === "InputAdded");
      return { hash: tx.hash, input: inputKeys };
    } catch (error) {
      console.error("Error al enviar la transacción", error);
      throw error;
    }
  };

  try {
    const transactionHash = await sendInput();
    console.log(
      "File successfully submitted. Transaction ID:",
      transactionHash
    );
    return transactionHash;
  } catch (error) {
    console.error("Error en HandleUpload:", error);
    throw error;
  }
}
