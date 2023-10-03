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

import styles from '../styles/viewcontracts.module.scss'
import Link from 'next/link';

import { useSearchParams, useRouter } from 'next/navigation'

import rsa from 'js-crypto-rsa';

import CryptoJS from 'crypto-js';

//add contract: stor blå satisfying knapp jfr revolut 
//ren text, kryptrad, hashad
export default function addContractSection(){
    const [messageAccount, _] = useState(Keypair.generate());
    const [message, setMessage] = useState("");
    const [messageAuthor, setMessageAuthor] = useState("");
    const [messageTime, setMessageTime] = useState(0);
    const [inputtedMessage, setInputtedMessage] = useState("");

    const [accounts, setAccounts] = useState([]);

    const wallet = useAnchorWallet();
    const mounted = useIsMounted();

    const [contentList, setContentList] = useState<{ t: string; body: string; link: string; adress: string; type: number; time: number}[]>([])

    useEffect(() => {
        const fetchData = async (wallet: any) => {
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
            setContentList([])
        }
    }, [wallet])

    return(
        <main className={styles.main}>
            <section id="searchbar" className={styles.searchbar}>
                <Link href="/dashboard" className={styles.searchbarInput}>
                    <p>Back</p>
                </Link>
                <div>{wallet?.publicKey.toString()}</div>
            </section>
            <div id="hello" className={styles.helloContainer}>
                <h1>Your contracts</h1>
            </div>
            <section className={styles.contentContainerFilter}>

            </section>
            {wallet && (
                <section id="my-contracts" className={styles.contentContainer}>
                    <div className={styles.tableTitle}>
                        <p>Name</p>
                        <p>Type</p>
                        <p>Created on</p>
                        <p>Size</p>
                        <p>Edit</p>
                    </div>
                    <div>
                        {contentList && contentList.map((ind) => (
                            <Link href={{pathname: ind.link, query: {adress: ind.adress}}} className={styles.tableContent} >
                                <div>{ind.adress.substring(0, 4) + "..." + ind.adress.substring(ind.adress.length - 4)}</div>
                                
                                <div className={styles.infoCardTop}>
                                    {ind.type == 0 ? <div>Text</div>: null } 
                                    {ind.type == 1 ? <div>Encrypted</div>: null } 
                                    {ind.type == 2 ? <div>Hashed</div>: null } 
                                </div>
                               

                                <div className={styles.inforCardBottom}>
                                    <div>{ind.time}</div>
                                </div>

                                
                            </Link>    
                        ))}
                    </div>
                </section>
            )}   
        </main>
    )
}