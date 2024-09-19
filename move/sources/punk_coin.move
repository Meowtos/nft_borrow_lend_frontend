module my_addrx::punk_coin {
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

    const ASSET_SYMBOL: vector<u8> = b"APT_PUNK";
    const ASSET_NAME: vector<u8> = b"Aptos Punk";
    const ASSET_ICON_URI: vector<u8> = b"https://img.freepik.com/premium-psd/pixel-art-boy-character-with-sunglasses-isolated-transparent-background-game-character_401927-2106.jpg";

    fun init_module(creator: &signer){
        let constructor_ref = object::create_named_object(creator, ASSET_SYMBOL);
        primary_fungible_store::create_primary_store_enabled_fungible_asset(
            &constructor_ref,
            option::none(), //supply
            utf8(ASSET_NAME),
            utf8(ASSET_SYMBOL),
            8,
            utf8(ASSET_ICON_URI),
            utf8(b"https://github.com/ajaythxkur/@my_addrx_protocol"), // project uri
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

    public entry fun faucet(user: &signer) acquires AssetManagement {
        let user_addr = signer::address_of(user);
        mint(user_addr, 1_000_000_000);
    }

    #[view]
    public fun asset_address(): address {
        object::create_object_address(&@my_addrx, ASSET_SYMBOL)
    }
    #[view]
    public fun asset_metadata(addr: address): object::Object<Metadata> {
        object::address_to_object<Metadata>(addr)
    }
    #[view]
    public fun balance(addr: address): u64 {
        primary_fungible_store::balance(addr, asset_metadata(asset_address()))
    }

    #[test_only]
    public fun init_module_for_test(account: &signer) {
        init_module(account);
    }

    #[test(admin=@my_addrx, user=@0x200)]
    fun faucet_test(admin: &signer, user: &signer) acquires AssetManagement {
        init_module_for_test(admin);
        faucet(user);
        let metadata = asset_metadata(asset_address());
        assert!(primary_fungible_store::balance(signer::address_of(user), metadata) == 1_000_000_000, 0);
    }
}