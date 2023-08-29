"use client"
import Link from 'next/link';
import styles from '../styles/dashboard.module.scss';
import { useState, useEffect} from "react"

import { Keypair } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import useIsMounted from "../api/utils/useIsmounted";
import createContract from "../api/createContract/route";
import fetchContracts from '../api/fetchContracts/route';

import { useWallet } from '@solana/wallet-adapter-react';

//redirect to signin if wallet isnt given

export default function ContractSection(){
    const [messageAccount, _] = useState(Keypair.generate());
    const [message, setMessage] = useState("");
    const [messageAuthor, setMessageAuthor] = useState("");
    const [messageTime, setMessageTime] = useState(0);
    const [inputtedMessage, setInputtedMessage] = useState("");

    const [accounts, setAccounts] = useState([]);

    const wallet = useAnchorWallet();
    const mounted = useIsMounted();

    const [contentList, setContentList] = useState([
        {t: "", body: "", link: "/", adress: ""},
    ])

    useEffect(() => {
        const fetchData = async (wallet) => {
            const contract = await fetchContracts(
                wallet?.publicKey.toString(),
                wallet,
                );
                if (contract) {
                    console.log(contract)
                    setContentList(contract)
                }
          }
        console.log(wallet?.publicKey.toString())
        if (wallet){
            fetchData(wallet);
        }else{
            setContentList([{ t: "", body: "", link: "/", adress: "", }])
        }
    }, [wallet])

    return(
        <main className={styles.main}>
            <section id="searchbar" className={styles.searchbar}>
                <div className={styles.searchbarInput}>
                    <div>O</div>
                    <input type="text" placeholder='Search after contract'></input>
                    <div></div>
                </div>
                <div className={styles.WalletMultiButton}>{mounted && <WalletMultiButton/>}</div>
            </section>
            <div id="hello" className={styles.helloContainer}>
                <h1>Hello</h1>
            </div>

            <section id="my-contracts" className={styles.contentContainer}>
                <h1 className={styles.textHeader}>Contracts</h1>
                <div className={styles.contentWrapper}>
                    {contentList.map((ind) => (
                        <Link href={ind.link} className={styles.infoCard}>
                            <div>Detta är ett test där man loopar igenom contentList med ind</div>
                            <h1 className={styles.h1}>Detta är texten: {ind.body}</h1>
                            <h2>Detta är värdet: {ind.t}</h2>
                            <div>adress: {ind.adress}</div>
                        </Link>    
                        //byt ägare till kontraktet 
                        //lägg till notering
                        //ta bort kontraktet 
                        //signera kontraktet
                    ))}
                </div>    
            </section>

            <section id="create-contract" className={styles.contentContainer}>
                <h1 className={styles.textHeader}>Create New Contract</h1>
                <div className={styles.contentWrapper}>
                    <Link href="/dashboard/newcontract" className={styles.infoCard}>
                    
                    </Link>    
                </div>

            </section>
        </main>
    )
}
