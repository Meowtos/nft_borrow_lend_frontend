module nft_lending::nft_lending_events {
    use aptos_framework::event;
    
    friend nft_lending::nft_lending;

    #[event]
    struct LoanEvent has drop, store {
        giver: address,
        token_id: address,
        fa_metadata: address,
        amount: u64,
        duration: u64,
        apr: u64,
        // Address of loan object created
        loan_object: address,
    }

    #[event]
    struct BorrowEvent has drop, store {
        borrower: address,
        giver: address,
        loan_object: address,
        borrow_object: address,
    }

    #[event]
    struct RepayEvent has drop, store {
        borrow_object: address,
    }

    #[event]
    struct BreakVaultEvent has drop, store {
        borrow_object: address,
    }

    #[event]
    struct WithdrawLoanEvent has drop, store {
        loan_object: address,
    }

    public(friend) fun new_loan_event(
        giver: address,
        token_id: address,
        fa_metadata: address,
        amount: u64,
        duration: u64,
        apr: u64,
        loan_object: address
    ) {
        event::emit<LoanEvent>(
            LoanEvent {
                giver,
                token_id,
                fa_metadata,
                amount,
                duration,
                apr,
                loan_object,
            }
        );
    }

    public(friend) fun new_borrow_event(
        borrower: address,
        giver: address,
        loan_object: address,
        borrow_object: address,
    ) {
        event::emit<BorrowEvent>(
            BorrowEvent {
                borrower,
                giver,
                loan_object,
                borrow_object,
            }
        );
    }

    public(friend) fun new_repay_event(
        borrow_object: address,
    ) {
        event::emit<RepayEvent>(
            RepayEvent {
                borrow_object,
            }
        );
    }

    public(friend) fun new_break_vault_event(
        borrow_object: address,
    ) {
        event::emit<BreakVaultEvent>(
            BreakVaultEvent {
                borrow_object,
            }
        );
    }

    public(friend) fun new_loan_withdraw_event(
        loan_object: address,
    ) {
        event::emit<WithdrawLoanEvent>(
            WithdrawLoanEvent {
                loan_object,
            }
        );
    }

}