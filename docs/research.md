One of the significant challenges in our project was adapting the execution of artificial intelligence models within the Cartesi environment. This presented two primary constraints: one pertaining to the processing capabilities of the Cartesi Machine, and the other associated with its architecture.

Python stands out as a prevalent programming language in the field of Artificial Intelligence, thanks to its extensive array of libraries offering diverse functionalities. However, these libraries are typically compiled for commonly used computer architectures, such as amd64, x86, or arm64.

However, Cartesi is built on [RISC-V](https://riscv.org/) architecture which is not yet widely supported by conventional development tools. Addressing this architecture proved to be a challenge in our project that brought with it certain limitations. For this reason, we had to compile our Python libraries to adapt them specifically to the RISC-V architecture. Adapting these libraries, originally designed for more conventional architectures, became a key challenge in our journey, highlighting the importance of adaptability in bridging the world of traditional and emerging computer architectures.

Nowadays, there are several popular frameworks for the development of computer vision applications. These frameworks provide tools and libraries to facilitate working with images and videos, as well as for implementing computer vision algorithms. Some of the most prominent frameworks include [OpenCV](https://opencv.org/) and [PyTorch](https://pytorch.org/) and [Tensorflow](https://www.tensorflow.org/).

The steps we followed to process the image plate were as follows:

1. In our first attempts to manipulate images inside Cartesi, we used OpenCV. Our first experiment consisted of processing a color image within the Cartesi machine and extracting a single color channel from it.

1. Based on the success of our initial test, we proceeded to implement object detection models within Cartesi. We employed the YOLO (You Only Look Once) algorithm to identify objects in an image, which uses PyTorch. Unfortunately, this method posed problems due to the large number of model parameters.

1. Consequently, we opted to apply the nano version of YOLOX, with a reduced number of parameters of 910,000 (compared to 9 million YOLOXs). This adjustment yielded positive results, allowing us to successfully detect objects in an image.

1. Confident in our ability to run such models in Cartesi, we embarked on a custom training for the YOLOXn model tailored to patent detection. After training with 2,000 images over 80 epochs, we achieved a model with satisfactory performance.

1. We also trained a DNN (InceptionResnetV2) with tensorflow for patent detection, but we could not run it on Cartesi because we could not compile Tensorflow for RISC-V.

1. Having successfully identified the coordinates of a patent in an image within the Cartesi machine, our next objective was the detection of the contained text.

1. In our research for a text detection algorithm, we explored character recognition outside of Cartesi using two Python libraries: pytesseract and easyOCR. Although we considered both, easyOCR gave better results. Despite having successfully compiled this library for RISC-V, we faced difficulties importing it into Cartesi due to problems with scipy.

1. We finally managed to extract text inside the Cartesi machine using tesseract. Although the results varied from image to image, we successfully completed all the processing steps necessary for our proof of concept.
