"use client"
import { useState, useEffect} from "react"
import DropDown from './dropdown'

import { Keypair } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import useIsMounted from "../api/utils/useIsmounted";
import createContract from "../api/createContract/route";
import fetchContracts from '../api/fetchContracts/route';

import { useWallet } from '@solana/wallet-adapter-react';

import styles from '../styles/addcontract.module.scss'
import Link from 'next/link';

import { useSearchParams, useRouter } from 'next/navigation'

import rsa from 'js-crypto-rsa';

//add contract: stor blå satisfying knapp jfr revolut 
//ren text, kryptrad, hashad
export default function addContractSection(){
    const [messageAccount, _] = useState(Keypair.generate());
    const [message, setMessage] = useState("");
    const [messageAuthor, setMessageAuthor] = useState("");
    const [messageTime, setMessageTime] = useState(0);
    const [inputtedTerms, setInputtedTerms] = useState("");
    const [inputtedOwner, setInputtedOwner] = useState("");

    const [accounts, setAccounts] = useState([]);

    const wallet = useAnchorWallet();
    const mounted = useIsMounted();

    const router = useRouter();

    const searchParams = useSearchParams()

    const publicJwk = {kty: 'RSA', n: '...', e: '...'}; // public key
    const privateJwk = {kty: 'RSA', n: '...', e: '...', p: '...', q: '...', dp: '...', dq: '...', qi: '...'}; // paired private key
    const msg = "";

    return(
        <main className={styles.main}>
            <section id="searchbar" className={styles.searchbar}>
                <Link href="/dashboard" className={styles.searchbarInput}>
                    <p>Cancel</p>
                </Link>
                <div>{wallet?.publicKey.toString()}</div>
            </section>
            <div id="hello" className={styles.helloContainer}>
                <h1>Create New Contract</h1>
            </div>
            <section id="my-contracts" className={styles.contentContainer}>
                {wallet && (
                    <div>
                        <div className={styles.contentContainerTopInfo}>
                            <div className={styles.contentContainerTopInfoDiv}>
                                <h1 className={styles.textSubHeader}>Type</h1>
                                <DropDown/>
                            </div>
                            <div className={styles.contentContainerTopInfoDiv}>
                                <h1 className={styles.textSubHeader}>Owners name</h1>
                                <input 
                                    type="text" 
                                    onChange={(e) => setInputtedOwner(e.target.value)}
                                    value={inputtedOwner}
                                />
                            </div>
                        </div>
                        <h1 className={styles.textSubHeader}>Terms</h1>
                        <textarea
                            placeholder="Write Your Message!"
                            className={styles.contentContainerTerms}
                            onChange={(e) => setInputtedTerms(e.target.value)}
                            value={inputtedTerms}
                        />
                        
                        <h1 className={styles.textSubHeader}>Create Contract</h1>
                        <div >
                            
                            <button
                            disabled={!inputtedOwner || !inputtedTerms}
                            onClick={async () => {
                                const contract = await createContract(
                                inputtedOwner,
                                inputtedTerms,
                                wallet,
                                messageAccount
                                );
                                if (contract) {
                                    setMessage(contract.terms.toString());
                                    setMessageAuthor(contract.chainOfOwnership.toString());
                                    setMessageTime(contract.timestamp.toNumber() * 1000);
                                    setInputtedTerms("");
                                    console.log(String(messageAccount.publicKey))
                                    router.push('/dashboard');
                                }
                            }}
                            >
                            Create a Message!
                            </button>
                        </div>
                    </div>
                )}   
            </section>
        </main>
    )
}