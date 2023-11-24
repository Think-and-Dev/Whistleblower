#!/bin/bash

# Verifica que se haya proporcionado un argumento que sea la ruta de la imagen
if [ $# -ne 1 ]; then
    echo "Uso: $0 <ruta_de_la_imagen>"
    exit 1
fi

# Captura la ruta de la imagen del primer argumento
ruta_imagen="$1"

# Ejecuta el script de Python para procesar la imagen y captura su salida
salida_script=`python3 ./scripts/file_to_base64.py "$ruta_imagen"`
#salida_script=`python3 generate_string.py`

#echo "Salida del script de Python: $salida_script"
#echo $salida_script > perrito3.txt

# Ejecuta el comando yarn con la salida del script de Python como argumento
yarn start input send --payload "$salida_script"

## Ejecutar asi:
##      ./send_image.sh '../pruebas_opencv/perrito.jpg'
