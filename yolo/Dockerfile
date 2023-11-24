# syntax=docker.io/docker/dockerfile:1.4
FROM --platform=linux/riscv64 cartesi/python:3.10-slim-jammy

WORKDIR /opt/cartesi/dapp

RUN apt-get update 
RUN apt-get install -y \
    build-essential cmake autotools-dev autoconf automake gfortran \
    gfortran-11 libgfortran-11-dev libgfortran5 pkg-config libopenblas-dev \
    liblapack-dev \
    libjpeg62 libtiff5 libjpeg-dev liblzma-dev liblz-dev zlib1g-dev \
    libhdf5-dev libhdf5-serial-dev libatlas-base-dev \
    libilmbase-dev libopenexr-dev libgstreamer1.0-dev libavcodec-dev libavformat-dev libswscale-dev and libwebp-dev libgtk2.0-0 \
    tesseract-ocr libgeos-dev

RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt -i https://think-and-dev.github.io/riscv-python-wheels/pip-index/

COPY ./entrypoint.sh .
COPY ./calculator.py .
COPY ./opencv-rvv /usr/local/opencv-rvv
COPY ./yolov5 /opt/cartesi/dapp/yolov5
COPY ./best.pt .
COPY ./images /opt/cartesi/dapp/images
COPY ./.EasyOCR /home/dapp/.EasyOCR


RUN ln -s /usr/lib/riscv64-linux-gnu/libtiff.so.5 /usr/lib/riscv64-linux-gnu/libtiff.so.6