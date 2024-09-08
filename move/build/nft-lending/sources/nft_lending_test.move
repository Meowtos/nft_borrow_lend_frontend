module nft_lending::nft_lending_test {

    #[test_only]
    use nft_lending::nft_test;

    #[test(account=@0xCAFE)]
    fun test_lend_nft(account: &signer){
        nft_test::mint_multiple_test(account);
    }
}