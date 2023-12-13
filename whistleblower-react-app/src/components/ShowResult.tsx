// src/components/output.tsx
import React from "react";
import { Typography, Container, Paper } from "@mui/material";
import { useQuery, gql } from "@apollo/client";
interface OutputProps {
  result: string | null;
}
const GET_DATA = gql(`
  query {
    notices {
      edges {
        node {
          payload
          index
          input {
            index
            payload
          }
        }
      }
    }
  }
`);
const ShowResult: React.FC<OutputProps> = ({ result }) => {
  console.log("Voy a hacer la consulta");
  const { loading, error, data } = useQuery(GET_DATA);
  if (loading) return <p>Loading</p>;
  if (error) return <p>Error: {error.message}</p>;
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
          <Typography variant="body1">
            {JSON.stringify(data, null, 2)}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default ShowResult;
