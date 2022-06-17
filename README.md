# Mint NFT on Solana chain with Rust

On-chain Program that mints NFT, explained in https://betterprogramming.pub/how-to-mint-nfts-on-solana-using-rust-and-metaplex-f66bac717cb8.

## Setup

Place your solana wallet at project root, and rename it to `wallet.json`.

And install anchor framework

```shell
cargo install --git https://github.com/project-serum/anchor --tag v0.24.2 anchor-cli --locked
```

## Build

```shell
anchor build
```

This command build Program and generate its account keypair at target/deploy/mint_nft-keypair.json
To check account information, run `solana account target/deploy/mint_nft-keypair.json`

```shell-session
❯ solana account target/deploy/mint_nft-keypair.json

Public Key: C7bN6Pvo1RKV2Dymq41hAzA1cDoKb2B63sUSSk6aTf2a
...
```

## Deploy

Before deploy, change program_id of this program.

- `Anchor.toml`

```toml
[programs.devnet]
mint_nft = "C7bN6Pvo1RKV2Dymq41hAzA1cDoKb2B63sUSSk6aTf2a"
```

- `programs/mint-nft/src/libs.rs`

```rust
declare_id!("C7bN6Pvo1RKV2Dymq41hAzA1cDoKb2B63sUSSk6aTf2a");
```

Then deploy program.

```shell
anchor deploy
```

## Test

`anchor test` kicks client script `tests/mint-nft.ts`.
This script invokes mint Program with `@solana/web3.js`, and checks program should work or not.

Expected output:

```
NFT Account:  9UDCtpKFizuMb9Q9RXM8xPCc3FD9NN1D6NtJVCQ2YXWJ
{
  context: { apiVersion: '1.10.25', slot: 141824223 },
  value: {
    data: { parsed: [Object], program: 'spl-token', space: 82 },
    executable: false,
    lamports: 1461600,
    owner: PublicKey {
      _bn: <BN: 6ddf6e1d765a193d9cbe146ceeb79ac1cb485ed5f5b37913a8cf5857eff00a9>
    },
    rentEpoch: 328
  }
}
Transaction ID (create mint account & assosiated token account): 2eEYzH4sT6v4qqtNjWt2Hx6k2dEsRSz8XbgDhi5GAW8SG3yD6WTuk9gdLrTcqtRum11PmcsQjhHx4ZbP9GpXw97M
Mint account key: oZ7QHwyFh9AsMmhZtXBWLQRzwPQQHvgAe99AHww9ssY
User wallet key:  GPmURHWfbg78GkGwTVnGn7Aupp3wFhDVEVC5KV8a54cJ
Metadata address: 3QfxcvaArwpensgYgk2HAfwEiG3hDpnR184EvYBpEWf6
MasterEdition: GP7r9VebhwmuVxBKaG7y38L7kBuBHHySj4pFRt8h4MKi
Your transaction signature diUxuKMvBBunNH35uVA3ViAckxCrnxaLJyp3A556wt1vXiJqBTxrsGzpJzzAvEPdtMmNdnjjFZBPrKcWFvAZnzR
```

When error pops with message `Provider env is not available on browser`, run `export BROWSER=` and retry.
