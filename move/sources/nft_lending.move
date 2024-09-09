module nft_lending::nft_lending {
    use std::signer::address_of;
    use aptos_framework::object::{Self, Object};
    use aptos_framework::fungible_asset::{Self, Metadata, FungibleStore};
    use aptos_framework::primary_fungible_store;
    use aptos_framework::timestamp;

    use nft_lending::nft_lending_events;
    // Loan given by the user
    #[resource_group_member(group=aptos_framework::object::ObjectGroup)]
    struct Loan has key {
        // loan giver address
        giver_addr: address,
        // Token id of the nft loan being given for (for validation)
        token_id: Object<object::ObjectCore>,
        // FA Metadata
        fa_metadata: Object<Metadata>,
        // FA store
        fa_store: Object<FungibleStore>,
        // Amount
        amount: u64,
        // loan duration (in days)
        duration: u64,
        // apr
        apr: u64,
        // extend_ref
        extend_ref: object::ExtendRef,
        // delete ref
        delete_ref: object::DeleteRef,
    }   
    #[resource_group_member(group=aptos_framework::object::ObjectGroup)]
    struct Borrow has key {
        // loan borrower address
        borrower_addr: address,
        // loan giver address
        giver_addr: address,
        // Token id of the nft loan borrowed with
        token_id: Object<object::ObjectCore>,
        // FA Metadata
        fa_metadata: Object<Metadata>,
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
    // Errors
    const ELOAN_DURATION_LIMIT_EXCEED: u64 = 0;
    const EINSUFFICIENT_BALANCE: u64 = 1;
    const ELOAN_DOESNT_EXIST: u64 = 2;
    const ECANNOT_BORROW_OWN_LOAN: u64 = 3;
    const EBORROW_DOESNT_EXIST: u64 = 4;
    const ENOT_BORROW_OWNER: u64 = 5;
    const EREPAY_TIME_HAS_EXCEED: u64 = 6;
    const EUNAUTHORIZED_ACTION: u64 = 7;
    const EREPAY_TIME_HAS_NOT_EXCEED: u64 = 8;

    // constants
    const APR_DENOMINATOR: u64 = 10000;
    // Give loan on an token
    public(friend) entry fun give_loan(
        giver: &signer,
        token_id: Object<object::ObjectCore>,
        fa_metadata: Object<Metadata>,
        amount: u64,
        duration: u64,
        apr: u64,
    ) {
        // argument validation checks
        assert!(duration > 0 && duration < 365, ELOAN_DURATION_LIMIT_EXCEED);
        let constructor_ref = &object::create_object(address_of(giver));
         // withdraw assets
        let fa = primary_fungible_store::withdraw(giver, fa_metadata, amount);
        let fa_store = fungible_asset::create_store<Metadata>(constructor_ref, fa_metadata); 
        fungible_asset::deposit(fa_store, fa);
        // object signer
        let obj_signer = &object::generate_signer(constructor_ref);
        move_to(obj_signer, Loan {
            giver_addr: address_of(giver),
            token_id,
            fa_metadata,
            fa_store,
            amount,
            duration,
            apr,
            extend_ref: object::generate_extend_ref(constructor_ref),
            delete_ref: object::generate_delete_ref(constructor_ref),
        });
        nft_lending_events::new_loan_event(
            address_of(giver),
            object::object_address(&token_id),
            object::object_address(&fa_metadata),
            amount,
            duration,
            apr,
            object::address_from_constructor_ref(constructor_ref),
        );
    }
    // withdraw loan / cancel loan
    public(friend) entry fun withdraw_loan(
        giver: &signer,
        loan: Object<object::ObjectCore>,
    ) acquires Loan {
        let loan_addr = object::object_address(&loan);
        assert!(exists<Loan>(loan_addr), ELOAN_DOESNT_EXIST);
        assert!(object::is_owner(loan, address_of(giver)), EUNAUTHORIZED_ACTION);
        let Loan {
            giver_addr,
            token_id: _,
            fa_metadata,
            fa_store,
            amount,
            duration: _,
            apr: _,
            extend_ref,
            delete_ref,
        } = move_from<Loan>(loan_addr);
        // transfer the fa collateral back to loan giver
        let obj_signer = object::generate_signer_for_extending(&extend_ref);
        let fa = fungible_asset::withdraw<FungibleStore>(&obj_signer, fa_store, amount);
        let giver_store = primary_fungible_store::ensure_primary_store_exists<Metadata>(giver_addr, fa_metadata);
        fungible_asset::deposit(giver_store, fa);
        object::delete(delete_ref);
        nft_lending_events::new_loan_withdraw_event(
            loan_addr,
        );
    }   
    // Borrow loan while keeping token as collateral
    public(friend) entry fun borrow(
        borrower: &signer,
        loan: Object<object::ObjectCore>,
    ) acquires Loan {
        let loan_addr = object::object_address(&loan);
        assert!(exists<Loan>(loan_addr), ELOAN_DOESNT_EXIST);
        // check borrower address is not equal to loan giver
        assert!(!object::is_owner(loan, address_of(borrower)), ECANNOT_BORROW_OWN_LOAN);
        let Loan {
            giver_addr,
            token_id,
            fa_metadata,
            fa_store,
            amount,
            duration,
            apr,
            extend_ref,
            delete_ref,
        } = move_from<Loan>(loan_addr);
        // Transfer the asset to borrower
        let loan_signer = object::generate_signer_for_extending(&extend_ref);
        let fa = fungible_asset::withdraw<FungibleStore>(&loan_signer, fa_store, amount);
        let borrower_store = primary_fungible_store::ensure_primary_store_exists<Metadata>(address_of(borrower), fa_metadata);
        fungible_asset::deposit(borrower_store, fa);
        object::delete(delete_ref);
        // create a new borrow
        let constructor_ref = &object::create_object(address_of(borrower));
        let obj_signer = &object::generate_signer(constructor_ref);
        move_to(obj_signer, Borrow {
            borrower_addr: address_of(borrower),
            giver_addr,
            token_id,
            fa_metadata,
            amount,
            duration,
            apr,
            start_timestamp: timestamp::now_seconds(),
            extend_ref: object::generate_extend_ref(constructor_ref),
            delete_ref: object::generate_delete_ref(constructor_ref),
        });
        object::transfer(borrower, token_id, address_of(obj_signer));
        nft_lending_events::new_borrow_event(
            address_of(borrower),
            giver_addr,
            loan_addr,
            object::address_from_constructor_ref(constructor_ref),
        );
    }
    // repay the loan and get nft, user can repay the loan anytime
    public(friend) entry fun repay(
        user: &signer,
        borrow: Object<object::ObjectCore>,
    ) acquires Borrow {
        let borrow_addr = object::object_address(&borrow);
        assert!(exists<Borrow>(borrow_addr), EBORROW_DOESNT_EXIST);
        assert!(object::is_owner(borrow, address_of(user)), ENOT_BORROW_OWNER);
        let Borrow {
            borrower_addr,
            giver_addr,
            token_id,
            fa_metadata,
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
        let fa = primary_fungible_store::withdraw(user, fa_metadata, repay_amount);
        primary_fungible_store::deposit(giver_addr, fa);
        // Get token into wallet again
        let obj_signer = &object::generate_signer_for_extending(&extend_ref);
        object::transfer(obj_signer, token_id, borrower_addr);
        // clear object
        object::delete(delete_ref);
        nft_lending_events::new_repay_event(
            borrow_addr,
        );
    }

    public(friend) entry fun break_vault(
        user: &signer,
        borrow: Object<object::ObjectCore>,
    ) acquires Borrow {
        let borrow_addr = object::object_address(&borrow);
        assert!(exists<Borrow>(borrow_addr), EBORROW_DOESNT_EXIST);
        let Borrow {
            borrower_addr:_,
            giver_addr,
            token_id,
            fa_metadata:_,
            amount:_,
            duration,
            apr:_,
            start_timestamp,
            extend_ref,
            delete_ref,
        } = move_from<Borrow>(borrow_addr);
        // vault break is loan giver
        assert!(giver_addr == address_of(user), EUNAUTHORIZED_ACTION);
        let borrow_end_timestamp = add_days_to_a_timestamp(duration, start_timestamp);
        let current_timestamp = timestamp::now_seconds();
        assert!(borrow_end_timestamp < current_timestamp, EREPAY_TIME_HAS_NOT_EXCEED);
        // transfer the collateral nft to giver
        let obj_signer = &object::generate_signer_for_extending(&extend_ref);
        object::transfer(obj_signer, token_id, giver_addr);
        object::delete(delete_ref);
        nft_lending_events::new_break_vault_event(
            borrow_addr,
        );
    }
    // ==================== Helpers ====================
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