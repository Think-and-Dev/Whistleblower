import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const API_URL = "http://localhost:3001"; // Reemplaza con la URL de tu servidor

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    setSelectedFile(acceptedFiles[0]);
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
    <div>
      <div {...getRootProps()} style={dropzoneStyles}>
        <input {...getInputProps()} />
        <p>
          Arrastra y suelta una imagen aquí, o haz clic para seleccionar una.
        </p>
      </div>
      <button onClick={handleUpload}>Enviar Archivo</button>
    </div>
  );
};

const dropzoneStyles: React.CSSProperties = {
  border: "2px dashed #cccccc",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
};

export default App;
