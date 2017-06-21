## Ponzi Scheme As Web

### Context

Provide a web interface for the [Ponzi Scheme Contract](https://github.com/MiguelBel/DApps/tree/master/PonziScheme)

### Development Setup

Run the docker compose with:

```
docker-compose up --build
```

Deploy the contract with:

```
docker-compose run deploy node deploy.js
```

The output should be something like:

```
Transaction: 0x2a0b58a28fef1ff12d01fbc74faaf5dc81fbbf3eb96d27ea2f379f7f49538bad
Waiting for the transaction to be mined...
Contract address: 0xdb9991ba60a929e8817aa511fe5fb6703bc34797
```

The contract address is 0xdb9991ba60a929e8817aa511fe5fb6703bc34797.

Copy the contract address to the UI in the `index.html`.

```
var contractAddress = 'CONTRACT_ADDRESS';
```

You can access the application in `http://localhost:9000`. If you are curious what happens at the blockchain level you can check the docker testrpc logs.

### Testnet setup

Instead of deploying againt a local rpc you can also deploy the contract in a testnet. Let's say Ropsten test network.

First we should modify the script for deploy (`deploy/deploy.js`) with:

```
var publicKey = "YOUR_ROPSTEN_PUBLIC_KEY"
var privateKey = "YOUR_ROPSTEN_PRIVATE_KEY";
var endpoint = "https://ropsten.infura.io";
```

Then we deploy the contract:

```
docker-compose run deploy node deploy.js
```

and we copy it in the `index.html` along with the ropsten endpoint:

```
var endpoint = "https://ropsten.infura.io"
var contractAddress = '0xdb9991ba60a929e8817aa511fe5fb6703bc34797';
```

Since is an static it can be run everywhere.

### Main Ethereum Network setup

As in the testnet but with an ethereum endpoint.
