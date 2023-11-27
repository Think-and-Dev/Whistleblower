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
import traceback
import logging
import requests

## DEFINE FUNCTIONS -----------------------------
def yolo(img):
    logger.info(f"--- Running yolo ---")
    import torch
    logger.info(f"--- import torch ---")
    model = torch.hub.load('./yolov5', 'custom', path='best.pt', source='local', device='cpu')
    logger.info(f"--- load model ---")
    yolo_results = model([img], size=640)
    logger.info(f"--- evaluate ---")
    yolo_results.save()
    logger.info(f"--- yolo ---")
    return yolo_results

def crop_image(image, results):
    logger.info(f"--- Cropping image ---")
    import numpy as np
    import cv2
    #import base64
    xmin = int(results.xyxy[0][0][0].item())
    ymin = int(results.xyxy[0][0][1].item())
    xmax = int(results.xyxy[0][0][2].item())
    ymax = int(results.xyxy[0][0][3].item())
    #image_decod = base64.b64decode(image_bytes)
    imagen_np = np.frombuffer(image, np.uint8)
    X = cv2.imdecode(imagen_np, cv2.IMREAD_COLOR)
    M = X.shape[0]
    N = X.shape[1]
    cropped_image = X[ymin:ymax, xmin:xmax]
    #cv2.imwrite('cropped_img.jpg', cropped_image)
    return cropped_image

def ocr(cropped_image):
    logger.info(f"--- Running OCR ---")
    import easyocr
    reader = easyocr.Reader(['en'])
    text = reader.readtext(cropped_image)
    return text

def decode_image(imagen_codificada):
    logger.info(f"---- Decoding image----")
    from PIL import Image
    import base64
    import io
    buffer = io.BytesIO(imagen_codificada)   
    imagen_recuperada = Image.open(buffer)
    return imagen_recuperada

def cod_image(blue_image):
    logger.info(f"---- Codding image ----")
    from PIL import Image
    import base64
    import io
    blue_image_pil = Image.fromarray(blue_image)
    buffer = io.BytesIO()
    blue_image_pil.save(buffer, format="JPEG")
    bytes_de_imagen = buffer.getvalue()
    buffer.close()
    imagen_codificada = base64.b64encode(bytes_de_imagen)
    imagen_codificada_str = imagen_codificada.decode('utf-8')
    return imagen_codificada_str
##------------------------------------------------------------

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
        
        image = decode_image(input)
        logger.info(f"Image successfully decoded")

        # Run YOLO algorithm on the image
        yolo_results = yolo(image)
        logger.info(f"Yolo output {yolo_results.pandas().xyxy[0]}")

        # Crop the image from the bounding box detected with higher confidence
        cropped_image = crop_image(image, yolo_results)
        logger.info(f"Image successfully cropped")
        
        # Detect characters
        output = ocr(cropped_image)

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
