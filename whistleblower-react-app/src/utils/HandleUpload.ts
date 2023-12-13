import { ethers } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import { InputBox__factory } from "@cartesi/rollups";

const HARDHAT_LOCALHOST_RPC_URL = "http://localhost:8545";
const HARDHAT_DEFAULT_MNEMONIC =
  "test test test test test test test test test test test junk";
const INPUTBOX_ADDRESS = "0x59b22D57D4f067708AB0c00552767405926dc768";
const DAPP_ADDRESS = "0x70ac08179605af2d9e75782b8decdd3c22aa4d0c";
const accountIndex = 0;

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
      const event = receipt.events?.find((e) => e.event === "InputAdded");
      return tx.hash;
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
    // Resto del código
    return transactionHash;
  } catch (error) {
    console.error("Error en HandleUpload:", error);
    throw error;
  }
}
