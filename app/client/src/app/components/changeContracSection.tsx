"use client"
import { useState, useEffect} from "react"

import { Keypair } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import useIsMounted from "../api/utils/useIsmounted";

import styles from '../styles/changecontract.module.scss'
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useSearchParams } from 'next/navigation'
import fetchContractData from '../api/fetchContract/route';
import addNote from '../api/addNote/route'
import transferContract from '../api/transferContract/route'
import deleteContract from '../api/deleteContract/route'

import { set } from "@coral-xyz/anchor/dist/cjs/utils/features";
import { TRUE } from "sass";

async function getData (contractAddress: string, wallet: any){
    const contract = await fetchContractData(
        contractAddress,
        wallet,
    );
    return contract
}

export default function addContractSection(){
    const [messageAccount, _] = useState(Keypair.generate());
    const [terms, setTerms] = useState<string>();
    const [auth, setAuth] = useState<string>();
    const [note, setNote] = useState<string>();
    const [owner, setOwner] = useState<string>();
    const [signers, setSigners] = useState<string>();

    const [message, setMessage] = useState("");
    const [messageAuthor, setMessageAuthor] = useState("");
    const [messageTime, setMessageTime] = useState(0);
    const [inputtedMessage, setInputtedMessage] = useState("");

    const [transferTo, setTransferTo] = useState("");
    const [newOwner, setNewOwner] = useState("");

    const wallet = useAnchorWallet();
    const mounted = useIsMounted();

    const router = useRouter();

    const searchParams = useSearchParams()

    const contractAddress = searchParams.get('adress') || "";

    const j = getData(contractAddress, wallet).then(i => {
        var contract = i
        setTerms(contract?.terms)
        setAuth(contract?.authority.toString())
        setNote(contract?.notes)
        setOwner(contract?.chainOfOwnership)
        setSigners(contract?.signature1 + " " + contract?.signature2)
    });
    
    if(wallet){
        //addNote("test", wallet, contractAddress)
    }
    return(
        <main className={styles.main}>
            <section id="searchbar" className={styles.searchbar}>
                <Link href="/dashboard" className={styles.searchbarInput}>
                    <p>Back</p>
                </Link>
                <div>{wallet?.publicKey.toString()}</div>
            </section>
            <div id="hello" className={styles.helloContainer}>
                <h1>Edit Contract</h1>
            </div>
            <section className={styles.contentContainer}>
                <h1 className={styles.textHeader}>Contract Info</h1>
                <div className={styles.contentContainerTopInfo}>
                    <div className={styles.textContainer}>
                        <div className={styles.textLabel}>Adress:</div>
                        <div className={styles.textLine}>{searchParams.get('adress')}</div>
                    </div>
                    <div className={styles.textContainer}>
                        <div className={styles.textLabel}>Owner:</div>
                        <div className={styles.textLine}>{auth}</div>
                    </div>
                </div>
                <div className={styles.textContainer}>
                    <div className={styles.textLabel}>Terms: </div>
                    <div className={styles.textArea}>{terms}</div>
                </div>
                <div className={styles.contentContainerTopInfo}>
                    <div className={styles.textContainer}>
                        <div className={styles.textLabel}>Notes: </div>
                        <div className={styles.textSmallArea}>{note}</div>
                    </div>
                    <div className={styles.textContainer}>
                        <div className={styles.textLabel}>ChainOfOwners:</div>
                        <div className={styles.textSmallArea}>{owner}</div>
                    </div>
                </div>
                
                <div>Signers: {signers}</div>
                

            </section>
            <section className={styles.contentContainerInput}>
                <h1 className={styles.textHeader}>Sign Contract</h1>
            </section>
            <section className={styles.contentContainerN}>
                <div className={styles.inputSeparator}>
                    <h1 className={styles.textHeader}>Add Note</h1>
                    {wallet && (
                        <div className={styles.inputContainer}>
                            <textarea
                            placeholder="Write Your Message!"
                            onChange={(e) => setInputtedMessage(e.target.value)}
                            value={inputtedMessage}
                            className={styles.inputTextSmallArea}
                            />
                            <button
                            disabled={!inputtedMessage}
                            className={!inputtedMessage ? styles.inputBtnInactive : styles.inputBtnActive}
                            onClick={async () => {
                                const contract = await addNote(inputtedMessage, wallet, contractAddress)
                                if (contract) {
                                    window.location.reload()
                                }
                            }}
                            >
                            Add Note!
                            </button>
                        </div>
                    )}   
                </div>
                <div>
                <h1 className={styles.textHeader}>Transfer Contract</h1>
                    {wallet && (
                        <div className={styles.inputContainer}>
                            <textarea
                            placeholder="Pubkey to the new owner"
                            onChange={(e) => setTransferTo(e.target.value)}
                            value={transferTo}
                            className={styles.inputText}
                            />
                            <input 
                            placeholder="Name of the new owner" 
                            onChange={(e) => setNewOwner(e.target.value)}
                            value={newOwner}
                            className={styles.inputText}
                            />
                            
                            <button
                            disabled={!transferTo || !newOwner}
                            className={!transferTo || !newOwner ? styles.inputBtnInactive : styles.inputBtnActive}
                            onClick={async () => {
                                const contract = await transferContract(transferTo, newOwner, wallet, contractAddress)
                                if (contract) {
                                    window.location.reload()
                                }
                            }}
                            >
                            Transfer contract!
                            </button>
                        </div>
                    )}   
                </div>
            </section>
            <section className={styles.contentContainerInput}>
                <h1 className={styles.textHeader}>Delete Contract</h1>
                {wallet && (
                    <div >
                        <button
                        className={styles.inputBtnDelete}
                        onClick={async () => {
                            const contract = await deleteContract(wallet, contractAddress)
                            if (contract) {
                                router.push('/dashboard');
                            }
                        }}
                        >
                        Delete contract!
                        </button>
                    </div>
                )}   
            </section>            
        </main>
    )
}
