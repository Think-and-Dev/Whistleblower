#!/bin/bash

# Checks that an argument has been provided
if [ $# -ne 1 ]; then
    echo "Use: yarn send:image <path_to_image>"
    exit 1
fi

# Capture the path of the image of the first argument
image_path="$1"

# Execute the yarn command with the output of the Python script as argument
yarn start input send_file --path "$image_path"
