//
//
//// Test Collection
//
//
#[test_only]
module my_addrx::meowtos {
    use std::signer::address_of;
    use aptos_token_objects::token;
    use aptos_token_objects::collection;
    use std::option;
    use std::string::{String, utf8};
    use aptos_framework::object;
    use std::bcs;
    use aptos_std::string_utils;

    struct ObjectController has key {
        app_extend_ref: object::ExtendRef,
    }

    struct MintCounter has key {
        counter: u64,
    }

    const COLLECTION_NAME: vector<u8> = b"Meowtos";
    const COLLECTION_DESCRIPTION: vector<u8> = b"Say Meow!";
    const COLLECTION_URI: vector<u8> = b"https://pbs.twimg.com/profile_images/1842388513448484864/RMwESVRz_400x400.jpg";
    const TOKEN_DESCRIPTION: vector<u8> = b"meow meow";

    fun init_module(creator: &signer) {
        let constructor_ref = object::create_named_object(creator, COLLECTION_NAME);
        let app_signer = &object::generate_signer(&constructor_ref);
        move_to(app_signer, ObjectController {
            app_extend_ref: object::generate_extend_ref(&constructor_ref),
        });
        move_to(app_signer, MintCounter {
            counter: 0,
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

    public entry fun mint(user: &signer, token_icon: String) acquires ObjectController, MintCounter {
        let royalty = option::none();
        let mint_counter = borrow_global_mut<MintCounter>(get_app_signer_addr());
        let constructor_ref = token::create_named_token(
            &get_app_signer(),
            utf8(COLLECTION_NAME),
            utf8(TOKEN_DESCRIPTION),
            utf8(construct_token_name(mint_counter.counter)),
            royalty,
            token_icon,
        );    
        let transfer_ref = object::generate_transfer_ref(&constructor_ref);
        object::transfer_with_ref(object::generate_linear_transfer_ref(&transfer_ref), address_of(user));
        mint_counter.counter = mint_counter.counter + 1;
    }


    fun get_app_signer_addr(): address {
        object::create_object_address(&@my_addrx, COLLECTION_NAME)
    }

    fun get_app_signer(): signer acquires ObjectController {
        object::generate_signer_for_extending(&borrow_global<ObjectController>(get_app_signer_addr()).app_extend_ref)
    }

    fun construct_token_name(counter: u64): vector<u8> {
        bcs::to_bytes(&string_utils::format1(&b"Meowtos #{}", counter))
    }

    #[view]
    public fun get_token_address(num: u64): address {
        token::create_token_address(
            &get_app_signer_addr(),
            &utf8(COLLECTION_NAME),
            &utf8(construct_token_name(num))
        )
    }

    #[test_only]
    public fun init_module_for_test(account: &signer) {
        init_module(account);
    }

    #[test(admin=@my_addrx, user=@0xCAFE)]
    fun mint_nft_test(admin: &signer, user: &signer) acquires ObjectController, MintCounter {
        init_module_for_test(admin);
        mint(user, utf8(b"Token uri"));
    }
} 