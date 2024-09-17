// Remove module while going on mainnet
module wiz::token {
    use aptos_framework::object;
    use aptos_token::token;
    use std::string::{utf8, String};

    struct ObjectController has key {
        app_extend_ref: object::ExtendRef,
    }

    const COLLECTION_NAME: vector<u8> = b"Aptos Wizards";
    const COLLECTION_DESCRIPTION: vector<u8> = b"Description";
    const COLLECTION_URI: vector<u8> = b"URI";

    fun init_module(creator: &signer){
        let constructor_ref = &object::create_named_object(creator, COLLECTION_NAME);
        let obj_signer = &object::generate_signer(constructor_ref);
        move_to(obj_signer, ObjectController {
            app_extend_ref: object::generate_extend_ref(constructor_ref),
        });
    }
    fun create_nft_collection(creator: &signer){
        // This means that the supply of the token will not be tracked.
        let maximum_supply = 0;
        // This variable sets if we want to allow mutation for collection description, uri, and maximum.
        // Here, we are setting all of them to false, which means that we don't allow mutations to any CollectionData fields.
        let mutate_setting = vector<bool>[ false, false, false ];
        token::create_collection(
            creator,
            utf8(COLLECTION_NAME),
            utf8(COLLECTION_DESCRIPTION),
            utf8(COLLECTION_URI),
            maximum_supply,
            mutate_setting,
        );
    }

    fun get_app_signer_addr(): address {
        object::create_object_address(&@wiz, COLLECTION_NAME)
    }

    fun get_app_signer(): signer acquires ObjectController {
        object::generate_signer_for_extending(&borrow_global<ObjectController>(get_app_signer_addr()).app_extend_ref)
    }

    entry fun mint_token(account: &signer, token_name: String, token_icon: String) acquires ObjectController {
        let token_data_id = token::create_tokendata(
            &get_app_signer(),
            utf8(COLLECTION_NAME),
            token_name,
            utf8(b""),
            0,
            token_icon,
            @wiz,
            1,
            0,
            // This variable sets if we want to allow mutation for token maximum, uri, royalty, description, and properties.
            // Here we enable mutation for properties by setting the last boolean in the vector to true.
            token::create_token_mutability_config(
                &vector<bool>[ false, false, false, false, true ]
            ),
            // We can use property maps to record attributes related to the token.
            // In this example, we are using it to record the receiver's address.
            // We will mutate this field to record the user's address
            // when a user successfully mints a token in the `mint_nft()` function.
            vector<String>[utf8(b"given_to")],
            vector<vector<u8>>[b""],
            vector<String>[utf8(b"address")],
        );
        token::mint_token(account, token_data_id, 1);
    }

    #[view]
    public fun get_token_data_id(token_name: String): token::TokenDataId  {
        token::create_token_data_id(
            get_app_signer_addr(),
            utf8(COLLECTION_NAME),
            token_name,
        )
    }

    #[test_only]
    public fun init_module_for_test(account: &signer) {
        init_module(account);
    }
    // TODO
    #[test(admin=@wiz, user=@0xCAFE)]
    public fun mint_token_test(admin: &signer, _user: &signer)
    // acquires ObjectController
    {
        init_module_for_test(admin);
        // mint_token(user, utf8(b"Token name"), utf8(b"Token uri"));
    }
}