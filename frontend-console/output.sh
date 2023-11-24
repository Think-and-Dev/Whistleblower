#!/bin/bash

# Extrae las líneas que contienen el JSON del archivo
json_lines=$(grep -o '\[.*\]' salida.txt)

# Usa jq para analizar el JSON y extraer el valor de "payload"
payload=$(echo "$json_lines" | jq -r '.[0].payload')

# Imprime el valor de "payload"
echo "Valor de payload: $payload"

