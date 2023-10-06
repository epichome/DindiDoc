"use client"
import { ChangeEvent, useState, useEffect} from "react"
import DropDown from './dropdown'

import { Keypair } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import useIsMounted from "../api/utils/useIsmounted";
import createContract from "../api/createContract/funct";
import fetchContracts from '../api/fetchContracts/funct';

import { useWallet } from '@solana/wallet-adapter-react';

import styles from '../styles/viewcontracts.module.scss'
import Link from 'next/link';
import Image from 'next/image'

import { useSearchParams, useRouter } from 'next/navigation'

import rsa from 'js-crypto-rsa';

import CryptoJS from 'crypto-js';

//add contract: stor blå satisfying knapp jfr revolut 
//ren text, kryptrad, hashad
export default function ViewContractSection(){
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

    const [isActive, setIsActive] = useState(false);
    const [selected, setIsSelected] = useState("All types");
    function handleBlur(event: React.FocusEvent<HTMLDivElement>) {
        setIsActive(false)
    }

    const[filterNameVar, setFilterNameVar] = useState("")
    const[filterTypeVar, setFilterTypeVar] = useState("")
    const [contentListFiltered, setContentListFiltered] = useState<{ t: string; body: string; link: string; adress: string; type: number; time: string}[]>([])

    function filterName(){
        var filteredJSON = []
        var typeValue = 0
        if (selected == "Encrypted"){
            typeValue = 1
        }
        if (selected == "Hashed"){
            typeValue = 2
        }
        if(filterNameVar !== ""){
            for(var i in contentList){
                if (selected !== "All types"){
                    if (contentList[i].adress.includes(filterNameVar) && contentList[i].type == typeValue){
                        filteredJSON.push(contentList[i])
                    } 
                }else{
                    if (contentList[i].adress.includes(filterNameVar)){
                        filteredJSON.push(contentList[i])
                    }
                }
            }
            setContentListFiltered(filteredJSON)
        } else if (selected !== "All types"){
            for(var i in contentList){
                if (contentList[i].type == typeValue){
                    filteredJSON.push(contentList[i])
                } 
            }
            setContentListFiltered(filteredJSON)
        } else{
            setContentListFiltered(contentList)       
        }
    }
    useEffect(() => {
        // This function will run when filterNameVar changes
        filterName();
      }, [filterNameVar, selected]); // Add filterNameVar as a dependency

    useEffect(() => {
        const fetchData = async (wallet: any) => {
            const contract = await fetchContracts(
                wallet?.publicKey.toString(),
                wallet,
                );
                if (contract) {
                    setContentList(contract)
                    setContentListFiltered(contract)
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
                {wallet &&(<button className={styles.lgHidden} onClick={() => setMenuActive(!menuActive)}>Menu</button>)}
                <Link href="/dashboard" className={`${styles.searchbarInput} ${styles.ds}`}>
                    <p>Back</p>
                </Link>
                <div>{wallet?.publicKey.toString().substring(0, 4) + "..." + wallet?.publicKey.toString().substring(wallet?.publicKey.toString().length - 4)}</div>
            </section>
            <div id="hello" className={styles.helloContainer}>
                <h1>Your contracts</h1>
            </div>
            <section className={styles.contentContainerFilter}>
                <div className={styles.searchbarInput}>
                    <Image
                        className={styles.navbarImage}
                        src="/images/search.png"
                        width={18}
                        height={18}
                        alt="Picture of the author"
                    />
                    <input type="text" placeholder='Filter after name' onChange={(e) => {
                        setFilterNameVar(e.target.value)
                    }}></input>
                </div>

                <div tabIndex={0} onBlur={handleBlur}>
                    <div className={styles.dropdown}>
                        <div
                        onClick={(e) => {
                            setIsActive(!isActive);
                        }}
                        className={styles.dropdownBtn}
                        >
                        {selected}
                        <span
                            className={isActive ? styles.faCaretUp : styles.faCaretDown}
                        />
                        </div>
                        <div
                        className={styles.dropdownContent}
                        style={{ display: isActive ? "block" : "none" }}
                        >
                        <div
                            onClick={(e) => {
                            const target = e.target as HTMLElement;
                            setIsSelected(target.textContent || "");
                            setIsActive(!isActive);
                            filterName
                            }}
                            className={styles.item}
                        >
                            All types
                        </div>    
                        <div
                            onClick={(e) => {
                            const target = e.target as HTMLElement;
                            setIsSelected(target.textContent || "");
                            setIsActive(!isActive);
                            filterName
                            }}
                            className={styles.item}
                        >
                            Text
                        </div>
                        <div
                            className={styles.item}
                            onClick={(e) => {
                            const target = e.target as HTMLElement;
                            setIsSelected(target.textContent || "");
                            setIsActive(!isActive);
                            filterName
                            }}
                        >
                            Encrypted
                        </div>
                        <div
                            className={styles.item}
                            onClick={(e) => {
                            const target = e.target as HTMLElement;
                            setIsSelected(target.textContent || "");
                            setIsActive(!isActive);
                            filterName
                            }}
                        >
                            Hashed
                        </div>
                        </div>
                    </div>
                </div>
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
                        {contentList && contentListFiltered.map((ind) => (
                            <Link href={{pathname: ind.link, query: {adress: ind.adress}}} className={styles.tableContent} key={ind.adress}>
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