module nft_lending::simpu_coin {
    use std::signer;
    use aptos_framework::coin::{Self, MintCapability, BurnCapability};
    use std::string::utf8;

    struct SimpuCoin has key {}

    struct CoinAbilities has key {
        mint_cap: MintCapability<SimpuCoin>,
        burn_cap: BurnCapability<SimpuCoin>,
    }

    const FAUCET_LIMIT: u64 = 10000000; // 10 tokens

    fun init_module(creator: &signer){
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<SimpuCoin>(
            creator,
            utf8(b"Simpu coin"),
            utf8(b"SIMPU"),
            6,
            true // total supply should be tracked?? (bool)
        );
        move_to(creator, CoinAbilities {
            mint_cap,
            burn_cap,
        });
        coin::destroy_freeze_cap(freeze_cap);
    }

    fun mint_coins(to: address, amount: u64) acquires CoinAbilities {
        let mint_cap = &borrow_global<CoinAbilities>(@nft_lending).mint_cap;
        let coins = coin::mint<SimpuCoin>(amount, mint_cap);
        coin::deposit(to, coins);
    }

    public entry fun take_coin_faucet(receiver: &signer) acquires CoinAbilities {
        let receiver_addr = signer::address_of(receiver);
        if(!coin::is_account_registered<SimpuCoin>(receiver_addr)){
            coin::register<SimpuCoin>(receiver);
        };
        mint_coins(receiver_addr, FAUCET_LIMIT);
    }

    // use aptos_framework::aptos_account;

    // public fun mint_coins(receiver: address, amount: u64) acquires CoinAbilities {
    //     let mint_cap = &borrow_global<CoinAbilities>(@my_module);
    //     let coins = coin::mint<MyCoin>(amount, mint_cap);
    //     aptos_account::deposit_coins(receiver, coins);
    // }

    // public fun take_and_give(sender: &signer, receiver: address, amount: u64) {
    //     aptos_account::transfer_coins<MyCoin>(sender, receiver, amount);
    // }

}