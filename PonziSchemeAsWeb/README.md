## Ponzi Scheme As Web

You can find the project here: [ETHPonzi](http://www.ethponzi.com)

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

Copy the contract address to the UI in the `contracts.config.js`.

```
....
,{
  name: "Your network name",
  address: "0xdb9991ba60a929e8817aa511fe5fb6703bc34797",
  endpoint: "YOUR ENDPOINT, probably http://localhost:8545"
  addressBlockExplorer: "The link to the address",
  networkId: 0
}
...
```

Use `networkId` as `0` for use a development network.

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

and we copy it in the `contracts.config.js` along with the ropsten endpoint:

```
...
  ,{
    name: "Testnet Ropsten",
    address: "0x56f7f47fbcc9cda2966dca64b8a53a8d567f21ac",
    endpoint: "https://ropsten.infura.io/",
    addressBlockExplorer: "https://ropsten.etherscan.io/address/",
    networkId: 3
  }
...
```

Since is an static it can be run everywhere.

`networkId` is the web3 output of `getNetwork` method.

### Main Ethereum Network setup

As in the testnet but with an ethereum endpoint.
