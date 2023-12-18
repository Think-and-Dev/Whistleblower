import React, { useState } from "react";
import { Typography, CircularProgress } from "@mui/material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import SendToMobile from "@mui/icons-material/SendToMobile";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import Badge from "@mui/material/Badge";
import Popover from "@mui/material/Popover";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

interface RenderIconsProps {
  loading: boolean;
  showOutput: boolean;
  progress: number;
  transactionCompleted: boolean;
  transactionId: string | null;
  selectedFile: File | null;
  processingMessage: string;
}

const RenderIcons: React.FC<RenderIconsProps> = ({
  loading,
  showOutput,
  progress,
  transactionCompleted,
  transactionId,
  selectedFile,
  processingMessage,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [anchorEl2, setAnchorEl2] = useState<HTMLButtonElement | null>(null);

  const handleBadgeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleBadgeClick2 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };
  const handleClosePopover2 = () => {
    setAnchorEl2(null);
  };
  return (
    <div
      style={{
        marginBottom: "10px",
        marginTop: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        <Badge
          color="success"
          overlap="circular"
          badgeContent={<span style={{ fontSize: 12 }}>i</span>}
          onClick={handleBadgeClick2}
          style={{ marginRight: "20px" }}
        >
          <PhotoCameraIcon
            fontSize="large"
            color="primary"
            style={{
              marginRight: "20px",
              marginTop: "2px",
            }}
          />
        </Badge>

        <Popover
          open={Boolean(anchorEl2)}
          anchorEl={anchorEl2}
          onClose={handleClosePopover2}
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
            Su imagen ha sido enviada, que comienze el juego...
          </Typography>
        </Popover>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            marginLeft: "20px",
            marginRight: "20px",
          }}
        >
          {!transactionCompleted && (
            <CircularProgress
              size={10}
              color="secondary"
              style={{
                marginRight: "20px",
                marginLeft: "20px",
              }}
            />
          )}
          <ArrowRightAltIcon
            fontSize="medium"
            color={!transactionCompleted ? "secondary" : ("primary" as const)}
            style={{
              marginRight: "20px",
              marginLeft: "20px",
            }}
          />
        </div>

        {transactionCompleted ? (
          <Badge
            color="success"
            overlap="circular"
            badgeContent={<span style={{ fontSize: 12 }}>i</span>}
            onClick={handleBadgeClick}
            style={{ marginRight: "20px" }}
          >
            <SendToMobile
              color={transactionCompleted ? "primary" : ("secondary" as const)}
              fontSize="large"
            />
          </Badge>
        ) : (
          <SendToMobile
            color="secondary"
            fontSize="large"
            style={{
              marginRight: "20px",
              marginLeft: "20px",
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
            Ya puede hacer el seguimiento de su transaccion <br />
            {transactionId}
          </Typography>
        </Popover>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            marginLeft: "20px",
            marginRight: "20px",
          }}
        >
          {progress > 30 && progress < 60 && (
            <CircularProgress
              size={10}
              color="secondary"
              style={{
                marginRight: "20px",
                marginLeft: "20px",
              }}
            />
          )}
          <ArrowRightAltIcon
            fontSize="medium"
            color={progress < 60 ? "secondary" : ("primary" as const)}
            style={{
              marginRight: "20px",
              marginLeft: "20px",
            }}
          />
        </div>

        <HourglassEmptyIcon
          fontSize="large"
          color={progress >= 60 ? "primary" : ("secondary" as const)}
          style={{
            marginRight: "20px",
            marginLeft: "20px",
            marginTop: "2px",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            marginLeft: "20px",
            marginRight: "20px",
          }}
        >
          {progress > 60 && !showOutput && (
            <CircularProgress
              size={10}
              color="secondary"
              style={{
                marginRight: "20px",
                marginLeft: "20px",
              }}
            />
          )}
          <ArrowRightAltIcon
            fontSize="medium"
            color={!showOutput ? "secondary" : ("primary" as const)}
            style={{
              marginRight: "20px",
              marginLeft: "20px",
            }}
          />
        </div>
        <CheckCircleOutline
          fontSize="large"
          color={showOutput ? "primary" : ("secondary" as const)}
          style={{
            marginLeft: "20px",
          }}
        />
      </div>
      {loading && <Typography variant="body2">{processingMessage}</Typography>}
    </div>
  );
};

export default RenderIcons;
