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