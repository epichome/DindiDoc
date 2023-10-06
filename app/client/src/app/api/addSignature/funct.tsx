import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
import { Dindidoc } from "../types/dindidoc";
import {
  connection,
  commitmentLevel,
  helloWorldprogramId,
  helloWorldprogramInterface,
} from "../utils/constants";
import { AnchorWallet } from "@solana/wallet-adapter-react";

export default async function AddSignature(
    proof: string,
    signer: number,
    wallet: AnchorWallet,
    contractAccount: string,
  ) {
    const provider = new AnchorProvider(connection, wallet, {
      preflightCommitment: commitmentLevel,
    });
  
    if (!provider) return;
  
    /* create the program interface combining the idl, program Id, and provider */
    const program = new Program(
      helloWorldprogramInterface,
      helloWorldprogramId,
      provider
    ) as Program<Dindidoc>;
  
    try {
      /* interact with the program via rpc */
      const txn = await program.methods
        .signContract(signer, proof)
        .accounts({
          contract: contractAccount,
          authority: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc()
  
      const message = await program.account.contract.fetch(
        contractAccount
      );
      return message;
    } catch (err) {
      console.log("Transaction error: ", err);
      return;
    }
  }