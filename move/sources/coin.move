// Remove module while going on mainnet
module wiz::coin {
    use std::signer;
    use aptos_framework::coin::{Self, MintCapability, BurnCapability};
    use std::string::utf8;

    struct SimpuCoin has key {}

    struct CoinAbilities has key {
        mint_cap: MintCapability<SimpuCoin>,
        burn_cap: BurnCapability<SimpuCoin>,
    }

    const FAUCET_LIMIT: u64 = 5000000; // 5 tokens

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
        let mint_cap = &borrow_global<CoinAbilities>(@wiz).mint_cap;
        let coins = coin::mint<SimpuCoin>(amount, mint_cap);
        coin::deposit(to, coins);
    }

    public entry fun faucet(receiver: &signer) acquires CoinAbilities {
        let receiver_addr = signer::address_of(receiver);
        if(!coin::is_account_registered<SimpuCoin>(receiver_addr)){
            coin::register<SimpuCoin>(receiver);
        };
        mint_coins(receiver_addr, FAUCET_LIMIT);
    }

    #[view]
    public fun balance(addr: address): u64 {
        coin::balance<SimpuCoin>(addr)
    }

    #[test_only]
    use aptos_framework::account;

    #[test_only]
    public fun init_module_for_test(account: &signer) {
        init_module(account);
    }

    #[test(admin=@wiz, user=@0x200)]
    fun faucet_test(admin: &signer, user: &signer) acquires CoinAbilities {
        init_module_for_test(admin);
        account::create_account_for_test(signer::address_of(user));
        faucet(user);
        assert!(coin::balance<SimpuCoin>(signer::address_of(user)) == FAUCET_LIMIT, 0);
    }
}