import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import HandleUpload from "../utils/HandleUpload";
import { Button, Typography, Paper, CircularProgress } from "@mui/material";
import ShowResult from "./ShowResult";

export default function ImageLoad() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagen, setImagen] = useState<string>();
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Nuevo estado para la carga
  const [processingMessage, setProcessingMessage] = useState<string>(""); // Nuevo estado para el mensaje de procesamiento
  const [showOutput, setShowOutput] = useState<boolean>(false); // Nuevo estado para mostrar el componente Output
  const [showSelectImageButton, setShowSelectImageButton] =
    useState<boolean>(true);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
    const imagen = URL.createObjectURL(file);
    setImagen(imagen);
  };

  const handleClick = async () => {
    try {
      setLoading(true);
      setProcessingMessage("This may take a few minutes...");
      const fileContent = await readFileAsArrayBuffer(selectedFile);
      const bytes = new Uint8Array(fileContent);

      HandleUpload(bytes);
      console.log("Archivo enviado con éxito");

      setShowOutput(false); // Muestra el componente Output después de obtener el resultado
      setShowSelectImageButton(false);
    } catch (error) {
      console.error("Error al enviar el archivo", error);
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
        style={{ marginTop: "20px", marginBottom: "20px", color: "#7f69a5" }}
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
              color: "#7f69a5",
              borderColor: "#7f69a5",
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
      {loading && (
        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <CircularProgress
            size={24}
            color="secondary"
            style={{ marginRight: "10px" }}
          />
          <Typography variant="body2">{processingMessage}</Typography>
        </div>
      )}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleClick}
        style={{
          marginTop: "20px",
          backgroundColor: "#7f69a5",
          color: "white",
        }}
      >
        Get plate!
      </Button>
      {showOutput && <ShowResult result={result} />}{" "}
      {/* Muestra el componente Output si showOutput es true */}
    </Paper>
  );
}
