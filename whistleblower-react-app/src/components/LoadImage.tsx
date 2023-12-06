import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import HandleUpload from "../utils/HandleUpload";
import {
  Button,
  Container,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import ShowResult from "./ShowResult";

const API_URL = "http://localhost:3001";

export default function ImageLoad() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Nuevo estado para la carga
  const [processingMessage, setProcessingMessage] = useState<string>(""); // Nuevo estado para el mensaje de procesamiento
  const [showOutput, setShowOutput] = useState<boolean>(false); // Nuevo estado para mostrar el componente Output

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);

    const imageUrl = URL.createObjectURL(file);
    setImageUrl(imageUrl);
  };

  const handleClick = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        HandleUpload(imageUrl);
        console.log("Archivo enviado con éxito");
        setImageUrl(null);
        setLoading(true);
        setProcessingMessage("Esto puede llevar algunos minutos...");

        // const response = await axios.post(`${API_URL}/upload`, formData);
        console.log("Archivo enviado con éxito");

        // setResult(response.data.result);
        setShowOutput(true); // Muestra el componente Output después de obtener el resultado
      } catch (error) {
        console.error("Error al enviar el archivo", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.warn("No se ha seleccionado ningún archivo");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Container component="main" maxWidth="xs" style={{ marginTop: "20px" }}>
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
        </div>
        {imageUrl && (
          <div style={{ marginTop: "20px" }}>
            <Typography variant="body1">Image loaded:</Typography>
            <img
              src={imageUrl}
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
          <div style={{ marginBottom: "10px" }}>
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
    </Container>
  );
}
