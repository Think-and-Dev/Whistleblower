const HandleUpload = (imageUrl: any) => {
  const handleUpload = async (imageFile: any) => {
    // const API_URL = "http://localhost:5001";
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      try {
        console.log("La imagen llega con exito");
        return;
      } catch (error) {
        console.error("Error al subir la imagen", error);
      }
    } else {
      console.warn("No se ha seleccionado ningún archivo");
      return;
    }
  };
  handleUpload(imageUrl);
};
export default HandleUpload;
