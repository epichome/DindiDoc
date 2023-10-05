"use client"
import Link from 'next/link';
import Image from 'next/image'
import styles from '../styles/dashboard.module.scss';
import { useState, useEffect} from "react"

import { Keypair } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import useIsMounted from "../api/utils/useIsmounted";
import createContract from "../api/createContract/route";
import fetchContracts from '../api/fetchContracts/route';

import { useWallet } from '@solana/wallet-adapter-react';
import BN from 'bn.js';
import { stringify } from 'querystring';

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

    const [contentList, setContentList] = useState<{ t: string; body: string; link: string; adress: string; type: number; time: string}[]>([])

    useEffect(() => {
        const fetchData = async (wallet: any) => {
            const contract = await fetchContracts(
                wallet?.publicKey.toString(),
                wallet,
                );
                if (contract) {
                    setContentList(contract)
                }
          }
        if (wallet){
            fetchData(wallet);
        }else{
            setContentList([])
        }
    }, [wallet])

    return(
        <main className={styles.main}>
            <section id="searchbar" className={styles.searchbar}>
                <div className={styles.searchbarInput}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="m20 20-4.05-4.05m0 0a7 7 0 1 0-9.9-9.9 7 7 0 0 0 9.9 9.9z"/></svg>
                    <input type="text" placeholder='Search after contract'></input>
                    <div></div>
                </div>
                <div className={styles.WalletMultiButton}>{mounted && <WalletMultiButton/>}</div>
            </section>
            <div id="hello" className={styles.helloContainer}>
                <h1>Hello</h1>
            </div>

            <section id="my-contracts" className={styles.contentContainer}>
                {wallet ? 
                <div>
                    <div className={styles.textHeaderContainer}>
                        <h1 className={styles.textHeader}>Contracts</h1>
                        <Link href={{pathname: "/dashboard/contracts"}} >
                            <h3 className={styles.textHeaderLink}>See all contracts</h3>
                        </Link>
                    </div>
                    <div className={styles.contentWrapper}>
                        {contentList && contentList.map((ind) => (
                            <Link href={{pathname: ind.link, query: {adress: ind.adress}}} className={styles.infoCard} key={ind.adress} >
                                <div className={styles.infoCardTop}>
                                    {ind.type == 0 ? <div>Text</div>: null } 
                                    {ind.type == 1 ? <div>Encrypted</div>: null } 
                                    {ind.type == 2 ? <div>Hashed</div>: null } 
                                    <div>{ind.adress.substring(0, 4) + "..." + ind.adress.substring(ind.adress.length - 4)}</div>
                                </div>
                                <div className={styles.inforCardMiddle}>
                                    <div className={styles.inforCardMiddleBlur}>
                                        <h1 className={styles.h1}>{ind.body}</h1>
                                    </div>
                                    
                                </div>
                                <div className={styles.inforCardBottom}>
                                    <div>{ind.time}</div>
                                </div>

                                
                            </Link>    
                        ))}
                    </div>    
                </div>: <div>Select wallet to Continue</div>}
            </section>
            {wallet &&(
                <section id="create-contract" className={styles.contentContainer}>
                    <h1 className={styles.textHeader}>Create New Contract</h1>
                    <div className={styles.contentWrapper}>
                        <Link href={{pathname: "/dashboard/newcontract"}} className={styles.infoCardAdd}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 12h7m7 0h-7m0 0V5m0 7v7"/></svg>
                        </Link>    
                    </div>

                </section>
            )}
        </main>
    )
}
