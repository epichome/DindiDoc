use anchor_lang::prelude::*;
use anchor_lang::error_code;

declare_id!("HNhKbNom5uxSh87XJ6FwKDwP1CapZDhmRJLnmw4Ad52P");

#[program]
pub mod dindidoc {
    use super::*;

    pub fn create_contract(ctx: Context<CreateContract>, terms: String, owners_name: String) -> Result<()> {
        let contract: &mut Account<Contract> = &mut ctx.accounts.contract;
        let authority: &Signer = &ctx.accounts.authority;
        let clock: Clock = Clock::get().unwrap();

        contract.authority = *authority.key;
        contract.chain_of_ownership = owners_name;
        contract.terms = terms;
        contract.timestamp = clock.unix_timestamp;

        Ok(())
    }

    pub fn transfer_contract(ctx: Context<TransferContract>, new_owner: Pubkey, new_owner_name: String) -> Result<()> {
        let contract: &mut Account<Contract> = &mut ctx.accounts.contract;
        let authority: Pubkey = ctx.accounts.authority.key();
        let clock: Clock = Clock::get().unwrap();

        if contract.authority == authority{
            contract.timestamp = clock.unix_timestamp;
            contract.authority = new_owner;
            let new_chain_of_ownership = contract.chain_of_ownership.clone() + " " + &new_owner_name ;
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
            let new_notes = contract.notes.clone() + " " + &new_note ;
            contract.notes = new_notes
            
        }else {
            ContractError::MissingAuthority;
        }
        Ok(())
    }


}

#[derive(Accounts)]
pub struct CreateContract<'info> {
    #[account(init, payer = authority, space = 1000)]
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
pub struct AddNote<'info> {
    #[account(mut)]
    pub contract: Account<'info, Contract>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
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
}

#[error_code]
pub enum ContractError {
    MissingAuthority,
}