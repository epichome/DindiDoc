import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
import { Dindidoc } from "../types/dindidoc";
import {
  connection,
  commitmentLevel,
  helloWorldprogramId,
  helloWorldprogramInterface,
} from "../utils/constants";
import { AnchorWallet } from "@solana/wallet-adapter-react";

export default async function FetchContractData(
    adress: string,
    wallet: AnchorWallet,
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
        const contract = await program.account.contract.fetch(
            adress
        );
        return contract;
    } catch (err) {
        console.log("Transaction error: ", err);
        return;
    }
  }