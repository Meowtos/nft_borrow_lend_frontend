<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/ajaythxkur/octos">
    <img src="media-kit/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Octos</h3>

  <p align="center">
    Turn your NFTs into collateral and access cryptocurrency loans with ease. No need to sell—just lend your NFTs and get the liquidity you need in minutes.
    <br />
    <br />
    <a href="https://octos-xyz.vercel.app">View Demo</a>
    ·
    <a href="https://github.com/ajaythxkur/octos/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/ajaythxkur/octos/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#architecture">Architecture</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Octos screenshot][product-screenshot]](https://octos-xyz.vercel.app)

Welcome to Octos, the future of decentralized finance where NFTs are more than just art—they are assets. Octos is a groundbreaking platform on the Aptos blockchain, enabling users to leverage their NFTs as collateral and access token-based loans.

Key Features:

- Borrowers can securely use their NFTs as collateral to unlock liquidity.
- Lenders can offer tokens, such as Aptos, to borrowers in exchange for interest, creating a win-win lending environment.
- Simple and efficient—borrowers get access to tokens, while lenders earn by providing liquidity.
- Stay connected through our real-time Discord updates, keeping you informed about loans, collateral, and community events.

Octos is here to redefine how you utilize NFTs. Join us today and experience decentralized NFT finance on Aptos!

<p align="right">(<a href="#readme-top">Back to top</a>)</p>

### Architecture

[![Architecture screenshot][architecture-screenshot]](https://octos-xyz.vercel.app)

### Built With

- [Aptos Move][Move-url]
- [Nextjs][Next-url]

<p align="right">(<a href="#readme-top">Back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Follow these steps to set up Octos locally on your machine:

### Prerequisites

Ensure you have the following installed:

- Node.js (version 16+)
- Aptos CLI for interacting with the Aptos blockchain
- Git for version control
- Discord Bot Token for Discord integration

## Installation

Follow these steps to compile, test, and deploy the contract on Aptos:

### 1. Compile the contract:

```bash
aptos move compile --dev
```

### 2. Run contract tests:

```bash
aptos move test
```

### 3. Deploy the contract:

Initialize the Aptos environment:

```bash
aptos init --network devnet
```

Set the publisher profile and address:

```bash
PUBLISHER_PROFILE=default
PUBLISHER_ADDR=0x$(aptos config show-profiles --profile=$PUBLISHER_PROFILE | grep 'account' | sed -n 's/.*"account": \"\(.*\)\".*/\1/p')
```

Publish the contract by creating an object and deploying the package:

```bash
aptos move create-object-and-publish-package \
   --address-name my_addrx \
   --named-addresses my_addrx=$PUBLISHER_ADDR \
   --profile $PUBLISHER_PROFILE \
   --assume-yes
```

### 4. Update the contract:

Set the contract object address:

```bash
CONTRACT_OBJECT_ADDR="your_contract_object_address_here"
```

Run the following command to upgrade the contract:

```bash
aptos move upgrade-object-package \
   --object-address $CONTRACT_OBJECT_ADDR \
   --named-addresses my_addrx=$CONTRACT_OBJECT_ADDR \
   --profile $PUBLISHER_PROFILE \
   --assume-yes
```

### 4. Start local development:

To run the project locally, follow these steps:

1. **Set up environment variables**: Ensure you have your `.env.local` file configured.
2. **Install dependencies and start the frontend**:

   ```bash
   cd frontend && npm install && npm run dev
   ```
---

Happy coding!

<p align="right">(<a href="#readme-top">Back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap 

### Q4 2024

- [x] Testnet Launch
- [x] Aptos keyless integration
- [ ] Indexer apis for platform
- [ ] Contract auditing
- [ ] Community Building & Partnerships
- [ ] Inner pages for better user experience
- [ ] Testnet snapshot
- [ ] Mainnet Launch
  - [ ] Seasonal Rewards
  - [ ] Liquidity pools for NFT loans

See the [open issues](https://github.com/ajaythxkur/octos/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">Back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/awesome-aptos`)
3. Commit your Changes (`git commit -m 'Add some awesome-aptos'`)
4. Push to the Branch (`git push origin feature/awesome-aptos`)
5. Open a Pull Request

### Top contributors:

<a href="https://github.com/ajaythxkur/octos/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ajaythxkur/octos" alt="contrib.rocks image" />
</a>

<p align="right">(<a href="#readme-top">Back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

We would like to express our gratitude to the following resources that have significantly contributed to our development journey:

- [Aptos Docs](https://aptos.dev)
- [Aptos Learn](https://learn.aptoslabs.com)

### Specially

- [Aptos dev discussions](https://github.com/aptos-labs/aptos-developer-discussions/discussions)

<p align="right">(<a href="#readme-top">Back to top</a>)</p>

[contributors-shield]: https://img.shields.io/github/contributors/ajaythxkur/wiz_protocol.svg?style=for-the-badge
[contributors-url]: https://github.com/ajaythxkur/octos/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ajaythxkur/octos.svg?style=for-the-badge
[forks-url]: https://github.com/ajaythxkur/octos/network/members
[stars-shield]: https://img.shields.io/github/stars/ajaythxkur/octos.svg?style=for-the-badge
[stars-url]: https://github.com/ajaythxkur/octos/stargazers
[issues-shield]: https://img.shields.io/github/issues/ajaythxkur/octos.svg?style=for-the-badge
[issues-url]: https://github.com/ajaythxkur/octos/issues
[github-url]: https://github.com/ajaythxkur/octos
[product-screenshot]: media-kit/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[Move]: media-kit/move.png?style=for-the-badge
[Move-url]: https://aptos.dev/en/build/smart-contracts
[architecture-screenshot]: media-kit/architecture.jpeg