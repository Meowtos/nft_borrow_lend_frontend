// Fungible assets for testing used withing app for demo
module nft_lending::meow {
    use std::signer;
    use aptos_framework::fungible_asset::{Self, MintRef, TransferRef, Metadata};
    use aptos_framework::object;
    use aptos_framework::primary_fungible_store;
    use std::string::utf8;
    use std::option;

    struct AssetManagement has key {
        mint_ref: MintRef,
        transfer_ref: TransferRef,
    }

    const ASSET_SYMBOL: vector<u8> = b"MEOW";
    const ASSET_NAME: vector<u8> = b"Meow Meow";
    const ASSET_ICON_URI: vector<u8> = b"https://yt3.googleusercontent.com/ytc/AIdro_kwV3SXYI2QnFZNe8vCvFYBzi0_JUec5VwBv0bLV6LxUjw=s160-c-k-c0x00ffffff-no-rj";
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

    #[view]
    fun asset_address(): address {
        object::create_object_address(&@nft_lending, ASSET_SYMBOL)
    }

    fun asset_metadata(addr: address): object::Object<Metadata> {
        object::address_to_object<Metadata>(addr)
    }

    public entry fun take_faucet(user: &signer) acquires AssetManagement {
        let user_addr = signer::address_of(user);
        mint(user_addr, FAUCET_LIMIT);
    }
    
}