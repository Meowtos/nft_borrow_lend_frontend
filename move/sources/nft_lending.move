module nft_lending::nft_lending {
    use std::signer::address_of;
    use aptos_framework::object::{Self, Object};
    use aptos_framework::fungible_asset::{Self, Metadata};
    use aptos_framework::primary_fungible_store;
    use aptos_framework::event;
    use aptos_std::type_info;
    use aptos_framework::coin;
    use aptos_framework::account;
    use aptos_framework::timestamp;
    use aptos_framework::aptos_account;


    struct AppSigner has key {
        extend_ref: object::ExtendRef,
    }


    #[resource_group_member(group=aptos_framework::object::ObjectGroup)]
    struct MetadataInfo has key {
        metadata: Object<Metadata>,
    }

    #[resource_group_member(group=aptos_framework::object::ObjectGroup)]
    struct CoinTypeInfo has key {
        coin_type: vector<u8>,
    }

    #[resource_group_member(group=aptos_framework::object::ObjectGroup)]
    struct Offer has key {
        // loan giver address
        by_addr: address,
        // Token id of the nft loan being given for (for validation)
        token_id: Object<object::ObjectCore>,
        // Amount
        amount: u64,
        // loan duration (in days)
        duration: u64,
        // apr
        apr: u64,
        // delete ref
        delete_ref: object::DeleteRef,
    }  

    #[resource_group_member(group=aptos_framework::object::ObjectGroup)]
    struct Borrow has key {
        // The borrower
        user_addr: address,
        // address borrowed from
        from_addr: address,
        // Token id
        token_id: Object<object::ObjectCore>,
        // Amount
        amount: u64,
        // loan duration (in days)
        duration: u64,
        // apr
        apr: u64,
        // Loan start timestamp
        start_timestamp: u64,
        // extend_ref
        extend_ref: object::ExtendRef,
        // delete ref
        delete_ref: object::DeleteRef,
    }

    #[event]
    struct OfferEvent has store, drop {
        object: address,
    }

    #[event]
    struct BorrowEvent has store, drop {
        object: address,
    }

    // Errors
    const ELOAN_DURATION_LIMIT_EXCEED: u64 = 0;
    const EINSUFFICIENT_BALANCE: u64 = 1;
    const EOFFER_DOESNT_EXIST: u64 = 2;
    const ENOT_OFFER_OWNER: u64 = 3;
    const ENO_METADATA: u64 = 4;
    const ENO_COINTYPE: u64 = 5;
    const EINVALID_COINTYPE: u64 = 6;
    const ESAME_OFFER_BORROW: u64 = 7;
    const EBORROW_DOESNT_EXIST: u64 = 8;
    const ENOT_BORROW_OWNER: u64 = 9;
    const EREPAY_TIME_HAS_EXCEED: u64 = 10;
    const EUNAUTHORIZED_ACTION: u64 = 11;
    const EREPAY_TIME_HAS_NOT_EXCEED: u64 = 12;

    // constants
    const APR_DENOMINATOR: u64 = 10000;
    const APP_OBJECT_SEED: vector<u8> = b"NFT LENDING APP";

    fun init_module(module_signer: &signer){
        let constructor_ref = &object::create_named_object(module_signer, APP_OBJECT_SEED);
        let obj_signer = &object::generate_signer(constructor_ref);
        move_to(obj_signer, AppSigner {
            extend_ref: object::generate_extend_ref(constructor_ref),
        });
    }

    fun get_app_signer_address(): address {
        object::create_object_address(&@nft_lending, APP_OBJECT_SEED)
    }

    fun get_app_signer(): signer acquires AppSigner {
        object::generate_signer_for_extending(&borrow_global<AppSigner>(get_app_signer_address()).extend_ref)
    }

    entry fun offer_with_fa(
        account: &signer,
        token_id: Object<object::ObjectCore>,
        amount: u64,
        duration: u64,
        apr: u64,
        metadata: Object<Metadata>,
    ) {
        let app_signer_addr = get_app_signer_address();
        register_fa_store(app_signer_addr, metadata);
        assert!(primary_fungible_store::balance(address_of(account), metadata) >= amount, EINSUFFICIENT_BALANCE);
        let fa = primary_fungible_store::withdraw(account, metadata, amount);
        primary_fungible_store::deposit(app_signer_addr, fa);
        let obj_signer = make(account, token_id, amount, duration, apr);
        move_to(obj_signer, MetadataInfo{
            metadata,
        });
    }

    fun register_fa_store(addr: address, metadata: Object<Metadata>) {
        primary_fungible_store::ensure_primary_store_exists(addr, metadata);
    }

    // This function creates the loan offer
    inline fun make(user: &signer, token_id: Object<object::ObjectCore>, amount: u64, duration: u64, apr: u64): &signer {
        assert!(duration > 0 && duration < 365, ELOAN_DURATION_LIMIT_EXCEED);
        let constructor_ref = &object::create_object(address_of(user));
        let obj_signer = &object::generate_signer(constructor_ref);
        move_to(obj_signer, Offer {
            by_addr: address_of(user),
            token_id,
            amount,
            duration,
            apr,
            delete_ref: object::generate_delete_ref(constructor_ref),
        });
        event::emit<OfferEvent>(
            OfferEvent {
                object: object::address_from_constructor_ref(constructor_ref),
            }
        );
        obj_signer
    }

    entry fun offer_with_coin<CoinType>(
        account: &signer,
        token_id: Object<object::ObjectCore>,
        amount: u64,
        duration: u64,
        apr: u64,
    ) acquires AppSigner {
        let app_signer_addr = get_app_signer_address();
        if(!coin::is_account_registered<CoinType>(app_signer_addr)){
            let app_signer = &get_app_signer();
            account::create_account_if_does_not_exist(app_signer_addr);
            coin::register<CoinType>(app_signer);
        };
        coin::transfer<CoinType>(account, app_signer_addr, amount);
        let obj_signer = make(account, token_id, amount, duration, apr);
        move_to(obj_signer, CoinTypeInfo {
            coin_type: coin_struct_name<CoinType>(),
        });
    }

    inline fun coin_struct_name<CoinType>(): vector<u8> {
        let coin_type_info = type_info::type_of<CoinType>();
        type_info::struct_name(&coin_type_info)
    }

    entry fun withdraw_with_fa(
        account: &signer, 
        make: Object<object::ObjectCore>
    ) acquires Offer, MetadataInfo, AppSigner {
        let make_addr = object::object_address(&make);
        assert!(exists<MetadataInfo>(make_addr), ENO_METADATA);
        let metadata = borrow_global<MetadataInfo>(make_addr).metadata;
        let amount = withdraw(account, make);
        let pfs = primary_fungible_store::ensure_primary_store_exists(address_of(account), metadata);
        let app_signer = &get_app_signer();
        let fa = primary_fungible_store::withdraw(app_signer, metadata, amount);
        fungible_asset::deposit(pfs, fa);
    }

    inline fun withdraw(account: &signer, make: Object<object::ObjectCore>): u64 {
        let make_addr = object::object_address(&make);
        assert!(exists<Offer>(make_addr), EOFFER_DOESNT_EXIST);
        assert!(object::is_owner(make, address_of(account)), ENOT_OFFER_OWNER);
        let Offer {
            by_addr,
            token_id:_,
            amount,
            duration:_,
            apr:_,
            delete_ref,
        } = move_from<Offer>(make_addr);
        // skips
        assert!(by_addr == address_of(account), ENOT_OFFER_OWNER);
        object::delete(delete_ref);
        amount 
    }

    entry fun withdraw_with_coin<CoinType>(
        account: &signer, 
        make: Object<object::ObjectCore>
    ) acquires Offer, CoinTypeInfo, AppSigner {
        let make_addr = object::object_address(&make);
        assert!(exists<CoinTypeInfo>(make_addr), ENO_COINTYPE);
        let coin_type = borrow_global<CoinTypeInfo>(make_addr).coin_type;
        assert!(coin_struct_name<CoinType>() == coin_type, EINVALID_COINTYPE);
        let amount = withdraw(account, make);
        if(!coin::is_account_registered<CoinType>(address_of(account))){
            coin::register<CoinType>(account);
        };
        let app_signer = &get_app_signer();
        coin::transfer<CoinType>(app_signer, address_of(account), amount)
    }

    entry fun borrow_with_fa(
        account: &signer,
        make: Object<object::ObjectCore>,
    ) acquires Offer, AppSigner, MetadataInfo {
        let make_addr = object::object_address(&make);
        assert!(exists<MetadataInfo>(make_addr), ENO_METADATA);
        let metadata = borrow_global<MetadataInfo>(make_addr).metadata;
        let (obj_signer, amount) = borrow(account, make);
        let pfs = primary_fungible_store::ensure_primary_store_exists(address_of(account), metadata);
        let app_signer = &get_app_signer();
        let fa = primary_fungible_store::withdraw(app_signer, metadata, amount);
        fungible_asset::deposit(pfs, fa);
        move_to(obj_signer, MetadataInfo {
            metadata,
        })
    }

    inline fun borrow(
        account: &signer,
        make: Object<object::ObjectCore>,
    ): (&signer, u64) acquires Offer {
        let make_addr = object::object_address(&make);
        assert!(exists<Offer>(make_addr), EOFFER_DOESNT_EXIST);
        assert!(!object::is_owner(make, address_of(account)), ESAME_OFFER_BORROW);
        let Offer {
            by_addr,
            token_id,
            amount,
            duration,
            apr,
            delete_ref,
        } = move_from<Offer>(make_addr);
        object::delete(delete_ref);
        let constructor_ref = &object::create_object(address_of(account));
        let obj_signer = &object::generate_signer(constructor_ref);
        move_to(obj_signer, Borrow {
            user_addr: address_of(account),
            from_addr: by_addr,
            token_id,
            amount,
            duration,
            apr,
            start_timestamp: timestamp::now_seconds(),
            extend_ref: object::generate_extend_ref(constructor_ref),
            delete_ref: object::generate_delete_ref(constructor_ref),
        });
        object::transfer(account, token_id, address_of(obj_signer));
        event::emit<BorrowEvent>(
            BorrowEvent {
                object: object::address_from_constructor_ref(constructor_ref),
            },
        );
        (obj_signer, amount)
    }

    entry fun borrow_with_coin<CoinType>(
        account: &signer,
        make: Object<object::ObjectCore>,
    ) acquires Offer, AppSigner, CoinTypeInfo {
        let make_addr = object::object_address(&make);
        assert!(exists<CoinTypeInfo>(make_addr), ENO_COINTYPE);
        let coin_type = borrow_global<CoinTypeInfo>(make_addr).coin_type;
        assert!(coin_struct_name<CoinType>() == coin_type, EINVALID_COINTYPE);
        let (obj_signer, amount) = borrow(account, make);
        if(!coin::is_account_registered<CoinType>(address_of(account))){
            coin::register<CoinType>(account);
        };
        let app_signer = &get_app_signer();
        coin::transfer<CoinType>(app_signer, address_of(account), amount);
        move_to(obj_signer, CoinTypeInfo {
            coin_type,
        });
    }
    
    entry fun repay_with_fa(
        account: &signer,
        borrow: Object<object::ObjectCore>,
    ) acquires Borrow, MetadataInfo {
        let borrow_addr = object::object_address(&borrow);
        assert!(exists<MetadataInfo>(borrow_addr), ENO_METADATA);
        let metadata = borrow_global<MetadataInfo>(borrow_addr).metadata;
        let (amount, to) = repay(account, borrow);
        let pfs = primary_fungible_store::ensure_primary_store_exists(to, metadata);
        let fa = primary_fungible_store::withdraw(account, metadata, amount);
        fungible_asset::deposit(pfs, fa);
    }

    inline fun repay(
        account: &signer,
        borrow: Object<object::ObjectCore>,
    ): (u64, address) acquires Borrow {
        let borrow_addr = object::object_address(&borrow);
        assert!(exists<Borrow>(borrow_addr), EBORROW_DOESNT_EXIST);
        assert!(object::is_owner(borrow, address_of(account)), ENOT_BORROW_OWNER);
        let Borrow {
            user_addr,
            from_addr,
            token_id,
            amount,
            duration,
            apr,
            start_timestamp,
            extend_ref,
            delete_ref,
        } = move_from<Borrow>(borrow_addr);
        // loan/borrow time has not ended
        let borrow_end_timestamp = add_days_to_a_timestamp(duration, start_timestamp);
        let current_timestamp = timestamp::now_seconds();
        assert!(borrow_end_timestamp >= current_timestamp, EREPAY_TIME_HAS_EXCEED);
        // Return loan amount to giver
        let repay_amount = amount_with_intrest(amount, apr, duration);
        // Get token into wallet again
        let obj_signer = &object::generate_signer_for_extending(&extend_ref);
        object::transfer(obj_signer, token_id, user_addr);
        // clear object
        object::delete(delete_ref);
        (repay_amount, from_addr)
    }

    entry fun repay_with_coin<CoinType>(
        account: &signer,
        borrow: Object<object::ObjectCore>,
    ) acquires Borrow, CoinTypeInfo {
        let borrow_addr = object::object_address(&borrow);
        assert!(exists<CoinTypeInfo>(borrow_addr), ENO_COINTYPE);
        let coin_type = borrow_global<CoinTypeInfo>(borrow_addr).coin_type;
        assert!(coin_struct_name<CoinType>() == coin_type, EINVALID_COINTYPE);
        let (amount, to) = repay(account, borrow);
        aptos_account::transfer_coins<CoinType>(account, to, amount);
    }

    entry fun grab(
        account: &signer,
        borrow: Object<object::ObjectCore>,
    ) acquires Borrow {
        let borrow_addr = object::object_address(&borrow);
        assert!(exists<Borrow>(borrow_addr), EBORROW_DOESNT_EXIST);
        let Borrow {
            user_addr:_,
            from_addr,
            token_id,
            amount:_,
            duration,
            apr:_,
            start_timestamp,
            extend_ref,
            delete_ref,
        } = move_from<Borrow>(borrow_addr);
        // vault break is loan giver
        assert!(from_addr == address_of(account), EUNAUTHORIZED_ACTION);
        let borrow_end_timestamp = add_days_to_a_timestamp(duration, start_timestamp);
        let current_timestamp = timestamp::now_seconds();
        assert!(borrow_end_timestamp < current_timestamp, EREPAY_TIME_HAS_NOT_EXCEED);
        // transfer the collateral nft to giver
        let obj_signer = &object::generate_signer_for_extending(&extend_ref);
        object::transfer(obj_signer, token_id, from_addr);
        object::delete(delete_ref);
    }
    
    // // ==================== Helpers ====================
    fun add_days_to_a_timestamp(days: u64, timestamp_in_secs: u64): u64 {
        let one_day_in_secs = 86400; 
        let additional_secs = days * one_day_in_secs;
        timestamp_in_secs + additional_secs
    }
    fun amount_with_intrest(amount: u64, apr: u64, days: u64): u64 {
        let percent_interest = (apr / 365) * days;
        let percent_amount = (amount * percent_interest) / APR_DENOMINATOR;
        (percent_amount / 100) + amount
    }
}