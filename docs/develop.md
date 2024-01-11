## How to run Whistleblower locally

To run Whistleblower locally, follow the steps below:

1. Clone the [Whistpleblower](https://github.com/Think-and-Dev/Whistleblower.git) repository.
2. Navigate to the `Whistpleblower/backend-dapp/whistleblower`
3. Build de Whistleblower Dapp

```
docker buildx bake --load
```

4. Run the application starting an environment that includes a local blockchain with the Cartesi smart contracts deployed, as well as a Cartesi L2 node executing the dApp's back-end logic.

```
docker compose -f ../docker-compose.yml -f ./docker-compose.override.yml up
```

Allow some time for the infrastructure to be ready. How much will depend on your system, but eventually the container logs will only show the continuous production of empty blocks in the local blockchain, similar to the ones displayed below:

```
rollups-examples-hardhat-1                      | Mined empty block range #32 to #33
rollups-examples-hardhat-1                      | Mined empty block range #32 to #34
rollups-examples-hardhat-1                      | Mined empty block range #32 to #35
```

5. You can shutdown the environment with ctrl+c and then running:

```
docker compose -f ../docker-compose.yml -f ./docker-compose.override.yml down -v
```

> [!NOTE]
> For further information please check the Cartesi rollups [documentation](https://docs.cartesi.io/cartesi-rollups/build-dapps/run-dapp/).

## How to interact with the Dapp

### Frontend console

1. Open a separate terminal window
2. Navigate to the frontend-console directory:

```
cd frontend-console
```

3. Build the frontend console application:

```
yarn
yarn build
```

4. Send an input (a _jpg_ or _png_ image) to the current locally deployed dApp

```
yarn start input send_file --path "/path_to_image"
```

5. Verify the notices generated by the input

```
yarn start notice list
```

The response should include a `payload` key, where the value encompasses the identified license plate number (`plate`) along with the bounding box's position that contains the plate within the image (`box`). The response should look like this:

```
[{"index":0,"input":0,"payload":"{\"plate\": \"AB 123 CD.\", \"box\": [330,355,558,430]}"}]
```

### React frontend

1. Navigate to the `Whistleblower/frontend` directory and build the frontend application

```
npm install
npm start
```

2. To interact with the application, open your web browser and enter `localhost:3000` in the address bar.