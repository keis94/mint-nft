import * as anchor from "@project-serum/anchor";
import { Program, Wallet } from "@project-serum/anchor";
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  getAssociatedTokenAddress,
  MINT_SIZE,
  TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import { MintNft } from "../target/types/mint_nft";
const { SystemProgram } = anchor.web3;

describe("mint-nft", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  const wallet = provider.wallet as Wallet;
  anchor.setProvider(provider);
  const program = anchor.workspace.MintNft as Program<MintNft>;

  it("mints new NFT", async () => {
    const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
      "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
    );
    const lamports: number =
      await program.provider.connection.getMinimumBalanceForRentExemption(
        MINT_SIZE
      );
    const getMetadata = async (
      mint: anchor.web3.PublicKey
    ): Promise<anchor.web3.PublicKey> => {
      return (
        await anchor.web3.PublicKey.findProgramAddress(
          [
            Buffer.from("metadata"),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            mint.toBuffer(),
          ],
          TOKEN_METADATA_PROGRAM_ID
        )
      )[0];
    };

    const getMasterEdition = async (
      mint: anchor.web3.PublicKey
    ): Promise<anchor.web3.PublicKey> => {
      return (
        await anchor.web3.PublicKey.findProgramAddress(
          [
            Buffer.from("metadata"),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            mint.toBuffer(),
            Buffer.from("edition"),
          ],
          TOKEN_METADATA_PROGRAM_ID
        )
      )[0];
    };

    const mintAccount: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    const associatedTokenAccount = await getAssociatedTokenAddress(
      mintAccount.publicKey,
      wallet.publicKey
    );
    console.log("NFT Account: ", associatedTokenAccount.toBase58());

    const mint_tx = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintAccount.publicKey,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
        lamports,
      }),
      createInitializeMintInstruction(
        mintAccount.publicKey,
        0,
        wallet.publicKey,
        wallet.publicKey
      ),
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        associatedTokenAccount,
        wallet.publicKey,
        mintAccount.publicKey
      )
    );

    const res = await program.provider.sendAndConfirm!(mint_tx, [mintAccount]);
    console.log(
      await program.provider.connection.getParsedAccountInfo(mintAccount.publicKey)
    );

    console.log(`Transaction ID (create mint account & assosiated token account): ${res}`);
    console.log(`Mint account key: ${mintAccount.publicKey.toString()}`);
    console.log(`User wallet key:  ${wallet.publicKey.toString()}`);

    const metadataAddress = await getMetadata(mintAccount.publicKey);
    const masterEdition = await getMasterEdition(mintAccount.publicKey);

    console.log(`Metadata address: ${metadataAddress.toBase58()}`);
    console.log(`MasterEdition: ${masterEdition.toBase58()}`);

    const tx = await program.methods
      .mintNft(
        mintAccount.publicKey,
        "https://arweave.net/y5e5DJsiwH0s_ayfMwYk-SnrZtVZzHLQDSTZ5dNRUHA",
        "Sample NFT"
      )
      .accounts({
        mintAuthority: wallet.publicKey,
        mint: mintAccount.publicKey,
        tokenAccount: associatedTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        metadata: metadataAddress,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        payer: wallet.publicKey,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        masterEdition: masterEdition,
      })
      .rpc();
    console.log("Your transaction signature", tx);
  });
});
