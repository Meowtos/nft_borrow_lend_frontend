export const queryFetchWalletItemsAptos = `query fetchWalletItems($address: String) {
  aptos {
    nfts(
      where: {
        owner: {
          _eq: $address
        }
      }
    ) {
      id
      token_id
      name
      media_url
      media_type
      ranking
      owner
      delegated_owner
      burned
      staked
    }
  }
}`;

export const queryFetchWalletItemsMovement = `query fetchWalletItems($address: String) {
    aptos {
      nfts(
        where: {
          owner: {
            _eq: $address
          }
        }
      ) {
        id
        token_id
        name
        media_url
        media_type
        ranking
        owner
        delegated_owner
        burned
        staked
      }
    }
  }`;