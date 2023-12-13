import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import HandleUpload from "../utils/HandleUpload";
import { Button, Typography, Paper, CircularProgress } from "@mui/material";
import ShowResult from "./ShowResult";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import SendToMobile from "@mui/icons-material/SendToMobile";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import Badge from "@mui/material/Badge";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";

export default function ImageLoad() {
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

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleBadgeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
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

  // console.log("showOutput:", showOutput);

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
            marginTop: "10px",
            display: "flex",
            flexDirection: "column", // Columna para apilar verticalmente
            alignItems: "center", // Alinea el contenido en el centro horizontalmente
            textAlign: "center", // Alinea el texto en el centro horizontalmente
          }}
        >
          {/* Iconos para diferentes estados en una fila */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "10px",
            }}
          >
            {transactionCompleted ? (
              <Badge
                color="secondary"
                overlap="circular"
                badgeContent={<span style={{ fontSize: 10 }}>i</span>}
                onClick={handleBadgeClick}
                style={{ marginRight: "20px" }}
              >
                <SendToMobile
                  color={transactionCompleted ? "success" : ("action" as const)}
                  fontSize="large"
                  style={{
                    marginBottom: "2px",
                  }}
                />
              </Badge>
            ) : (
              <SendToMobile
                color="inherit"
                fontSize="large"
                style={{
                  marginBottom: "2px",
                  marginRight: "20px",
                }}
              />
            )}

            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleClosePopover}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <Typography style={{ padding: "10px" }}>
                Tx: {transactionId}
              </Typography>
            </Popover>

            <CircularProgress
              color="inherit"
              size={15}
              style={{
                marginRight: "20px",
                marginLeft: "20px",
                marginTop: "10px",
                color: progress >= 30 ? "#4CAF50" : "",
              }}
            />
            <HourglassEmptyIcon
              color="action"
              fontSize="large"
              style={{
                marginRight: "20px",
                marginLeft: "20px",
                marginTop: "2px",
                color: progress >= 60 ? "#4CAF50" : "",
              }}
            />
            <CircularProgress
              color="inherit"
              size={15}
              style={{
                marginRight: "20px",
                marginLeft: "20px",
                marginTop: "10px",
                color: progress >= 60 ? "#4CAF50" : "",
              }}
            />
            <CheckCircleOutline
              color="action"
              fontSize="large"
              style={{
                marginLeft: "20px",
                marginTop: "2px",
                color: progress >= 90 ? "#4CAF50" : "",
              }}
            />
          </div>
          <Typography variant="body2">{processingMessage}</Typography>
        </div>
      )}

      {!loading && showOutput && (
        <div
          style={{
            marginBottom: "10px",
            marginTop: "10px",
            display: "flex",
            flexDirection: "column", // Columna para apilar verticalmente
            alignItems: "center", // Alinea el contenido en el centro horizontalmente
            textAlign: "center", // Alinea el texto en el centro horizontalmente
          }}
        >
          {/* Iconos para diferentes estados en una fila */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "10px",
            }}
          >
            <Badge
              color="secondary"
              overlap="circular"
              badgeContent={<span style={{ fontSize: 10 }}>i</span>}
              onClick={handleBadgeClick}
              style={{ marginRight: "20px" }}
            >
              <SendToMobile
                color={transactionCompleted ? "success" : ("action" as const)}
                fontSize="large"
                style={{
                  marginBottom: "2px",
                }}
              />
            </Badge>

            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleClosePopover}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <Typography style={{ padding: "10px" }}>
                Tx: {transactionId}
              </Typography>
            </Popover>

            <HourglassEmptyIcon
              color="action"
              fontSize="large"
              style={{
                marginRight: "20px",
                marginLeft: "20px",
                marginTop: "2px",
                color: progress >= 60 ? "#4CAF50" : "",
              }}
            />

            <CheckCircleOutline
              color="action"
              fontSize="large"
              style={{
                marginLeft: "20px",
                marginTop: "2px",
                color: progress >= 90 ? "#4CAF50" : "",
              }}
            />
          </div>
        </div>
      )}

      {!loading && showSelectImageButton && (
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
      )}
      {showOutput && <ShowResult result={result} />}
      {showSendAnotherButton && (
        <Button
          variant="outlined"
          onClick={handleSendAnotherImage}
          style={{
            marginTop: "20px",
            backgroundColor: "white",
            borderColor: "#7f69a5",
            color: "#7f69a5",
          }}
        >
          Send another image
        </Button>
      )}
    </Paper>
  );
}
