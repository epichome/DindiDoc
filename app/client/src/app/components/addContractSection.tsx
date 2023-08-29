"use client"
import { useState, useEffect} from "react"

import { Keypair } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import useIsMounted from "../api/utils/useIsmounted";
import createContract from "../api/createContract/route";
import fetchContracts from '../api/fetchContracts/route';

import { useWallet } from '@solana/wallet-adapter-react';

import styles from '../styles/addcontract.module.scss'
import Link from 'next/link';

export default function addContractSection(){
    const [messageAccount, _] = useState(Keypair.generate());
    const [message, setMessage] = useState("");
    const [messageAuthor, setMessageAuthor] = useState("");
    const [messageTime, setMessageTime] = useState(0);
    const [inputtedMessage, setInputtedMessage] = useState("");

    const [accounts, setAccounts] = useState([]);

    const wallet = useAnchorWallet();
    const mounted = useIsMounted();

    return(
        <main className={styles.main}>
            <section id="searchbar" className={styles.searchbar}>
                <Link href="/dashboard" className={styles.searchbarInput}>
                    <p>Cancel</p>
                </Link>
                <div className={styles.WalletMultiButton}>{mounted }</div>
            </section>
            <div id="hello" className={styles.helloContainer}>
                <h1>Create New Contract</h1>
            </div>

            {wallet && (
                        <div >
                            <textarea
                            placeholder="Write Your Message!"
                            onChange={(e) => setInputtedMessage(e.target.value)}
                            value={inputtedMessage}
                            />
                            <button
                            disabled={!inputtedMessage}
                            onClick={async () => {
                                const contract = await createContract(
                                inputtedMessage,
                                inputtedMessage,
                                wallet,
                                messageAccount
                                );
                                if (contract) {
                                    setMessage(contract.terms.toString());
                                    setMessageAuthor(contract.chainOfOwnership.toString());
                                    setMessageTime(contract.timestamp.toNumber() * 1000);
                                    setInputtedMessage("");
                                    console.log(String(messageAccount.publicKey))
                                }
                            }}
                            >
                            Create a Message!
                            </button>
                        </div>
                    )}
                    
        </main>
    )
}

/*
                    {wallet && (
                        <div >
                            <input
                            placeholder="Your pubkey"
                            onChange={(e) => setInputtedMessage(e.target.value)}
                            value={inputtedMessage}
                            />
                            <button
                            disabled={!inputtedMessage}
                            onClick={async () => {
                                const contract = await fetchContracts(
                                inputtedMessage,
                                wallet
                                );
                                if (contract) {
                                    console.log(contract)
                                    setContentList(contract)
                                }
                            }}
                            >
                            fetch Contracts!
                            </button>
                        </div>
                    )}    
*/