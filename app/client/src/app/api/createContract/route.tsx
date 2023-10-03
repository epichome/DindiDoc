import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
import { Dindidoc } from "../types/dindidoc";
import {
  connection,
  commitmentLevel,
  helloWorldprogramId,
  helloWorldprogramInterface,
} from "../utils/constants";
import { AnchorWallet } from "@solana/wallet-adapter-react";

export default async function createContract(
    ownersName: string,
    terms: string,
    inputType: number,
    wallet: AnchorWallet,
    contractAccount: web3.Keypair
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
      console.log(terms)
      /* interact with the program via rpc */
      const txn = await program.methods
        .createContract(terms, ownersName, inputType)
        .accounts({
          contract: contractAccount.publicKey,
          authority: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([contractAccount])
        .rpc()
  
      const message = await program.account.contract.fetch(
        contractAccount.publicKey
      );
      console.log("contractAccount Data: ", message);
      return message;
    } catch (err) {
      console.log("Transaction error: ", err);
      return;
    }
  }