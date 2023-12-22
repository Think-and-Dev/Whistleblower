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
from PIL import Image
import os
import traceback
import logging
import requests

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
    buffer = io.BytesIO(imagen_decodificada)   
    imagen_recuperada = Image.open(buffer)
    return imagen_recuperada

def crop_image(image, box):
    import numpy as np
    image = np.array(image)
    x1, y1, x2, y2 = map(int, box)
    cropped_array = image[y1:y2, x1:x2]
    cropped_image = Image.fromarray(cropped_array)
    return cropped_image
#--------------------------------------------
def cod_image(blue_image):
    from PIL import Image
    import base64
    import io
    buffer = io.BytesIO()
    blue_image.save(buffer, format="JPEG")
    bytes_de_imagen = buffer.getvalue()
    buffer.close()
    imagen_codificada = base64.b64encode(bytes_de_imagen)
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
    from tools.yolo_plate  import process_image
    logger.info(f"Received advance request data {data}")

    status = "accept"
    try:
        input = hex2bytes(data["payload"])
        logger.info(f"Received input: {input}")
        logger.info(f"Input length: {len(input)}")
        color_image = decode_image(input)
        # print(type(color_image))
        # color_image.save('input.jpg')
        # comando=f'python tools/yolo_plate.py image -f ./yolox_voc_nano.py -c ./best_ckpt.pth  --path ./input.jpg --conf 0.25 --nms 0.45 --tsize 416 --device cpu'
        # os.system(comando)
        first_vector_list=process_image(input)
        # if not(os.path.exists('bboxes.txt') and os.path.getsize('bboxes.txt')>0):
        #     raise Exception("No box found for license plate recognition")
        # with open('bboxes.txt', 'r') as file:
            # content = file.read()
        # start_index = content.find('[')
        # end_index = content.find(']', start_index) + 1
        # first_vector_str = content[start_index:end_index]
        # first_vector_list = [float(num) for num in first_vector_str.replace('[', '').replace(']', '').split(',')]
        print(first_vector_list)
        cropped_image = crop_image(color_image, first_vector_list)
        cropped_image.save('./img_crop.jpg')
        tesseract_output=os.system('tesseract img_crop.jpg plate -l spa --psm 7')
        if tesseract_output!=0:
            print('Tesseract failed, '+tesseract_output)
            raise Exception("Tesseract failed to recognize the image.")
        with open('plate.txt','r') as file1:
            plate_file = file1.read()
        plate=plate_file.splitlines()[0].strip()
        x1, y1, x2, y2 = map(int, first_vector_list)
        result_string=f"[{x1},{y1},{x2},{y2}]"
        output='{{"plate": "{}", "box": {}}}'.format(plate, result_string)
        logger.info(f"Adding notice with payload: '{output}'")
        response = requests.post(rollup_server + "/notice", json={"payload": str2hex(output) })
        logger.info(f"Received notice status {response.status_code} body {response.content}")
        logger.info(f"Patente encontrada: '{plate}'")
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
