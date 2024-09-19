
# NFT Lending

Turn your NFTs into collateral and access cryptocurrency loans with ease. No need to sell—just lend your NFTs and get the liquidity you need in minutes.


## Installation

To run this project on local, setup the env then

```bash
 cd frontend && npm i && npm run dev
```

```bash
 cd server && yarn install && yarn dev
```

## Interact with contract

To compile contract

```bash
 aptos move compile --dev
```

To run tests in contract

```bash
 aptos move test
```

To deploy the contract using object

```bash
 aptos init --netowrk devnet
``

```bash
 PUBLISHER_PROFILE=default
 PUBLISHER_ADDR=0x$(aptos config show-profiles --profile=$PUBLISHER_PROFILE | grep 'account' | sed -n 's/.*"account": \"\(.*\)\".*/\1/p')
```

```bash
 aptos move create-object-and-publish-package \
    --address-name my_addrx \
    --named-addresses my_addrx=$PUBLISHER_ADDR\
    --profile $PUBLISHER_PROFILE \
    --assume-yes  
```

To update the contract 

```bash
 CONTRACT_OBJECT_ADDR
```

```bash
 aptos move upgrade-object-package \
    --object-address $CONTRACT_OBJECT_ADDR \
    --named-addresses my_addrx=$CONTRACT_OBJECT_ADDR\
    --profile $PUBLISHER_PROFILE \
    --assume-yes 
```


## Authors

- [ajaythxkur](https://www.github.com/ajaythxkur)

- [devilajy](https://www.github.com/devil02070)

