"use client"
import { useState, useEffect} from "react"
import DropDown from './dropdown'

import { Keypair } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import useIsMounted from "../api/utils/useIsmounted";
import createContract from "../api/createContract/funct";
import fetchContracts from '../api/fetchContracts/funct';

import { useWallet } from '@solana/wallet-adapter-react';

import styles from '../styles/addcontract.module.scss'
import Link from 'next/link';
import Image from 'next/image'

import { useSearchParams, useRouter } from 'next/navigation'

import rsa from 'js-crypto-rsa';

import CryptoJS from 'crypto-js';

//add contract: stor blå satisfying knapp jfr revolut 
//ren text, kryptrad, hashad
export default function AddContractSection(){
    const [messageAccount, _] = useState(Keypair.generate());
    const [message, setMessage] = useState("");
    const [messageAuthor, setMessageAuthor] = useState("");
    const [messageTime, setMessageTime] = useState(0);
    const [inputtedType, setInputtedType] = useState("");
    const [inputtedTerms, setInputtedTerms] = useState("");
    const [inputtedOwner, setInputtedOwner] = useState("");

    const [inputtedPassword, setInputtedPassword] = useState("");

    const[menuActive, setMenuActive] = useState(false)

    const [accounts, setAccounts] = useState([]);

    const wallet = useAnchorWallet();
    const mounted = useIsMounted();

    const router = useRouter();

    const searchParams = useSearchParams()

    const [isActive, setIsActive] = useState(false);
    const [selected, setIsSelected] = useState("Choose type");
    
    function handleBlur(event: React.FocusEvent<HTMLDivElement>) {
      setIsActive(false)
    }

    const handleDownloadClick = () => {
        var fileContent = {Terms: inputtedTerms, Signer1: "", Signer2: "", Notes: "", Owner: inputtedOwner}
        const blob = new Blob([JSON.stringify(fileContent)], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "Document";
        a.click();
        URL.revokeObjectURL(url);
        
      };

    const publicJwk = {kty: 'RSA', n: '...', e: '...'}; // public key
    const privateJwk = {kty: 'RSA', n: '...', e: '...', p: '...', q: '...', dp: '...', dq: '...', qi: '...'}; // paired private key
    const msg = "";

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
                <Link href="/dashboard" className={styles.searchbarInput}>
                    <p>Cancel</p>
                </Link>
                <div>{wallet?.publicKey.toString().substring(0, 4) + "..." + wallet?.publicKey.toString().substring(wallet?.publicKey.toString().length - 4)}</div>
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
                                <div
                                    tabIndex={0}
                                    onBlur={handleBlur}
                                    >
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
                                            }}
                                        >
                                            Hashed
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={selected == "Encrypted" ? styles.contentContainerTopInfoDiv: styles.contentContainerHidden}>
                                <h1 className={styles.textSubHeader}>Password</h1>
                                <input 
                                    className={styles.inputText}
                                    type="text" 
                                    onChange={(e) => setInputtedPassword(e.target.value)}
                                    value={inputtedPassword}
                                />
                            </div>
                            <div className={styles.contentContainerTopInfoDiv}>
                                <h1 className={styles.textSubHeader}>Initiators name</h1>
                                <input 
                                    className={styles.inputText}
                                    type="text" 
                                    placeholder=""
                                    onChange={(e) => setInputtedOwner(e.target.value)}
                                    value={inputtedOwner}
                                />
                            </div>
                        </div>
                        <div className={styles.placeContent}>
                            <h1 className={styles.textSubHeader}>Terms</h1>
                            <p>{inputtedTerms.length + inputtedOwner.length + inputtedPassword.length} / 875</p>
                        </div>
                        <textarea
                            placeholder="Terms"
                            className={styles.contentContainerTerms}
                            onChange={(e) => setInputtedTerms(e.target.value)}
                            value={inputtedTerms}
                        />
                        
                        <h1 className={styles.textSubHeader}>Create Contract</h1>
                        {selected == "Hashed" ? <button onClick={handleDownloadClick} className={styles.fileDownload}>
                            Download .txt File
                        </button>: null}

                        <div >
                            <button
                            className={!inputtedOwner || !inputtedTerms ? styles.inputBtnInactive : styles.inputBtnActive}
                            disabled={!inputtedOwner || !inputtedTerms}
                            onClick={async () => {
                                var intype = 0;
                                var inTerms = "";
                                var inOwner = "";
                                if (selected == "Hashed"){
                                    intype = 2;
                                    //set information to Hashed
                                    var hashedInput = CryptoJS.SHA256(inputtedTerms).toString(CryptoJS.enc.Hex);
                                    inTerms = hashedInput;
                                    var hashedOwner = CryptoJS.SHA256(inputtedOwner).toString(CryptoJS.enc.Hex);
                                    inOwner = hashedOwner; 
                                }else if (selected == "Encrypted"){
                                    intype = 1;
                                    //set information to Encrypted                                     
                                    var key = CryptoJS.enc.Utf8.parse(inputtedPassword);
                                    var iv = CryptoJS.enc.Hex.parse(inputtedPassword);
                                    var inOwner = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(inputtedOwner), key,
                                        {
                                            keySize: 128 / 8,
                                            iv: iv,
                                            mode: CryptoJS.mode.CBC,
                                            padding: CryptoJS.pad.Pkcs7
                                        }).toString();
                                    var inTerms = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(inputtedTerms), key,
                                        {
                                            keySize: 128 / 8,
                                            iv: iv,
                                            mode: CryptoJS.mode.CBC,
                                            padding: CryptoJS.pad.Pkcs7
                                        }).toString();
                                }else {
                                    intype = 0
                                    //set information to Text
                                    inTerms = inputtedTerms;
                                    inOwner = inputtedOwner;
                                }

                                const contract = await createContract(
                                inOwner,
                                inTerms,
                                intype,
                                wallet,
                                messageAccount,
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
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 16v3m0 0v3m0-3h3m-3 0h-3m4-10v-.172a2 2 0 0 0-.586-1.414l-3.828-3.828A2 2 0 0 0 14.172 3H14m6 6h-4a2 2 0 0 1-2-2V3m6 6v3m-6-9H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"/></svg>
                            Create contract
                            </button>
                        </div>
                    </div>
                )}   
            </section>
        </main>
    )
}