#!/usr/bin/env python3
# -*- coding:utf-8 -*-
# Copyright (c) Megvii, Inc. and its affiliates.

import os
import time

import cv2

import torch

from vendor.yolox.yolox.data.data_augment import ValTransform
from vendor.yolox.yolox.data.datasets import COCO_CLASSES
from vendor.yolox.yolox.exp import get_exp
from vendor.yolox.yolox.utils import  postprocess, vis

class Predictor(object):
    def __init__(
        self,
        model,
        exp,
        cls_names=COCO_CLASSES,
        trt_file=None,
        decoder=None,
        device="cpu",
        fp16=False,
        legacy=False,
    ):
        self.model = model
        self.cls_names = cls_names
        self.decoder = decoder
        self.num_classes = exp.num_classes
        self.confthre = exp.test_conf
        self.nmsthre = exp.nmsthre
        self.test_size = exp.test_size
        self.device = device
        self.fp16 = fp16
        self.preproc = ValTransform(legacy=legacy)
        if trt_file is not None:
            from torch2trt import TRTModule

            model_trt = TRTModule()
            model_trt.load_state_dict(torch.load(trt_file))

            x = torch.ones(1, 3, exp.test_size[0], exp.test_size[1]).cuda()
            self.model(x)
            self.model = model_trt

    def inference(self, img):
        import numpy as np
        img_info = {"id": 0}

        imgnp=np.frombuffer(img,np.uint8)
        img=cv2.imdecode(imgnp,cv2.IMREAD_COLOR)
        img_info["file_name"] = None
            
        print(type(img))
        height, width = img.shape[:2]
        print(height,width)
        img_info["height"] = height
        img_info["width"] = width
        img_info["raw_img"] = img

        ratio = min(self.test_size[0] / img.shape[0], self.test_size[1] / img.shape[1])
        img_info["ratio"] = ratio

        img, _ = self.preproc(img, None, self.test_size)
        img = torch.from_numpy(img).unsqueeze(0)
        img = img.float()
        if self.device == "gpu":
            img = img.cuda()
            if self.fp16:
                img = img.half()  # to FP16

        with torch.no_grad():
            t0 = time.time()
            outputs = self.model(img)
            if self.decoder is not None:
                outputs = self.decoder(outputs, dtype=outputs.type())
            outputs = postprocess(
                outputs, self.num_classes, self.confthre,
                self.nmsthre, class_agnostic=True
            )
        return outputs, img_info

    def get_box(self, output, img_info, cls_conf=0.35):
        ratio = img_info["ratio"]
        img = img_info["raw_img"]
        if output is None:
            return img
        output = output.cpu()

        bboxes = output[:, 0:4]
        bboxes /= ratio

        return bboxes

def process_image(img):
    exp = get_exp('./yolox_voc_nano.py', None)
    file_name = os.path.join(exp.output_dir, exp.exp_name)
    os.makedirs(file_name, exist_ok=True)
    exp.test_conf = 0.25
    exp.nmsthre = 0.45
    exp.test_size = (416, 416)

    model = exp.get_model()
    model.eval()
    ckpt_file = "./best_ckpt.pth"
    ckpt = torch.load(ckpt_file, map_location="cpu")
    model.load_state_dict(ckpt["model"])
    predictor = Predictor(
        model, exp, COCO_CLASSES, None, None,
        "cpu"
    )
    outputs, img_info = predictor.inference(img)
    return predictor.get_box(outputs[0], img_info, predictor.confthre)