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
        .close()
        .accounts({
            contract: contractAccount,
            destination: provider.wallet.publicKey,
            systemProgram: web3.SystemProgram.programId,
          })
        .rpc()
      return "200";
    } catch (err) {
        console.log("Transaction error: ", err);
      return;
    }
  }