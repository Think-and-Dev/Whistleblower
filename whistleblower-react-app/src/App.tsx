import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { Button, Container, Typography, Paper } from "@mui/material";

const API_URL = "http://localhost:3001";

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);

    const imageUrl = URL.createObjectURL(file);
    setImageUrl(imageUrl);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        await axios.post(`${API_URL}/upload`, formData);
        console.log("Archivo enviado con éxito");
      } catch (error) {
        console.error("Error al enviar el archivo", error);
      }
    } else {
      console.warn("No se ha seleccionado ningún archivo");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <Button variant="outlined" component="span">
            Select Image
          </Button>
        </div>
        {imageUrl && (
          <div style={{ marginTop: "20px" }}>
            <Typography variant="body1">Image loaded:</Typography>
            <img
              src={imageUrl}
              alt=""
              style={{ maxWidth: "100%", maxHeight: "300px" }}
            />
          </div>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          style={{ marginTop: "20px" }}
        >
          Get plate!
        </Button>
      </Paper>
    </Container>
  );
};

export default App;
