// import handler from "../commands/input_commands/send_file";
// import { Args as ConnectArgs } from "../connect";
// import { Args as RollupsArgs } from "../rollups";
import { ethers } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import { InputBox__factory } from "@cartesi/rollups";

// interface Args extends ConnectArgs, RollupsArgs {
//   path: string;
// }
const HARDHAT_LOCALHOST_RPC_URL = "http://localhost:8545";
const HARDHAT_DEFAULT_MNEMONIC =
  "test test test test test test test test test test test junk";
const INPUTBOX_ADDRESS = "0x59b22D57D4f067708AB0c00552767405926dc768";
const DAPP_ADDRESS = "0x70ac08179605af2d9e75782b8decdd3c22aa4d0c";
const accountIndex = 0;
export default function HandleUpload(imageUrl: any) {
  const sendInput = async () => {
    // setLoading(True)
    //Se inicia la coneccion al nodo
    const provider = new JsonRpcProvider(HARDHAT_LOCALHOST_RPC_URL);
    const signer = ethers.Wallet.fromMnemonic(
      HARDHAT_DEFAULT_MNEMONIC,
      `m/44'/60'/0'/0/${accountIndex}`
    ).connect(provider);
    //Se instancia el contrato de InputBox
    const inputBox = InputBox__factory.connect(INPUTBOX_ADDRESS, signer);
    //Encodeo del input si no viene en bytes
    const inputBytes = ethers.utils.isBytesLike(imageUrl)
      ? imageUrl
      : ethers.utils.toUtf8Bytes(imageUrl);
    //Envio la tx
    const tx = await inputBox.addInput(DAPP_ADDRESS, inputBytes);
    console.log(`Se envio la transaccion: ${tx.hash}`);
    //Aca va la notificacion
    //TODO Toast notification
    //Espera confirmacion de la tx
    console.log("Esperando confirmacion de la tx...");
    const receipt = await tx.wait(1);
    //Busco el evento que se mando
    const event = receipt.events?.find((e) => e.event === "InputAdded");
    // setLoading(false)
    //Aca va el toast de transaction confirmed
    //TODO tx confirmed toast
    // console.log(`Input added => index: ${event?.args.inputIndex}`);
  };
  sendInput();
  //   const handleUpload = async (imageFile: any) => {
  //     // const API_URL = "http://localhost:5001";
  //     if (imageFile) {
  //       const formData = new FormData();
  //       formData.append("file", imageFile);
  //       const args: Args = {
  //         rpc: "http://localhost:8545",
  //         mnemonic: "test test test test test test test test test test test junk",
  //         accountIndex: 0,
  //         path: "",
  //         dapp: "",
  //       };
  //       try {
  //         // const receipt = await handler(args);
  //         // console.log(`La imagen llega con exito: ${receipt}`);
  //         console.log("Entre al try");
  //         return;
  //       } catch (error) {
  //         console.error("Error al subir la imagen", error);
  //       }
  //     } else {
  //       console.warn("No se ha seleccionado ningún archivo");
  //       return;
  //     }
  //   };
  //   handleUpload(imageUrl);
}
// export default HandleUpload;
// function useState(arg0: number): [any] {
//     throw new Error("Function not implemented.");
// }
