module nft_lending::nft {
    use std::signer::address_of;
    use aptos_token_objects::token;
    use aptos_token_objects::collection;
    use std::option;
    use std::string::{String, utf8};
    use aptos_framework::object;

    struct ObjectController has key {
        app_extend_ref: object::ExtendRef,
    }
    const APP_OBJECT_SEED: vector<u8> = b"NFT_LENDING";
    const COLLECTION_NAME: vector<u8> = b"NFT Lending Test Collection";
    const COLLECTION_DESCRIPTION: vector<u8> = b"NFT Lending Test Collection";
    const COLLECTION_URI: vector<u8> = b"https://github.com/ajaythxkur";
    const TOKEN_DESCRIPTION: vector<u8> = b"NFT Lending Test Token";

    fun init_module(creator: &signer) {
        let constructor_ref = object::create_named_object(creator, APP_OBJECT_SEED);
        let app_signer = &object::generate_signer(&constructor_ref);
        move_to(app_signer, ObjectController {
            app_extend_ref: object::generate_extend_ref(&constructor_ref),
        });
        create_nft_collection(app_signer);
    }

    fun create_nft_collection(creator: &signer){
        let royalty = option::none();
        collection::create_unlimited_collection(
            creator,
            utf8(COLLECTION_DESCRIPTION),
            utf8(COLLECTION_NAME),
            royalty,
            utf8(COLLECTION_URI),
        );
    }

    public entry fun mint(user: &signer, token_name: String, token_icon: String) acquires ObjectController {
        let royalty = option::none();
        let constructor_ref = token::create_named_token(
            &get_app_signer(),
            utf8(COLLECTION_NAME),
            utf8(TOKEN_DESCRIPTION),
            token_name,
            royalty,
            token_icon,
        );    
        let transfer_ref = object::generate_transfer_ref(&constructor_ref);
        object::transfer_with_ref(object::generate_linear_transfer_ref(&transfer_ref), address_of(user));
    }


    fun get_app_signer_addr(): address {
        object::create_object_address(&@nft_lending, APP_OBJECT_SEED)
    }

    fun get_app_signer(): signer acquires ObjectController {
        object::generate_signer_for_extending(&borrow_global<ObjectController>(get_app_signer_addr()).app_extend_ref)
    }

    #[view]
    public fun get_token_address(creator_addr: address, token_name: String): address {
        token::create_token_address(
            &creator_addr,
            &utf8(COLLECTION_NAME),
            &token_name
        )
    }
} 