import argparse
import base64
from PIL import Image

def image_to_base64(image_path):
    try:
        # Abre la imagen
        imagen = Image.open(image_path)
    except Exception as e:
        print(f"Error al abrir la imagen: {e}")
        return None

    # Convierte la imagen a bytes
    imagen_bytes = imagen.tobytes()

    # Codifica los bytes de la imagen en base64 
    imagen_base64 = base64.b64encode(imagen_bytes).decode('utf-8')

    return imagen_base64

def main():
    parser = argparse.ArgumentParser(description="Convierte una imagen a base64")
    parser.add_argument("image", help="Ruta de la imagen a convertir")

    args = parser.parse_args()

    imagen_base64 = image_to_base64(args.image)

    if imagen_base64:
        return imagen_base64

if __name__ == "__main__":
    resultado = main()
    if resultado:
        print(resultado)
