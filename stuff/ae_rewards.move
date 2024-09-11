module admin::ae_rewards {
    use std::vector;
    use std::signer;

    use aptos_std::smart_table::{Self, SmartTable};
    use aptos_std::option::{Self, Option};
    use aptos_std::debug;
    use aptos_std::type_info;
    use aptos_std::string::{String, utf8};

    use aptos_framework::randomness;
    use aptos_framework::event;
    use aptos_framework::primary_fungible_store;
    use aptos_framework::object::{Self, Object};
    use aptos_framework::fungible_asset::{Self, FungibleAsset, Metadata, FungibleStore};
    use aptos_framework::dispatchable_fungible_asset;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::aptos_account;
    use aptos_framework::aptos_coin::AptosCoin;

    /// Uauthorized access, caller is not admin
    const EUNAUTHORIZED: u64 = 1;
    /// Arculus ID is not whitelisted
    const ENOT_WHITELISTED: u64 = 2;
    /// Invalid ID, ID does not exist in whitelist
    const EINVALID_ADDRESS: u64 = 3;
    /// Address already exists in whitelist
    const EADDRESS_EXISTS: u64 = 4;
    /// No deposit found for the given project 
    const ENO_DEPOSIT: u64 = 5;
    /// Contract is paused
    const EPAUSED: u64 = 6;
    /// Address has already claimed the reward
    const EALREADY_CLAIMED: u64 = 7;
    /// Wrong project inputted
    const EINVALID_PROJECT: u64 = 8;
    /// Coin pool not registered for the given project
    const ECOIN_POOL_NOT_REGISTERED: u64 = 9;
    /// Coin pool already registered for the given project
    const ECOIN_POOL_REGISTERED: u64 = 10;

    const SCALE_FACTOR: u64 = 100_000_000; 
    const BUCKETS: vector<u64> = vector[
        100_000_000,   // 1.00 APT
        1_100_000_000, // 11.00 APT
        2_100_000_000, // 21.00 APT
        3_100_000_000, // 31.00 APT
        4_100_000_000, // 41.00 APT
        5_100_000_000, // 51.00 APT
        6_100_000_000, // 61.00 APT
        7_100_000_000, // 71.00 APT
        8_100_000_000, // 81.00 APT
        9_100_000_000  // 91.00 APT
    ];
    const CUMULATIVE_WEIGHTS: vector<u64> = vector[550, 900, 930, 950, 965, 975, 980, 982, 983, 984]; 

    #[event]
    struct FAAirdrop has drop, store {
        gguid: address,
        target_address: address,
        project: String,
        amount: u64,
        asset: Option<Object<Metadata>>
    }

    #[event]
    struct CoinAirdrop has drop, store {
        gguid: address,
        target_address: address,
        project: String,
        amount: u64,
        asset: vector<u8>
    }

    #[event]
    struct FAProjectRewardsStored has drop, store {
        project: String,
        asset: address,
        pfs: address,
        amount: u64
    }

    #[event]
    struct CoinProjectRewardsStored has drop, store {
        project: String,
        asset: vector<u8>,
        amount: u64
    }

    #[event]
    struct Pause has drop, store {
        pauser: address,
        paused: bool
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct State has key { 
        admins: vector<address>,
        whitelist: vector<address>,
        paused: bool,
        random_amount: u64,
    }

    struct AptosClaimed has key {
        aptos_claimed: vector<address>
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct FARewards has key {
        rewards: SmartTable<String, FALockBox>,
    }

    struct SpecialWhitelist has key {
        special: vector<address>
    }

    struct CoinRewardPool<phantom CoinType> has key {
        project: String,
        coins: Coin<CoinType>,
        distribution_amount: u64,
        claimed: vector<address>
    }

    struct FALockBox has copy, drop, store {
        pool: Object<FungibleStore>,
        distribution_amount: u64,
        claimed: vector<address>
    }

    #[view]
    public fun whitelist(): vector<address> acquires State {
        let state = borrow_global<State>(@admin);
        state.whitelist
    }

    #[view]
    public fun coin_pool_balance<CoinType>(): u64 acquires CoinRewardPool {
        let coin_pool = borrow_global<CoinRewardPool<CoinType>>(@admin);
        let coins = &coin_pool.coins;
        coin::value<CoinType>(coins)
    }

    #[view]
    public fun fa_pool_balance(project: String): u64 acquires FARewards {
        let lock_box = lock_box(project);
        let pfs = lock_box.pool;
        fungible_asset::balance(pfs)
    }

    /// Move resource group into code object on package deployment
    /// The code object is the storage location for the package/module
    /// Create a rewards pool primary store for APT, owned by the code object and admin (indirectly)
    /// admin (owns) -> code object (owns) -> rewards pool primary store 
    fun init_module(admin: &signer) { 
        move_to(admin, State { 
            admins: vector[@admin],
            whitelist: vector::empty(), 
            paused: false,
            random_amount: 0,
        }); 
        move_to(admin, FARewards { rewards: smart_table::new() });
        move_to(admin, AptosClaimed { aptos_claimed: vector::empty() });
    }

    /******************************************************** ADMIN AND PAUSE CONFIG ********************************************************/
    /// Pause or unpause the contract. This checks that the caller is the admin.
    public entry fun set_pause(admin: &signer, paused: bool) acquires State {
        assert_admin(admin);
        let state = borrow_global_mut<State>(@admin);
        state.paused = paused;
        event::emit(Pause {
            pauser: signer::address_of(admin),
            paused,
        });
    }

    fun assert_not_paused() acquires State {
        let state = borrow_global<State>(@admin);
        assert!(!state.paused, EPAUSED);
    }

    public entry fun add_admin(admin: &signer, new_admin: address) acquires State {
        assert_admin(admin);
        let state = borrow_global_mut<State>(@admin);
        let contains = vector::contains(&state.admins, &new_admin);
        assert!(!contains, EADDRESS_EXISTS);
        vector::push_back(&mut state.admins, new_admin);
    }

    /******************************************************** ARCULUS WHITELIST CONFIG ********************************************************/
    /// Add multiple addresses to the whitelist, only admin can call
    public entry fun add_whitelist_bulk(admin: &signer, whitelist: vector<address>) acquires State { 
        assert_not_paused();
        assert_admin(admin);
        let state = borrow_global_mut<State>(@admin);
        for (i in 0..vector::length(&whitelist)) {
            let id = vector::borrow(&whitelist, i);
            let contains = vector::contains(&state.whitelist, id);
            assert!(!contains, EADDRESS_EXISTS);
            vector::push_back(&mut state.whitelist, *id);
        }
    }

    /// Add to whitelist, only admin can call
    public entry fun add_whitelist(admin: &signer, arculus_id: address) acquires State {
        assert_not_paused();
        assert_admin(admin);
        let state = borrow_global_mut<State>(@admin);
        let contains = vector::contains(&state.whitelist, &arculus_id);
        assert!(!contains, EADDRESS_EXISTS);
        vector::push_back(&mut state.whitelist, arculus_id);
    }

    /// Remove from whitelist, only admin can call 
    public entry fun remove_whitelist(admin: &signer, arculus_id: address) acquires State {
        assert_not_paused();
        assert_admin(admin);
        let state = borrow_global_mut<State>(@admin);
        let (exists, index) = vector::index_of(&state.whitelist, &arculus_id);
        assert!(exists, EINVALID_ADDRESS);
        vector::remove(&mut state.whitelist, index);
    }

    public entry fun add_special_whitelist(admin: &signer, special: vector<address>) acquires State, SpecialWhitelist {
        assert_not_paused();
        assert_admin(admin);
        if (exists<SpecialWhitelist>(@admin)) { 
            let whitelist = borrow_global_mut<SpecialWhitelist>(@admin);
            for (i in 0..vector::length(&special)) {
                let id = vector::borrow(&special, i);
                let contains = vector::contains(&whitelist.special, id);
                assert!(!contains, EADDRESS_EXISTS);
                vector::push_back(&mut whitelist.special, *id);
            }
        } else {
            move_to(admin, SpecialWhitelist { special });
        }
    }

    /******************************************************** COIN REWARD POOL REGISTRATION/DEPOSIT ********************************************************/
    /// Register a rewards pool for a specific coin type
    /// Only the contract admins can call this function
    /// Can only call once per coin type
    public entry fun register_coin_pool<CoinType>(
        admin: &signer, 
        project: String,
        distribution_amount: u64
    ) acquires State {
        assert_not_paused();
        assert_admin(admin);
        assert_coin_pool_not_registered<CoinType>();
        move_to(admin, CoinRewardPool<CoinType> { 
            project,
            coins: coin::zero<CoinType>(),
            distribution_amount,
            claimed: vector::empty()
        });
    }

    /// Deposit funds into the Coin rewards pool
    /// Can also be used to modify the distribution amount
    public entry fun deposit_coin_pool<CoinType>(
        admin: &signer, 
        project: String,
        amount: u64,
        distribution_amount: Option<u64>
    ) acquires CoinRewardPool, State {
        assert_not_paused();
        assert_admin(admin);
        assert_coin_pool_registered<CoinType>();

        let coin_pool = borrow_global_mut<CoinRewardPool<CoinType>>(@admin);
        assert_valid_project<CoinType>(project, coin_pool);

        if (option::is_some(&distribution_amount)) {
            coin_pool.distribution_amount = option::extract(&mut distribution_amount);
        };

        let coins = coin::withdraw<CoinType>(admin, amount);
        coin::merge(&mut coin_pool.coins, coins);

        event::emit(CoinProjectRewardsStored { 
            project, 
            asset: coin_struct_name<CoinType>(), 
            amount: coin_pool.distribution_amount 
        });
    }

    /// Withdraw funds from the Coin rewards pool
    public entry fun withdraw_coin_pool<CoinType>(
        admin: &signer, 
        project: String,
        amount: u64
    ) acquires CoinRewardPool, State {
        assert_not_paused();
        assert_admin(admin);
        assert_coin_pool_registered<CoinType>();

        let coin_pool = borrow_global_mut<CoinRewardPool<CoinType>>(@admin);
        assert_valid_project<CoinType>(project, coin_pool);

        let coins = coin::extract(&mut coin_pool.coins, amount);
        coin::deposit<CoinType>(signer::address_of(admin), coins);
    }

    /******************************************************** FA REWARD POOL REGISTRATION/DEPOSIT ********************************************************/
    /// Register a rewards pool for a specific fungible asset
    /// Also serves as deposit function to add more funds to the pool
    /// Can also be used to modify the distribution amount 
    public entry fun register_fa_pool(
        funds: &signer,
        project: String, 
        metadata: Object<Metadata>, 
        amount: u64,
        distribution_amount: u64
    ) acquires FARewards {
        let fa = primary_fungible_store::withdraw(funds, metadata, amount);
        register_pool_store(project, metadata, fa, distribution_amount);
    }

    /// Register and deposit a fungible asset into the rewards pool 
    fun register_pool_store(
        project: String,
        metadata: Object<Metadata>, 
        fa: FungibleAsset, 
        distribution_amount: u64,
    ) acquires FARewards {
        let ae_pfs = primary_fungible_store::ensure_primary_store_exists(@admin, metadata);
        primary_fungible_store::deposit(@admin, fa);
        
        let rewards_table = fa_rewards_mut();
        smart_table::upsert(&mut rewards_table.rewards, project, FALockBox { 
            pool: ae_pfs,
            distribution_amount,
            claimed: vector::empty()
        });

        event::emit(FAProjectRewardsStored { 
            project, 
            asset: object::object_address(&metadata), 
            pfs: object::object_address(&ae_pfs), 
            amount: distribution_amount 
        });
    }

    /******************************************************** REWARD DISTRIBUTION ********************************************************/
    #[randomness] 
    // #[lint::allow_unsafe_randomness]
    /// Airdrop fixed amount of CoinType OR random amount of AptosCoin to the given address
    /// If distribute is false, only emits an event
    entry fun airdrop_coin<CoinType>(
        _pos: &signer,
        admin: &signer, 
        gguid: address,
        target_address: address,
        project: String,
        distribute: bool
    ) acquires CoinRewardPool, State, AptosClaimed, SpecialWhitelist {
        assert_not_paused();
        assert_whitelisted(gguid);
        assert_admin(admin);

        let coin_pool = borrow_global_mut<CoinRewardPool<CoinType>>(@admin);
        assert_deposit_exists(coin_pool);
        assert_valid_project<CoinType>(project, coin_pool);        

        let claimed = &mut coin_pool.claimed;
        assert_not_claimed(*claimed, gguid);

        if (!distribute) {
            event::emit(CoinAirdrop { gguid, target_address, project, amount: 0, asset: coin_struct_name<CoinType>() });
            vector::push_back(claimed, gguid);
            return
        };

        let struct_name = coin_struct_name<CoinType>();
        let aptos_struct_name = coin_struct_name<AptosCoin>();

        // if its aptos project, check if already claimed, if not, add to claim
        if (project == utf8(b"aptos")) {
            let state = borrow_global_mut<AptosClaimed>(@admin);
            let aptos_claimed = &state.aptos_claimed;
            assert_not_claimed(*aptos_claimed, gguid);
            vector::push_back(&mut state.aptos_claimed, gguid);
        };

        if (struct_name == aptos_struct_name && distribute) {
            // If coin is AptosCoin, do a random APT airdrop
            random_amount();
            let random_amount = get_random_amount();
            let amount = random_amount * SCALE_FACTOR;
            let apt_coin = coin::extract(&mut coin_pool.coins, amount);
            aptos_account::deposit_coins<CoinType>(target_address, apt_coin);
            vector::push_back(claimed, gguid);
            event::emit(CoinAirdrop { gguid, target_address, project, amount, asset: struct_name });
        } else {
            let amount = coin_pool.distribution_amount;
            let coin_amount = coin::extract(&mut coin_pool.coins, amount);
            aptos_account::deposit_coins<CoinType>(target_address, coin_amount);
            vector::push_back(claimed, gguid);
            event::emit(CoinAirdrop { gguid, target_address, project, amount, asset: struct_name });
        }
    }

    /// Airdrop fixed amount of a Fungible Asset (Object<Metadata>) to the given address
    /// If distribute is false, only emits an event
    entry fun airdrop_fa(
        _pos: &signer,
        admin: &signer, 
        gguid: address,
        target_address: address,
        project: String,
        asset_option: Option<Object<Metadata>>,
    ) acquires FARewards, State, SpecialWhitelist {
        assert_not_paused();
        assert_whitelisted(gguid);
        assert_admin(admin);

        let rewards = &fa_rewards().rewards;
        assert!(smart_table::contains(rewards, project), ENO_DEPOSIT);

        let lock_box = lock_box(project);
        let claimed = &mut lock_box.claimed;
        assert_not_claimed(*claimed, gguid);

        if (option::is_none(&asset_option)) { 
            event::emit(FAAirdrop { gguid, target_address, project, amount: 0, asset: option::none() });
            vector::push_back(claimed, gguid);
            return
        };

        let asset = *option::borrow(&asset_option);
        let project_pfs = lock_box.pool;
        let amount = lock_box.distribution_amount;
        let fa = dispatchable_fungible_asset::withdraw(admin, project_pfs, amount); 
        primary_fungible_store::deposit(target_address, fa);

        vector::push_back(claimed, gguid);
        event::emit(FAAirdrop { gguid, target_address, project, amount, asset: option::some(asset) });
    }

    /******************************************************** RANDOMNESS ********************************************************/
    /// Randomly select an amount from the buckets
    fun random_amount() acquires State {
        let amount = randomness::u64_range(20, 31);
        set_random_amount(amount);
    }

    /// Randomly select a bucket index based on the weights
    fun bucket_index(): u64 {
        let random_weight = randomness::u64_range(0, 1000);
        for (i in 0..vector::length(&BUCKETS)) { 
            if (random_weight < *vector::borrow(&CUMULATIVE_WEIGHTS, i)) { return i }; 
        }; return 0
    }

    fun set_random_amount(amount: u64) acquires State { 
        let state = borrow_global_mut<State>(@admin); 
        state.random_amount = amount;
    }

    fun get_random_amount(): u64 acquires State { borrow_global<State>(@admin).random_amount }

    /******************************************************** INLINE FUNCTIONS ********************************************************/
    inline fun fa_rewards(): &FARewards acquires FARewards { borrow_global<FARewards>(@admin)}

    inline fun fa_rewards_mut(): &mut FARewards { borrow_global_mut<FARewards>(@admin) }

    inline fun coin_struct_name<CoinType>(): vector<u8> {
        let coin_type_info = type_info::type_of<CoinType>();
        type_info::struct_name(&coin_type_info)
    }
    
    inline fun assert_admin(admin: &signer) { 
        let state = borrow_global<State>(@admin);
        let admins = &state.admins;
        assert!(vector::contains(admins, &signer::address_of(admin)), EUNAUTHORIZED);
    }

    inline fun lock_box(project: String): &mut FALockBox acquires FARewards {
        let rewards_table_mut = &mut fa_rewards_mut().rewards;
        assert!(smart_table::contains(rewards_table_mut, project), ENO_DEPOSIT);
        smart_table::borrow_mut(rewards_table_mut, project)
    }

    inline fun assert_whitelisted(id: address) acquires State {
        let state = borrow_global<State>(@admin);
        assert!(vector::contains(&state.whitelist, &id), ENOT_WHITELISTED);
    }

    inline fun assert_not_claimed(claimed: vector<address>, gguid: address) acquires SpecialWhitelist {
        // Check special whitelist first to allow multiple claims
        let special = borrow_global<SpecialWhitelist>(@admin);
        let contains_1 = vector::contains(&special.special, &gguid);
        if (contains_1) { 
            assert!(true, EALREADY_CLAIMED);
        } else {
            // Check regular whitelist
            let contains = vector::contains(&claimed, &gguid);
            assert!(!contains, EALREADY_CLAIMED);
        }
    }

    inline fun assert_coin_pool_not_registered<CoinType>() {
        let registered = exists<CoinRewardPool<CoinType>>(@admin);
        assert!(!registered, ECOIN_POOL_REGISTERED);
    }

    inline fun assert_coin_pool_registered<CoinType>() {
        let registered = exists<CoinRewardPool<CoinType>>(@admin);
        assert!(registered, ECOIN_POOL_NOT_REGISTERED);
    }

    inline fun assert_valid_project<CoinType>(project: String, coin_pool: &CoinRewardPool<CoinType>) {
        let project_string = coin_pool.project;
        assert!(project == project_string, EINVALID_PROJECT);
    }

    inline fun assert_deposit_exists<CoinType>(coin_pool: &CoinRewardPool<CoinType>) {
        let coins = &coin_pool.coins;
        let amount = coin::value<CoinType>(coins);
        assert!(amount > 0, ENO_DEPOSIT);
    }

    #[test_only]
    public fun init_for_test(admin: &signer) acquires State, SpecialWhitelist { 
        init_module(admin); 
        add_whitelist_bulk(admin, vector[@0xA1, @0xA2, @0xA3]);
        add_special_whitelist(admin, vector[@0xA1]);
    }

    #[test_only]
    public fun lock_box_fields_for_test(
        project: String, 
    ): (Object<FungibleStore>, u64, vector<address>) acquires FARewards {
        let lock_box = lock_box(project);
        (lock_box.pool, lock_box.distribution_amount, lock_box.claimed)
    }

    #[test_only]
    public fun coin_pool_fields_for_test<CoinType>(): (String, u64, vector<address>) acquires CoinRewardPool {
        let coin_pool = borrow_global<CoinRewardPool<CoinType>>(@admin);
        (coin_pool.project, coin_pool.distribution_amount, coin_pool.claimed)
    }

    #[test_only]
    public fun special_whitelist(): vector<address> acquires SpecialWhitelist {
        let whitelist = borrow_global<SpecialWhitelist>(@admin);
        whitelist.special
    }
}