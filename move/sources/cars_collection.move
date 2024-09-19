module my_addrx::cars_collection {
    use std::signer::address_of;
    use aptos_token_objects::token;
    use aptos_token_objects::collection;
    use std::option;
    use std::string::{String, utf8};
    use aptos_framework::object;

    struct ObjectController has key {
        app_extend_ref: object::ExtendRef,
    }
    const COLLECTION_NAME: vector<u8> = b"Aptos Cars";
    const COLLECTION_DESCRIPTION: vector<u8> = b"Flex your favorite cars by minting an NFT";
    const COLLECTION_URI: vector<u8> = b"https://img.freepik.com/premium-photo/lego-car-with-blue-car-top-word-car-side_811279-104257.jpg";
    const TOKEN_DESCRIPTION: vector<u8> = b"Top on speed";

    fun init_module(creator: &signer) {
        let constructor_ref = object::create_named_object(creator, COLLECTION_NAME);
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
        object::create_object_address(&@my_addrx, COLLECTION_NAME)
    }

    fun get_app_signer(): signer acquires ObjectController {
        object::generate_signer_for_extending(&borrow_global<ObjectController>(get_app_signer_addr()).app_extend_ref)
    }

    #[view]
    public fun get_token_address(token_name: String): address {
        token::create_token_address(
            &get_app_signer_addr(),
            &utf8(COLLECTION_NAME),
            &token_name
        )
    }

    #[test_only]
    public fun init_module_for_test(account: &signer) {
        init_module(account);
    }

    #[test(admin=@my_addrx, user=@0xCAFE)]
    fun mint_nft_test(admin: &signer, user: &signer) acquires ObjectController {
        init_module_for_test(admin);
        mint(user, utf8(b"Token name"), utf8(b"Token uri"));
    }
} 