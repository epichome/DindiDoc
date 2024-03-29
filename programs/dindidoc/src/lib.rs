use anchor_lang::prelude::*;
use anchor_lang::error_code;

declare_id!("HNhKbNom5uxSh87XJ6FwKDwP1CapZDhmRJLnmw4Ad52P");

#[program]
pub mod dindidoc {
    use super::*;

    pub fn create_contract(ctx: Context<CreateContract>, terms: String, owners_name: String, storage_type: i32) -> Result<()> {
        let contract: &mut Account<Contract> = &mut ctx.accounts.contract;
        let authority: &Signer = &ctx.accounts.authority;
        let clock: Clock = Clock::get().unwrap();

        contract.authority = *authority.key;
        contract.chain_of_ownership = owners_name + "\n";
        contract.terms = terms;
        contract.timestamp = clock.unix_timestamp;
        contract.storage_type = storage_type;

        Ok(())
    }

    pub fn sign_contract(ctx: Context<SignContract>, signer: u8, proof: String) -> Result<()> {
        let contract: &mut Account<Contract> = &mut ctx.accounts.contract;
        let authority: Pubkey = ctx.accounts.authority.key();

        if contract.authority == authority{
            if signer == 0 && contract.signature1.is_empty(){
                contract.signature1 = proof
            } else if signer == 1 && contract.signature2.is_empty() {
                contract.signature2 = proof
            }
        }else {
            return Err(ContractError::MissingAuthority.into());
        }
        Ok(())
    }

    pub fn transfer_contract(ctx: Context<TransferContract>, new_owner: Pubkey, new_owner_name: String) -> Result<()> {
        let contract: &mut Account<Contract> = &mut ctx.accounts.contract;
        let authority: Pubkey = ctx.accounts.authority.key();
        let clock: Clock = Clock::get().unwrap();

        if contract.authority == authority{
            contract.timestamp = clock.unix_timestamp;
            contract.authority = new_owner;
            let new_chain_of_ownership = contract.chain_of_ownership.clone() + &new_owner_name.replace("\n", "") + "\n";
            contract.chain_of_ownership = new_chain_of_ownership;
            
        }else {
            ContractError::MissingAuthority;
        }
        Ok(())
    }

    pub fn add_notes(ctx: Context<AddNote>, new_note: String) -> Result<()> {
        let contract: &mut Account<Contract> = &mut ctx.accounts.contract;
        let authority: Pubkey = ctx.accounts.authority.key();

        if contract.authority == authority{
            let new_notes = contract.notes.clone() + &new_note.replace("\n", "") + "\n";
            contract.notes = new_notes
        }else {
            return Err(ContractError::MissingAuthority.into());
        }
        Ok(())
    }
    
    pub fn close(ctx: Context<Close>) -> Result<()> {
        let contract: &mut Account<Contract> = &mut ctx.accounts.contract;
        let authority: Pubkey = ctx.accounts.authority.key();

        if contract.authority != authority {
            return Err(ContractError::MissingAuthority.into());
        }
        Ok(())
    }

}

#[derive(Accounts)]
pub struct CreateContract<'info> {
    #[account(init, payer = authority, space = 2000)]
    pub contract: Account<'info, Contract>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferContract<'info> {
    #[account(mut)]
    pub contract: Account<'info, Contract>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SignContract<'info> {
    #[account(mut)]
    pub contract: Account<'info, Contract>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddNote<'info> {
    #[account(mut)]
    pub contract: Account<'info, Contract>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Close<'info> {
    #[account(mut, close = destination)]
    /// CHECK: No checks through types are necessary because the `destination` account
    /// is being closed, and all its data will be transferred to the account being closed into.
    contract: Account<'info, Contract>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
    /// CHECK: No checks through types are necessary as this account is being closed.
    destination: AccountInfo<'info>,
}

#[account]
pub struct Contract {
    pub authority: Pubkey,
    pub chain_of_ownership: String,
    pub terms: String,
    pub notes: String,
    pub signature1: String,
    pub signature2: String,
    pub timestamp: i64,
    pub storage_type: i32,
}

#[error_code]
pub enum ContractError {
    MissingAuthority,
}