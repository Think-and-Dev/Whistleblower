import base64
import argparse

def file_to_base64(file_path):
    try:
        with open(file_path, "rb") as file:
            # Lee el contenido del archivo binario
            file_data = file.read()
            
            # Codifica el contenido en base64
            base64_data = base64.b64encode(file_data).decode('utf-8')
            
            return base64_data
    except Exception as e:
        print(f"Error al convertir el archivo a base64: {e}")
        return None

def main():
    parser = argparse.ArgumentParser(description="Convierte un archivo a base64")
    parser.add_argument("file", help="Ruta del archivo a convertir")

    args = parser.parse_args()

    # Llama a la función y pasa la ruta del archivo como argumento
    archivo_base64 = file_to_base64(args.file)

    if archivo_base64:
        return archivo_base64

if __name__ == "__main__":
    resultado = main()
    if resultado:
        print(resultado)
        print('Numero de caracteres ', len(resultado))

