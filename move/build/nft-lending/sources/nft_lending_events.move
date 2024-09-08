module nft_lending::nft_lending_events{
    use aptos_framework::event;
    
    friend nft_lending::nft_lending;

    #[event]
    struct ListingEvent has store, drop {
        // Object address of Token (NFT)
        token_id: address,
        // Object address of listing object
        obj_addr: address,
    }

    #[event]
    struct DelistingEvent has store, drop {
        // Object address of Token (NFT)
        token_id: address,
        // Object address of delisting object
        obj_addr: address,
    }

    #[event]
    struct GiveLoanEvent has store, drop {
        // Object address of listing object
        listing_obj_addr: address,
        // FA Metadata Address
        fa_metadata: address,
        // Amount 
        amount: u64,
        // Lock duration in days (in days)
        duration: u64,
        // APR
        apr: u64,
        // Object address of loan object
        obj_addr: address
    }

    #[event]
    struct WithdrawLoanEvent has store, drop {
        // Object address of refunding/removing/cancelling loan object
        obj_addr: address,
    }

    #[event]
    struct BorrowEvent has store, drop {
        // Object address of listing object
        listing_obj_addr: address,
        // Object address of loan object
        loan_obj_addr: address,
    }

    #[event]
    struct RepayEvent has store, drop {
        // Object address of listing object
        listing_obj_addr: address,
        // Object address of loan object
        loan_obj_addr: address,
    }

    #[event]
    struct BreakVaultEvent has store, drop {
        // Object address of listing object
        listing_obj_addr: address,
        // Object address of loan object
        loan_obj_addr: address,
    }

    public(friend) fun new_listing_event(token_id: address, obj_addr: address) {
        event::emit<ListingEvent>(
            ListingEvent {
                token_id,
                obj_addr,
            }
        );
    }

    public(friend) fun new_delisting_event(token_id: address, obj_addr: address){
        event::emit<DelistingEvent>(
            DelistingEvent {
                token_id,
                obj_addr,
            }
        );
    }

    public(friend) fun new_give_loan_event(
        listing_obj_addr: address,
        fa_metadata: address,
        amount: u64,
        duration: u64,
        apr: u64,
        obj_addr: address
    ) {
        event::emit<GiveLoanEvent>(
            GiveLoanEvent {
                listing_obj_addr,
                fa_metadata,
                amount,
                duration,
                apr,
                obj_addr,
            }
        );
    }

    public(friend) fun new_withdraw_loan_event(obj_addr: address) {
        event::emit<WithdrawLoanEvent>(
            WithdrawLoanEvent {
                obj_addr,
            }
        );
    }

    public(friend) fun new_borrow_event(listing_obj_addr: address, loan_obj_addr: address) {
        event::emit<BorrowEvent>(
            BorrowEvent {
                listing_obj_addr,
                loan_obj_addr,
            }
        );
    }

    public(friend) fun new_repay_event(listing_obj_addr: address, loan_obj_addr: address) {
        event::emit<RepayEvent>(
            RepayEvent {
                listing_obj_addr,
                loan_obj_addr,
            }
        );
    }

    public(friend) fun new_break_vault_event(listing_obj_addr: address, loan_obj_addr: address) {
        event::emit<BreakVaultEvent>(
            BreakVaultEvent {
                listing_obj_addr,
                loan_obj_addr,
            }
        );
    }
}