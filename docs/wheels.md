# Building Wheels for RISC-V

In our project, we've compiled over 150 wheels for the RISC-V architecture, storing them in a [pip index](https://think-and-dev.github.io/riscv-python-wheels/pip-index/). The RISC-V architecture, renowned for its open and reduced instruction set design, provides a versatile platform for running Python applications.

The beauty of the RISC-V architecture lies in its modular and customizable approach, allowing for a wide array of implementations and adaptations. Through our ongoing effort in building wheels for RISC-V, we've simplified the installation of Python libraries on this architecture with an uncomplicated process.

> [!NOTE]
> In our current repository, we have included pre-built wheels obtained from other public repositories (https://github.com/zhangwm-pt/prebuilt_whl/tree/python3.10 and https://github.com/felipefg/pip-wheels-riscv/tree/main/wheels).

## How to use?

To leverage these wheels, simply include the name and version of the libraries in a `requirements.txt` file and execute the following command:

```
pip install -r requirements.txt -i https://think-and-dev.github.io/riscv-python-wheels/pip-index/
```

## How to contribute?

If you're interested in contributing or want more details on how to compile your Python wheels for RISC-V, refer to the instructions in the [Python riscv64 wheels builder](https://github.com/Think-and-Dev/riscv-python-wheels) repository.
