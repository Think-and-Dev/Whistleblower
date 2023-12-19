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

interface BadgeProps {
  icon: React.ReactNode;
  popoverContent: React.ReactNode;
  showBadge: boolean;
}

const CustomBadge: React.FC<BadgeProps> = ({
  icon,
  popoverContent,
  showBadge,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleBadgeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        marginLeft: "10px",
        marginRight: "10px",
      }}
    >
      {showBadge ? (
        <>
          <Badge
            color="success"
            overlap="circular"
            badgeContent={<span style={{ fontSize: 12 }}>i</span>}
            onClick={handleBadgeClick}
          >
            {icon}
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
              {popoverContent}
            </Typography>
          </Popover>
        </>
      ) : (
        icon
      )}
    </div>
  );
};

const ProgressDisplay: React.FC<RenderIconsProps> = ({
  loading,
  showOutput,
  progress,
  transactionCompleted,
  transactionId,
  selectedFile,
  processingMessage,
}) => {
  return (
    <div
      style={{
        marginBottom: "10px",
        marginTop: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        border: "2px solid #000000",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "10px",
          marginRight: "10px",
          marginTop: "10px",
        }}
      >
        {/* ICONO CAMARA */}
        <CustomBadge
          icon={<PhotoCameraIcon fontSize="large" color="primary" />}
          popoverContent="Your image has been sent, let the game begin..."
          showBadge={transactionCompleted ? true : true}
        />
        {/* PRIMER CIRCULAR PROGRESS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            marginLeft: "10px",
            marginRight: "10px",
            marginBottom: "5px",
          }}
        >
          {!transactionCompleted ? (
            <CircularProgress
              size={18}
              color="success"
              thickness={6}
              style={{
                marginRight: "10px",
                marginLeft: "10px",
                marginBottom: "5px",
              }}
            />
          ) : (
            <ArrowRightAltIcon
              fontSize="medium"
              color="primary"
              style={{
                marginRight: "10px",
                marginLeft: "10px",
              }}
            />
          )}
        </div>
        {/* ICONO MOVIL */}
        <CustomBadge
          icon={
            transactionCompleted ? (
              <SendToMobile fontSize="large" color="primary" />
            ) : (
              <SendToMobile fontSize="large" color="secondary" />
            )
          }
          popoverContent={`Now you can track your transaction\n${transactionId}`}
          showBadge={transactionCompleted ? true : false}
        />
        {/* SEGUNDO CIRCULAR PROGRESS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            marginLeft: "10px",
            marginRight: "10px",
            marginBottom: "5px",
          }}
        >
          {transactionCompleted && progress < 60 ? (
            <CircularProgress
              size={18}
              color="success"
              thickness={6}
              style={{
                marginRight: "10px",
                marginLeft: "10px",
                marginBottom: "5px",
              }}
            />
          ) : (
            <ArrowRightAltIcon
              fontSize="medium"
              color={!transactionCompleted ? "secondary" : ("primary" as const)}
              style={{
                marginRight: "10px",
                marginLeft: "10px",
              }}
            />
          )}
        </div>
        {/*  ICONO RELOJ DE ARENA */}
        <CustomBadge
          icon={
            progress >= 60 ? (
              <HourglassEmptyIcon fontSize="large" color="primary" />
            ) : (
              <HourglassEmptyIcon fontSize="large" color="secondary" />
            )
          }
          popoverContent={`Texto 3...`}
          showBadge={progress >= 60 ? true : false}
        />
        {/* TERCER CIRCULAR PROGRESS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            marginLeft: "10px",
            marginRight: "10px",
            marginBottom: "5px",
          }}
        >
          {progress > 60 && !showOutput ? (
            <CircularProgress
              size={18}
              color="success"
              thickness={6}
              style={{
                marginRight: "10px",
                marginLeft: "10px",
                marginBottom: "5px",
              }}
            />
          ) : (
            <ArrowRightAltIcon
              fontSize="medium"
              color={!showOutput ? "secondary" : ("primary" as const)}
              style={{
                marginRight: "10px",
                marginLeft: "10px",
              }}
            />
          )}
        </div>
        {/* ICONO CHECK */}
        <CustomBadge
          icon={
            showOutput ? (
              <CheckCircleOutline fontSize="large" color="primary" />
            ) : (
              <CheckCircleOutline fontSize="large" color="secondary" />
            )
          }
          popoverContent={`Texto 4`}
          showBadge={showOutput ? true : false}
        />
      </div>

      {loading && <Typography variant="body2">{processingMessage}</Typography>}
    </div>
  );
};

export default ProgressDisplay;
