module nft_lending::nft_test{
    #[test_only]
    use nft_lending::nft;

    #[test_only]
    use std::vector;

    #[test_only]
    use std::string::{String, utf8};

    #[test_only]
    public fun setup(account: &signer){
        nft::initialize_collection(account);
    }   


    #[test(account=@0xCAFE)]
    public fun mint_test(account: &signer){
        setup(account);
        nft::mint(account, utf8(b"Token 1"), utf8(b"https://avatars.githubusercontent.com/u/62602303"));
    }

    #[test_only]
    public fun mint_multiple(account: &signer, v1: vector<String>, v2: vector<String>){
        setup(account);
        assert!(vector::length(&v1) == vector::length(&v2), 0);
        let i = 0;
        while(i < vector::length(&v1)){
            let token_name = *vector::borrow(&v1, i);
            let icon_uri = *vector::borrow(&v2, i);
            nft::mint(account, token_name, icon_uri);
            i = i + 1;
        }
    }

    #[test(account=@0xCAFE)]
    public fun mint_multiple_test(account: &signer){
        let v1 = vector[utf8(b"AptoMingos"),utf8(b"The Legends")];
        let v2 = vector[utf8(b"https://pbs.twimg.com/profile_images/1608213505227759621/sqqbCVLU_400x400.jpg"), utf8(b"https://pbs.twimg.com/profile_images/1783544053365157888/N8BVsRZo_400x400.jpg")];
        mint_multiple(account, v1, v2);
    }

}