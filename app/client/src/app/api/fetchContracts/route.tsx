import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
import { Dindidoc } from "../types/dindidoc";
import {
  connection,
  commitmentLevel,
  helloWorldprogramId,
  helloWorldprogramInterface,
} from "../utils/constants";
import { AnchorWallet } from "@solana/wallet-adapter-react";

export default async function fetchContracts(
    walletOfAuthority: string,
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
        var jsonString = [];
        const message = await program.account.contract.all();
        for (var i = 0; i < message.length; i++){
            if(message[i].account.authority.toString() == walletOfAuthority){
                jsonString.push({t: message[i].account.chainOfOwnership, body: message[i].account.terms, link: "http://127.0.0.1:3000/dashboard/newcontract", adress: message[i].publicKey.toString()});
            }
            
        }
        //console.log(jsonString)
        return jsonString;
    } catch (err) {
        console.log("Transaction error: ", err);
        return;
    }
  }