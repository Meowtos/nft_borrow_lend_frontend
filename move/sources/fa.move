// Fungible assets for testing used withing app for demo
module nft_lending::aptos_pepe {
    use std::signer;
    use aptos_framework::fungible_asset::{Self, MintRef, TransferRef, Metadata};
    use aptos_framework::object;
    use aptos_framework::primary_fungible_store;
    use std::string::utf8;
    use aptos_framework::timestamp;
    use std::option;

    struct AssetManagement has key {
        mint_ref: MintRef,
        transfer_ref: TransferRef,
    }

    struct FaucetManagement has key {
        claim_timestamp: u64 
    }

    const ECOME_BACK_LATER: u64 = 0;

    const ASSET_SYMBOL: vector<u8> = b"PEPE";
    const ASSET_NAME: vector<u8> = b"Aptos Pepe";
    const ASSET_ICON_URI: vector<u8> = b"https://static01.nyt.com/images/2016/09/28/us/28xp-pepefrog/28xp-pepefrog-superJumbo.jpg";
    const FAUCET_LIMIT: u64 = 1000000000; // 10 tokens

    fun init_module(creator: &signer){
        let constructor_ref = object::create_named_object(creator, ASSET_SYMBOL);
        primary_fungible_store::create_primary_store_enabled_fungible_asset(
            &constructor_ref,
            option::none(), //supply
            utf8(ASSET_NAME),
            utf8(ASSET_SYMBOL),
            8,
            utf8(ASSET_ICON_URI),
            utf8(b"https://github.com/ajaythxkur/nft_lending"), // project uri
        );
        let obj_signer = &object::generate_signer(&constructor_ref);
        move_to(
            obj_signer,
            AssetManagement {
                mint_ref: fungible_asset::generate_mint_ref(&constructor_ref),
                transfer_ref: fungible_asset::generate_transfer_ref(&constructor_ref),
            }
        );
    }

    fun mint(to: address, amount: u64) acquires AssetManagement {
        let asset_management = borrow_global<AssetManagement>(asset_address());
        let to_wallet = primary_fungible_store::ensure_primary_store_exists(to, asset_metadata(asset_address()));
        let fa = fungible_asset::mint(&asset_management.mint_ref, amount);
        fungible_asset::deposit_with_ref(&asset_management.transfer_ref, to_wallet, fa);
    }

    fun asset_address(): address {
        object::create_object_address(&@nft_lending, ASSET_SYMBOL)
    }

    fun asset_metadata(addr: address): object::Object<Metadata> {
        object::address_to_object<Metadata>(addr)
    }

    public entry fun take_faucet(user: &signer) acquires FaucetManagement, AssetManagement {
        let user_addr = signer::address_of(user);
        if(!exists<FaucetManagement>(user_addr)){
            move_to(user, FaucetManagement {
                claim_timestamp: 0,
            });
        };
        let faucet_management = borrow_global_mut<FaucetManagement>(user_addr);
        let current_timestamp = timestamp::now_seconds();
        assert!(current_timestamp > add_hours_to_timestamp(4, faucet_management.claim_timestamp), ECOME_BACK_LATER);
        mint(user_addr, FAUCET_LIMIT);
        faucet_management.claim_timestamp = current_timestamp;
    }

    fun add_hours_to_timestamp(hours: u64, timestamp: u64): u64 {
        let additional_secs = hours * 60 * 3600;
        timestamp + additional_secs

    }
    
}