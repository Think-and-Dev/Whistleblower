import React, { useEffect, useState } from "react";

const CropImage: React.FC<{
  image: string | undefined;
  coordinates: number[];
}> = ({ image, coordinates }) => {
  const [croppedImage, setCroppedImage] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          console.error("Unable to get 2D context for canvas");
          return;
        }

        const [x, y, x2, y2] = coordinates;
        const width = x2 - x;
        const height = y2 - y;
        canvas.width = width;
        canvas.height = height;

        // Draw the cut-out portion of the image on the canvas.
        ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

        // Get the URL of the cropped image from the canvas
        const croppedImageUrl = canvas.toDataURL("image/jpeg");

        setCroppedImage(croppedImageUrl);
      };

      img.src = image;
    }
  }, [image, coordinates]);

  return (
    <div
      style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
    >
      {croppedImage && (
        <img
          src={croppedImage}
          alt="Cropped Image"
          style={{
            maxWidth: "100%",
            maxHeight: "300px",
            border: "4px solid #414141",
            borderRadius: "5px",
          }}
        />
      )}
    </div>
  );
};

export default CropImage;
