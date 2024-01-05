#!/bin/bash

# Verifica que se haya proporcionado un argumento que sea la ruta de la imagen
if [ $# -ne 1 ]; then
    echo "Uso: $0 <ruta_de_la_imagen>"
    exit 1
fi

# Captura la ruta de la imagen del primer argumento
ruta_imagen="$1"

# Ejecuta el comando yarn con la salida del script de Python como argumento
yarn start input send_file --path "$ruta_imagen"

## Ejecutar asi:
##      ./send_image.sh '../pruebas_opencv/perrito.jpg'
