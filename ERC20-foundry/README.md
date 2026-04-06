## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```

```shell
$ forge create src/MyToken.sol:MyToken --rpc-url 127.0.0.1:854 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast
```

forge create src/MyToken.sol:MyToken --rpc-url 127.0.0.1:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast
[⠊] Compiling...
No files changed, compilation skipped
Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Transaction hash: 0x1fb23279fb3f09101deda7f27578ad349af64b80516f2566482694fbde046241


cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "name()(string)" --rpc-url http://127.0.0.1:8545
"MyFirstToken"

cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "symbol()(string)" --rpc-url http://127.0.0.1:8545
"MFT"

cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "decimals()(uint8)" --rpc-url http://127.0.0.1:8545
18


cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "balanceOf(address)(uint256)" 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266  --rpc-url http://127.0.0.1:8545
0


cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "mint(address, uint256)" 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 100  --rpc-url http://127.0.0.1:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

blockHash            0x369b045f3883350517f3487810206d416f4d8c546aa23c68ab4604aa82950975
blockNumber          2
contractAddress      
cumulativeGasUsed    71157
effectiveGasPrice    885654093
from                 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
gasUsed              71157
logs                 [{"address":"0x5fbdb2315678afecb367f032d93f642f64180aa3","topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x0000000000000000000000000000000000000000000000000000000000000000","0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266"],"data":"0x0000000000000000000000000000000000000000000000000000000000000064","blockHash":"0x369b045f3883350517f3487810206d416f4d8c546aa23c68ab4604aa82950975","blockNumber":"0x2","blockTimestamp":"0x69d33ff9","transactionHash":"0xd20b025a6fbd1e4bca6a9faad57573468340b8dfe5586ae8aa00590126993b0e","transactionIndex":"0x0","logIndex":"0x0","removed":false}]
logsBloom            0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000040020000000000000100000800000000000000000000000010000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000042000000200000000000000000000000002000000000000000000020000000000000000000000000000000000000000000000000000000000000000000
root                 
status               1 (success)
transactionHash      0xd20b025a6fbd1e4bca6a9faad57573468340b8dfe5586ae8aa00590126993b0e
transactionIndex     0
type                 2
blobGasPrice         1
blobGasUsed          
to                   0x5FbDB2315678afecb367f032d93F642f64180aa3


cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "balanceOf(address)(uint256)" 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266  --rpc-url http://127.0.0.1:8545        
100



cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "transfer(address, uint256)" 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC 10  --rpc-url http://127.0.0.1:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 

blockHash            0x194adc0324d28cd170010d7ff8e4644231dea0f0062cf8379a9fb0211854a397
blockNumber          3
contractAddress      
cumulativeGasUsed    52066
effectiveGasPrice    775472503
from                 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
gasUsed              52066
logs                 [{"address":"0x5fbdb2315678afecb367f032d93f642f64180aa3","topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266","0x0000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc"],"data":"0x000000000000000000000000000000000000000000000000000000000000000a","blockHash":"0x194adc0324d28cd170010d7ff8e4644231dea0f0062cf8379a9fb0211854a397","blockNumber":"0x3","blockTimestamp":"0x69d39013","transactionHash":"0x1106c44224732c6dd97d07ea754dc148d49c63bc0f72edf6d1bff6c08f1af36d","transactionIndex":"0x0","logIndex":"0x0","removed":false}]
logsBloom            0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000008000000000000000000000000000000000000000000000040000000000000000100000000000800000000000000000010000000000000000000000000000000000000000000000000000000000000000200000000000000000000200000000000000000000000000000000000000000000000000000000042000000200000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
root                 
status               1 (success)
transactionHash      0x1106c44224732c6dd97d07ea754dc148d49c63bc0f72edf6d1bff6c08f1af36d
transactionIndex     0
type                 2
blobGasPrice         1
blobGasUsed          
to                   0x5FbDB2315678afecb367f032d93F642f64180aa3


cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "balanceOf(address)(uint256)" 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266  --rpc-url http://127.0.0.1:8545 
90


 cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "balanceOf(address)(uint256)" 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC  --rpc-url http://127.0.0.1:8545
10