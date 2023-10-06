"use client"
import Link from 'next/link';
import Image from 'next/image'
import styles from '../styles/dashboard.module.scss';
import { useState, useEffect} from "react"

import { Keypair } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import useIsMounted from "../api/utils/useIsmounted";
import createContract from "../api/createContract/funct";
import fetchContracts from '../api/fetchContracts/funct';

import { useWallet } from '@solana/wallet-adapter-react';

//redirect to signin if wallet isnt given

export default function ContractSection(){
    const [messageAccount, _] = useState(Keypair.generate());
    const [message, setMessage] = useState("");
    const [messageAuthor, setMessageAuthor] = useState("");
    const [messageTime, setMessageTime] = useState(0);
    const [inputtedMessage, setInputtedMessage] = useState("");

    const[menuActive, setMenuActive] = useState(false)

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
            <div className={menuActive ? styles.menuDropDownActive : styles.menuDropDownInactive}>
                <div className={styles.menuContainer}>
                    <div className={styles.menuTop}>
                        <Image
                        src="/images/logov2.png"
                        width={50}
                        height={50}
                        alt="Picture of the author"
                        />

                        <button className={styles.menuClose} onClick={() => setMenuActive(!menuActive)}>
                        Close
                        </button>
                    </div>
                    <div className={styles.menuMiddle}>
                        <Link href="/dashboard" className={styles.navbarContent}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 19v-8.5a1 1 0 0 0-.4-.8l-7-5.25a1 1 0 0 0-1.2 0l-7 5.25a1 1 0 0 0-.4.8V19a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1zM8 13v3m4-6v6m4-1v1"/></svg>
                            <p>Home</p>
                        </Link>
                        <Link href="/dashboard/contracts" className={styles.navbarContent}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 20H5c-1.6 0-2-1.333-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6m2 8c-.667 0-2-.4-2-2v-6m2 8c1.6 0 2-1.333 2-2v-6h-4"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16h6m-1-6a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/></svg>
                            <p>Contracts</p>
                        </Link>
                        <Link href="/dashboard/newcontract" className={styles.navbarContent}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 16v3m0 0v3m0-3h3m-3 0h-3m4-10v-.172a2 2 0 0 0-.586-1.414l-3.828-3.828A2 2 0 0 0 14.172 3H14m6 6h-4a2 2 0 0 1-2-2V3m6 6v3m-6-9H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"/></svg>
                            <p>New Contract</p>
                        </Link>
                    </div>
                    <div className={styles.menuBtm}>
                        <Link className={styles.menuLoginBtn} href="/dashboard/newcontract"><p>+ Add Contract</p></Link>
                    </div>
                </div>
                <div className={styles.menuOverlay}>

                </div>
            </div>
            <section id="searchbar" className={styles.searchbar}>
                <button className={styles.lgHidden} onClick={() => setMenuActive(!menuActive)}>Menu</button>
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
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8" d="M5 12h7m7 0h-7m0 0V5m0 7v7"/></svg>
                        </Link>    
                    </div>

                </section>
            )}
        </main>
    )
}
