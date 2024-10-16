//
//
//// Test Coin
//
//
#[test_only]
module my_addrx::moon_coin {
    use std::signer;
    use aptos_framework::coin::{Self, MintCapability, BurnCapability};
    use std::string::utf8;

    struct MoonCoin has key {}

    struct CoinAbilities has key {
        mint_cap: MintCapability<MoonCoin>,
        burn_cap: BurnCapability<MoonCoin>,
    }

    fun init_module(creator: &signer){
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<MoonCoin>(
            creator,
            utf8(b"Moon on Aptos"),
            utf8(b"MOON"),
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
        let mint_cap = &borrow_global<CoinAbilities>(@my_addrx).mint_cap;
        let coins = coin::mint<MoonCoin>(amount, mint_cap);
        coin::deposit(to, coins);
    }

    public entry fun faucet(receiver: &signer) acquires CoinAbilities {
        let receiver_addr = signer::address_of(receiver);
        if(!coin::is_account_registered<MoonCoin>(receiver_addr)){
            coin::register<MoonCoin>(receiver);
        };
        mint_coins(receiver_addr, 10_000_000);
    }

    #[view]
    public fun balance(addr: address): u64 {
        coin::balance<MoonCoin>(addr)
    }

    #[test_only]
    use aptos_framework::account;

    #[test_only]
    public fun init_module_for_test(account: &signer) {
        init_module(account);
    }

    #[test(admin=@my_addrx, user=@0x200)]
    fun faucet_test(admin: &signer, user: &signer) acquires CoinAbilities {
        init_module_for_test(admin);
        account::create_account_for_test(signer::address_of(user));
        faucet(user);
        assert!(coin::balance<MoonCoin>(signer::address_of(user)) == 10_000_000, 0);
    }
}