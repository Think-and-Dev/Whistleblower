# Copyright 2022 Cartesi Pte. Ltd.
#
# SPDX-License-Identifier: Apache-2.0
# Licensed under the Apache License, Version 2.0 (the "License"); you may not use
# this file except in compliance with the License. You may obtain a copy of the
# License at http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software distributed
# under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
# CONDITIONS OF ANY KIND, either express or implied. See the License for the
# specific language governing permissions and limitations under the License.

from os import environ
import os
import traceback
import logging
import requests
#from py_expression_eval import Parser

def get_blue_channel(image):
    import cv2
    import numpy as np
    image_np = np.array(image)
    b, g, r = cv2.split(image_np)
    return b
#--------------------------------------------
def decode_image(imagen_decodificada):
    from PIL import Image
    import base64
    import io
    ## Decodifica la cadena de texto en base64 a bytes
    #imagen_decodificada = base64.b64decode(image)
    # Crea un buffer de bytes a partir de los bytes decodificados
    buffer = io.BytesIO(imagen_decodificada)   
    # Abre la imagen desde el buffer
    imagen_recuperada = Image.open(buffer)
    return imagen_recuperada
#--------------------------------------------
def cod_image(blue_image):
    from PIL import Image
    import base64
    import io
    blue_image_pil = Image.fromarray(blue_image)
    # Convierte la imagen a bytes
    buffer = io.BytesIO()
    blue_image_pil.save(buffer, format="JPEG")
    # Obtiene los bytes de la imagen
    bytes_de_imagen = buffer.getvalue()
    # Cierra el buffer
    buffer.close()
    # Codifica los bytes de la imagen en Base64
    imagen_codificada = base64.b64encode(bytes_de_imagen)
    # Convierte la representación de bytes a una cadena de texto
    imagen_codificada_str = imagen_codificada.decode('utf-8')
    return imagen_codificada_str
#--------------------------------------------

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
logger.info(f"HTTP rollup_server url is {rollup_server}")

def hex2str(hex):
    """
    Decodes a hex string into a regular string
    """
    return bytes.fromhex(hex[2:]).decode("utf-8")

def hex2bytes(hex):
    """
    Decodes a hex string into bytes
    """
    return bytes.fromhex(hex[2:])

def str2hex(str):
    """
    Encodes a string as a hex string
    """
    return "0x" + str.encode("utf-8").hex()

def handle_advance(data):
    logger.info(f"Received advance request data {data}")

    status = "accept"
    try:
        input = hex2bytes(data["payload"])
        logger.info(f"Received input: {input}")
        logger.info(f"Input len: {len(input)}")
        os.system('python tools/demo.py image -n yolox-s -c models/yolox-s.pth --path assets/auto.jpg --conf 0.25 --nms 0.45 --tsize 640 --save_result --device cpu')
        color_image = decode_image(input)
        blue_image = get_blue_channel(color_image)
        output = cod_image(blue_image) 

        # Emits notice with result of calculation
        logger.info(f"Adding notice with payload: '{output}'")
        response = requests.post(rollup_server + "/notice", json={"payload": str2hex(str(output))})
        logger.info(f"Received notice status {response.status_code} body {response.content}")

    except Exception as e:
        status = "reject"
        msg = f"Error processing data {data}\n{traceback.format_exc()}"
        logger.error(msg)
        response = requests.post(rollup_server + "/report", json={"payload": str2hex(msg)})
        logger.info(f"Received report status {response.status_code} body {response.content}")

    return status

def handle_inspect(data):
    logger.info(f"Received inspect request data {data}")
    logger.info("Adding report")
    response = requests.post(rollup_server + "/report", json={"payload": data["payload"]})
    logger.info(f"Received report status {response.status_code}")
    return "accept"

handlers = {
    "advance_state": handle_advance,
    "inspect_state": handle_inspect,
}

finish = {"status": "accept"}

while True:
    logger.info("Sending finish")
    response = requests.post(rollup_server + "/finish", json=finish)
    logger.info(f"Received finish status {response.status_code}")
    if response.status_code == 202:
        logger.info("No pending rollup request, trying again")
    else:
        rollup_request = response.json()
        data = rollup_request["data"]
        
        handler = handlers[rollup_request["request_type"]]
        finish["status"] = handler(rollup_request["data"])
