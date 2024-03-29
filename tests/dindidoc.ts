import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Dindidoc } from "../target/types/dindidoc";

describe("dindidoc", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Dindidoc as Program<Dindidoc>;

  it("Create contract!", async () => {
    // Add your test here.
    const contractkey = anchor.web3.Keypair.generate();
    const ownersName = "ME"
    const terms = "This is the terms"
    const tx = await program.methods
      .createContract(terms, ownersName, 0)
      .accounts({
        contract: contractkey.publicKey,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([contractkey])
      .rpc();

    console.log("Your transaction signature", tx);

    const contractAccount = await program.account.contract.fetch(
      contractkey.publicKey
    );
    console.log(contractAccount.terms)
  });

  it("Add signature", async () => {
     //create contract
     console.log("Creating contract")
     const contractkey = anchor.web3.Keypair.generate();
     const ownersName = "ME"
     const terms = "This is the terms"
     const tx = await program.methods
       .createContract(terms, ownersName, 0)
       .accounts({
         contract: contractkey.publicKey, 
         authority: provider.wallet.publicKey, 
         systemProgram: anchor.web3.SystemProgram.programId,
       })
       .signers([contractkey])
       .rpc();
 
     const contractAccount = await program.account.contract.fetch(
      contractkey.publicKey
     );
     console.log(contractAccount.authority)
     console.log(contractAccount.terms)

    //update note
    console.log("Add signature 1")
    var signer = 0
    var proof = "https/test.com"
    await program.methods
      .signContract(signer, proof)
      .accounts({
        contract: contractkey.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc()

     //update note 1 again 
     console.log("Add signature 1")
     signer = 0
     proof = "https/test.com/false"
     await program.methods
       .signContract(signer, proof)
       .accounts({
         contract: contractkey.publicKey,
         systemProgram: anchor.web3.SystemProgram.programId,
       })
       .rpc()

    //update signer 2 
    console.log("Add signature 1")
    signer = 1
    proof = "https/test.com"
    await program.methods
      .signContract(signer, proof)
      .accounts({
        contract: contractkey.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc()

    //update signer 2 again 
    console.log("Add signature 1")
    signer = 1
    proof = "https/test.com/false"
    await program.methods
      .signContract(signer, proof)
      .accounts({
        contract: contractkey.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc()

    const contractAccountChange = await program.account.contract.fetch(
      contractkey.publicKey
    );

    console.log(contractAccountChange.signature1)
    console.log(contractAccountChange.signature2)
  });


  it("Transfer contract!", async () => {
    // Add your test here.
    //create contract
    console.log("Creating contract")
    const contractkey = anchor.web3.Keypair.generate();
    const ownersName = "ME"
    const terms = "This is the terms"
    const tx = await program.methods
      .createContract(terms, ownersName, 0)
      .accounts({
        contract: contractkey.publicKey,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([contractkey])
      .rpc();

    const contractAccount = await program.account.contract.fetch(
     contractkey.publicKey
    );
    console.log(contractAccount.authority)
    console.log(contractAccount.terms)

    //update owner
    console.log("")
    console.log("Updating owner")
    const newOwner = anchor.web3.Keypair.generate();
    const newOwnerName = "XA"
    await program.methods
      .transferContract(newOwner.publicKey, newOwnerName)
      .accounts({
        contract: contractkey.publicKey,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc()

    const contractAccountChange = await program.account.contract.fetch(
      contractkey.publicKey
    );

    console.log(contractAccountChange.authority)
    console.log(contractAccountChange.chainOfOwnership)

    //Update with wrong account
    console.log("")
    console.log("Updating owner with wrong auth")
    await program.methods
      .transferContract(newOwner.publicKey, newOwnerName)
      .accounts({
        contract: contractkey.publicKey,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc()

    const contractAccountChange2 = await program.account.contract.fetch(
      contractkey.publicKey
    );

    console.log(contractAccountChange2.authority)
    console.log(contractAccountChange2.chainOfOwnership)

    //Update program second time
    console.log("")
    console.log("Updating owner agin")
    const newOwner2 = anchor.web3.Keypair.generate();
    const newOwnerName2 = "NA"
    await program.methods
      .transferContract(newOwner2.publicKey, newOwnerName2)
      .accounts({
        contract: contractkey.publicKey, //pubkey till account som innehåller data
        authority: newOwner.publicKey, //pubkey till ägaren av programmet
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([newOwner]) //pubkey och secretkey till ägaren av programmet
      .rpc()
    
      const contractAccountChange3 = await program.account.contract.fetch(
        contractkey.publicKey
      );
  
      console.log(contractAccountChange3.authority)
      console.log(contractAccountChange3.chainOfOwnership)
  });

  it("Add note", async () => {
     //create contract
     console.log("Creating contract")
     const contractkey = anchor.web3.Keypair.generate();
     const ownersName = "ME"
     const terms = "This is the terms"
     const tx = await program.methods
       .createContract(terms, ownersName, 0)
       .accounts({
         contract: contractkey.publicKey, 
         authority: provider.wallet.publicKey, 
         systemProgram: anchor.web3.SystemProgram.programId,
       })
       .signers([contractkey])
       .rpc();
 
     const contractAccount = await program.account.contract.fetch(
      contractkey.publicKey
     );
     console.log(contractAccount.authority)
     console.log(contractAccount.terms)

    //update note
    console.log("")
    console.log("Add note")
    const note = "testNote"
    await program.methods
      .addNotes(note)
      .accounts({
        contract: contractkey.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc()

    const contractAccountChange = await program.account.contract.fetch(
      contractkey.publicKey
    );

    console.log(contractAccountChange.notes)
  });

  it("Close account", async () => {
    //create contract
    console.log("Creating contract")
    const contractkey = anchor.web3.Keypair.generate();
    const ownersName = "ME"
    const terms = "This is the terms"
    const tx = await program.methods
      .createContract(terms, ownersName, 0)
      .accounts({
        contract: contractkey.publicKey, 
        authority: provider.wallet.publicKey, 
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([contractkey])
      .rpc();

    const contractAccount = await program.account.contract.fetch(
     contractkey.publicKey
    );
    console.log(contractAccount.authority)
    console.log(contractAccount.terms)

    //Close account
    await program.methods
      .close()
      .accounts({
        contract: contractkey.publicKey,
        destination: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc()
 });

  it("Close account with wrong account", async () => {
    //create contract
    console.log("Creating contract")
    const contractkey = anchor.web3.Keypair.generate();
    const ownersName = "ME"
    const terms = "This is the terms"
    const falseSigner = anchor.web3.Keypair.generate();
    const tx = await program.methods
      .createContract(terms, ownersName, 0)
      .accounts({
        contract: contractkey.publicKey, 
        authority: falseSigner.publicKey, 
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([contractkey])
      .rpc();

    const contractAccount = await program.account.contract.fetch(
     contractkey.publicKey
    );
    console.log(contractAccount.authority)
    console.log(contractAccount.terms)

    //close with wrong signer 
    
    await program.methods
      .close()
      .accounts({
        contract: contractkey.publicKey,
        destination: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc()
  });
});
