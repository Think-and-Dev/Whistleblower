# AI models

The **Whistleblower** Dapp uses a license plate recognition model that was built by leveraging the synergistic potential of OpenCV, YOLO and optical character recognition (OCR). OpenCV is a versatile open source library for computer vision and image processing, which endows the model with efficient image manipulation, key feature extraction and vital preprocessing capabilities. YOLO (You Only Look Once) is a state-of-the-art object detection framework, renowned for its real-time accuracy, capable of rapidly identifying license plates in images. The integration of OCR further enhances the model's ability to accurately recognize and decode license plate characters, ensuring complete and fast results.

## Licence plate detection (YOLOX)

For object detection we use [YOLOX](https://github.com/Megvii-BaseDetection/YOLOX), an improved version of the YOLO architecture that addresses previous limitations. We implement the YOLOX-Nano variant, designed to be more efficient and lightweight.

The details of the training process extend beyond the scope of this proof of concept. Although there is room for further enhancement in the model's performance, it has received substantial training, proving its capability to successfully execute the proof of concept. Specifically, the model underwent training on Google Colab, leveraging 2000 labeled images over 80 epochs.

## Character recognition

Currently, our character recognition system relies on [Tesseract](https://github.com/tesseract-ocr/tesseract). Moving forward, we plan to investigate the integration of alternative models like [EasyOCR](https://github.com/JaidedAI/EasyOCR). Additionally, we are exploring the possibility of custom training to develop a specialized model capable of recognizing distinct typography and text formats specific to patents originating from a particular country.

> [!WARNING]
> It's important to note that Tesseract may not perform optimally with all types of images. Ongoing efforts are in place to refine and enhance the OCR model in future iterations.
