from PIL import Image
import os
import traceback
import requests
import logging
from yolox_helpers import process_image


def decode_image(coded_image):
    import io
    buffer = io.BytesIO(coded_image)
    restored_image = Image.open(buffer)
    return restored_image


def crop_image(image, box):
    import numpy as np
    image = np.array(image)
    x1, y1, x2, y2 = map(int, box)
    cropped_array = image[y1:y2, x1:x2]
    cropped_image = Image.fromarray(cropped_array)
    return cropped_image


def hex2bytes(hex: str):
    """
    Decodes a hex string into bytes
    """
    return bytes.fromhex(hex[2:])


def str2hex(str):
    """
    Encodes a string as a hex string
    """
    return "0x" + str.encode("utf-8").hex()


def handle_advance(data, rollup_server: str, logger: logging.Logger):
    logger.info(f"Received advance request data {data}")
    status = "accept"
    try:
        input = hex2bytes(data["payload"])
        logger.info(f"Received input: {input}")
        logger.info(f"Input length: {len(input)}")
        restored_image = decode_image(input)

        plate_box = process_image(input)
        cropped_image = crop_image(restored_image, plate_box[0].int())
        cropped_image.save('./img_crop.jpg')
        tesseract_output = os.system(
            'tesseract img_crop.jpg plate -l spa --psm 7')
        if tesseract_output != 0:
            print('Tesseract failed, '+tesseract_output)
            raise Exception("Tesseract failed to recognize the image.")
        with open('plate.txt', 'r') as file:
            plate_file = file.read()
        plate = plate_file.splitlines()[0].strip()
        x1, y1, x2, y2 = map(int, plate_box.tolist()[0])
        result_string = f"[{x1},{y1},{x2},{y2}]"
        output = '{{"plate": "{}", "box": {}}}'.format(plate, result_string)
        logger.info(f"Adding notice with payload: '{output}'")
        response = requests.post(
            rollup_server + "/notice", json={"payload": str2hex(output)})
        logger.info(
            f"Received notice status {response.status_code} body {response.content}")
        logger.info(f"Plate found: '{plate}'")
    except Exception as e:
        status = "reject"
        msg = f"Error processing data {data}\n{traceback.format_exc()}"
        logger.error(msg)
        response = requests.post(
            rollup_server + "/report", json={"payload": str2hex(msg)})
        logger.info(
            f"Received report status {response.status_code} body {response.content}")

    return status


def handle_inspect(data, rollup_server: str, logger: logging.Logger):
    logger.info(f"Received inspect request data {data}")
    logger.info("Adding report")
    response = requests.post(rollup_server + "/report",
                             json={"payload": data["payload"]})
    logger.info(f"Received report status {response.status_code}")
    return "accept"
