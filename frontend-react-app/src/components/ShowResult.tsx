// src/components/output.tsx
import React, { useEffect, useState } from "react";
import { Typography, Container, Paper } from "@mui/material";
import { useQuery, gql } from "@apollo/client";
import { ethers } from "ethers";
import CropImage from "./CropImage";

interface OutputProps {
  image: string | undefined;
  inputIndex: number | undefined;
  setProgress: (progress: number) => void;
}
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

const ShowResult: React.FC<OutputProps> = ({
  image,
  inputIndex,
  setProgress,
}) => {
  const [plate, setPlate] = useState<string | undefined>();
  const [box, setBox] = useState<number[] | undefined>();

  const { loading, error, data, stopPolling, startPolling } = useQuery(
    GET_DATA,
    {
      variables: { inputIndex: inputIndex },
    }
  );
  useEffect(() => {
    startPolling(20000);
    return () => {
      stopPolling();
    };
  }, [stopPolling, startPolling, loading]);
  useEffect(() => {
    if (loading || error || !data) {
      return;
    }
    const payloadHex = data.input?.notices?.edges[0]?.node?.payload;
    if (payloadHex) {
      const payload = ethers.utils.toUtf8String(payloadHex);
      const rta = JSON.parse(payload);
      const getPlate = () =>
        rta && rta.plate !== "" ? rta.plate : "No plate detected";
      setPlate(getPlate());
      setBox(rta.box);
      stopPolling();
      setProgress(100);
    }
  }, [loading, error, data, setPlate, setBox, stopPolling]);
  // console.log(plate, box);
  if (!plate && !box) return <p>Processing... This may take a few minutes</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <Container component="main" maxWidth="xs">
      {image && box && <CropImage image={image} coordinates={box} />}
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
          License plate detected:
        </Typography>
        <Typography variant="body1">{plate}</Typography>
      </Paper>
    </Container>
  );
};

export default ShowResult;
