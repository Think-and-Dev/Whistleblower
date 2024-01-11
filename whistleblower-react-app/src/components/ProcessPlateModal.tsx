import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import HandleUpload from "../utils/HandleUpload";
import { Button, Typography, Paper } from "@mui/material";
import ShowResult from "./ShowResult";
import ProgressDisplay from "./ProgressDisplay";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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

export default function ProcessPlateModal() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [image, setImage] = useState<string>();
  const [result, setResult] = useState<Array<String> | null>(null);
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
  const [input, setInput] = useState<number | undefined>(0);
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
    const image = URL.createObjectURL(file);
    setImage(image);
  };

  const handleSendAnotherImage = () => {
    setImage(undefined);
    setSelectedFile(null);
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
      setShowSelectImageButton(false);
      setShowSendAnotherButton(true);
      setLoading(true);
      setProgress(0);
      setProcessingMessage("This may take a few minutes...");
      if (!selectedFile) throw new Error("No image selected!");
      const fileContent = await readFileAsArrayBuffer(selectedFile);
      const bytes = new Uint8Array(fileContent);

      const { hash, input } = await HandleUpload(bytes);
      console.log("File successfully submitted. Transaction ID:", hash);

      setTransactionId(hash);
      setTransactionCompleted(true);
      setShowOutput(true);
      setInput(input.input_index);
    } catch (error) {
      console.error("Error submitting the file", error);
    } finally {
      setLoading(false);
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
        {image && (
          <div style={{ marginTop: "20px" }}>
            <img
              src={image}
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
            disabled={!selectedFile}
            style={{
              marginTop: "20px",
              backgroundColor: "primary",
              color: "white",
            }}
          >
            Get plate!
          </Button>
        )}
        {showOutput && (
          <ShowResult
            image={image}
            inputIndex={input}
            setProgress={setProgress}
          />
        )}

        {showSendAnotherButton && (
          <Button
            variant="outlined"
            onClick={handleSendAnotherImage}
            disabled={progress !== 100}
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
