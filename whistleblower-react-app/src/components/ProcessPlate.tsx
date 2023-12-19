import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import HandleUpload from "../utils/HandleUpload";
import { Button, Typography, Paper, CircularProgress } from "@mui/material";
import ShowResult from "./ShowResult";
import ProgressDisplay from "./ProgressDisplay";
import CropImage from "./CropImage";
import {
  createTheme,
  PaletteOptions,
  CommonColors,
  ThemeProvider,
} from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#7b3888",
    },
    secondary: {
      main: "#808080",
    },
    success: {
      main: "#f37536",
    },
  },
});

export default function ProcessPlate() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagen, setImagen] = useState<string>();
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [processingMessage, setProcessingMessage] = useState<string>("");
  const [showOutput, setShowOutput] = useState<boolean>(false);
  const [showSelectImageButton, setShowSelectImageButton] =
    useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [showSendAnotherButton, setShowSendAnotherButton] =
    useState<boolean>(false);
  const [transactionCompleted, setTransactionCompleted] =
    useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<number[]>([
    330,
    355,
    558 - 330,
    430 - 355,
  ]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
    const imagen = URL.createObjectURL(file);
    setImagen(imagen);
  };

  const handleSendAnotherImage = () => {
    setImagen(undefined);
    setResult(null);
    setProgress(0);
    setShowSelectImageButton(true);
    setShowSendAnotherButton(false);
    setShowOutput(false);
    setTransactionCompleted(false);
    setTransactionId(null);
  };

  const handleClick = async () => {
    try {
      setLoading(true);
      setProgress(0);
      setProcessingMessage("This may take a few minutes...");

      const fileContent = await readFileAsArrayBuffer(selectedFile);
      const bytes = new Uint8Array(fileContent);

      const hash = await HandleUpload(bytes);
      console.log("File successfully submitted. Transaction ID:", hash);

      setTransactionId(hash);
      setTransactionCompleted(true);

      // Actualizar progreso gradualmente
      const interval = setInterval(() => {
        setProgress((prevProgress) =>
          prevProgress >= 90 ? 100 : prevProgress + 10
        );
      }, 500);

      // Simular proceso que tarda unos 8 segundos
      await new Promise((resolve) => setTimeout(resolve, 8000));

      // Limpiar intervalo y completar la barra de progreso
      clearInterval(interval);
      setProgress(100);

      setShowOutput(true);
      setShowSelectImageButton(false);
    } catch (error) {
      console.error("Error submitting the file", error);
    } finally {
      setLoading(false);
      setShowSendAnotherButton(true);
    }
  };

  const readFileAsArrayBuffer = (file: File | null): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("No se ha seleccionado ningún archivo"));
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target && event.target.result) {
          resolve(event.target.result as ArrayBuffer);
        } else {
          reject(new Error("Error al leer el archivo"));
        }
      };

      reader.onerror = () => {
        reject(new Error("Error al leer el archivo"));
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <ThemeProvider theme={theme}>
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          color="primary"
          style={{ marginTop: "20px", marginBottom: "20px" }}
        >
          WHISTLEBLOWER
        </Typography>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {showSelectImageButton && (
            <Button
              variant="outlined"
              component="span"
              style={{
                color: "primary",
                borderColor: "primary",
                backgroundColor: "white",
              }}
            >
              Select Image
            </Button>
          )}
        </div>
        {imagen && (
          <div style={{ marginTop: "20px" }}>
            <img
              src={imagen}
              alt=""
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                border: "4px solid #414141",
                borderRadius: "5px",
              }}
            />
          </div>
        )}
        {(loading || (!loading && showOutput)) && (
          <ProgressDisplay
            loading={loading}
            showOutput={showOutput}
            progress={progress}
            transactionCompleted={transactionCompleted}
            transactionId={transactionId}
            selectedFile={selectedFile}
            processingMessage={processingMessage}
          />
        )}
        {!loading && showSelectImageButton && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleClick}
            style={{
              marginTop: "20px",
              backgroundColor: "primary",
              color: "white",
            }}
          >
            Get plate!
          </Button>
        )}
        {showOutput && <ShowResult result={result} />}

        {imagen && showOutput && (
          <CropImage image={imagen} coordinates={coordinates} />
        )}
        {showSendAnotherButton && (
          <Button
            variant="outlined"
            onClick={handleSendAnotherImage}
            style={{
              marginTop: "20px",
              backgroundColor: "white",
              borderColor: "primary",
              color: "primary",
            }}
          >
            Send another image
          </Button>
        )}
      </Paper>
    </ThemeProvider>
  );
}
