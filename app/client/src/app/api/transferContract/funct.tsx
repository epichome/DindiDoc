import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
import { Dindidoc } from "../types/dindidoc";
import {
  connection,
  commitmentLevel,
  helloWorldprogramId,
  helloWorldprogramInterface,
} from "../utils/constants";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

export default async function TransferContract(
    newOwnerPublicKey: string,
    newOwnerName: string,
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
      const newPublicKey = new PublicKey(
        newOwnerPublicKey
      );
      const txn = await program.methods
        .transferContract(newPublicKey, newOwnerName)
        .accounts({
          contract: contractAccount,
          authority: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        //.signers([contractAccount])
        .rpc()
  
      const message = await program.account.contract.fetch(
        contractAccount
      );
      console.log("contractAccount Data: ", message);
      return message;
    } catch (err) {
      console.log("Transaction error: ", err);
      return;
    }
  }