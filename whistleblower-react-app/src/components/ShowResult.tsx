// src/components/output.tsx
import React from "react";
import { Typography, Container, Paper } from "@mui/material";

interface OutputProps {
  result: string | null;
}
const ShowResult: React.FC<OutputProps> = ({ result }) => {
  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#7f69a5",
          color: "white",
        }}
      >
        <Typography variant="h6" align="center">
          Licence plate detected:
        </Typography>
        {result ? (
          <Typography variant="body1">{result}</Typography>
        ) : (
          <Typography variant="body1">Waiting result...</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default ShowResult;
