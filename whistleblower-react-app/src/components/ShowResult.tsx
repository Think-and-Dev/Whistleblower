// src/components/output.tsx
import React, { useEffect, useState } from "react";
import { Typography, Container, Paper } from "@mui/material";
import { useQuery, gql } from "@apollo/client";
import { ethers } from "ethers";
import CropImage from "./CropImage";

interface OutputProps {
  imagen: string | undefined;
  input: number | undefined;
}
const inputIndex = 0;
const GET_DATA = gql(`
query GetNotice($inputIndex:Int!){
  input(index:$inputIndex){
  notices {
    edges{
      node{
          index
          input{
              index
          }
          payload
        }
      }
    }
  }
}
`);

const ShowResult: React.FC<OutputProps> = ({ imagen, input }) => {
  const [patente, setPatente] = useState<string | undefined>();
  const [box, setBox] = useState<number[] | undefined>();

  console.log(`Voy a hacer la consulta del indice: ${input}`);
  const index = input ? input : "undefined";
  console.log(index);
  const { loading, error, data, stopPolling, startPolling } = useQuery(
    GET_DATA,
    {
      variables: { inputIndex: index },
    }
  );
  useEffect(() => {
    startPolling(30000);
    return () => {
      stopPolling();
    };
  }, [stopPolling, startPolling]);
  useEffect(() => {
    if (!loading || error || !data) {
      return;
    }
    const payloadHex = data.input?.notices?.edges[0]?.node?.payload;
    if (payloadHex) {
      const payload = ethers.utils.toUtf8String(payloadHex);
      console.log(payload);
      const rta = JSON.parse(payload);
      const obtenerPatente = () =>
        rta && rta.patente !== "" ? rta.patente : "No plate detected";
      setPatente(obtenerPatente());
      console.log("aca entre");
      setBox(rta.box);
      console.log(rta.box);
      stopPolling();
    }
  }, [loading, error, data, setPatente, setBox, stopPolling]);

  if (!patente && !box) return <p>Processing...</p>;
  if (error) return <p>Error: {error.message}</p>;
  // TODOuseEffect
  // console.log(data);
  // const notices = data.input.notices.edges[0].node.payload;
  // console.log(notices);
  // const firstNotice = notices;
  // const payloadHex = firstNotice;
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
          backgroundColor: "#7b3888",
          color: "white",
        }}
      >
        <Typography variant="h6" align="center">
          Licence plate detected:
        </Typography>
        {/* {result ? ( */}
        {/* <Typography variant="body1">{result}</Typography> */}
        {/* ) : ( */}
        <Typography variant="body1">{patente}</Typography>
        {/* )} */}
      </Paper>
      {imagen && box && <CropImage image={imagen} coordinates={box} />}
    </Container>
  );
};

export default ShowResult;
