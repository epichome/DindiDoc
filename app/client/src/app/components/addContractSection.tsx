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

import CryptoJS from 'crypto-js';

//add contract: stor blå satisfying knapp jfr revolut 
//ren text, kryptrad, hashad
export default function addContractSection(){
    const [messageAccount, _] = useState(Keypair.generate());
    const [message, setMessage] = useState("");
    const [messageAuthor, setMessageAuthor] = useState("");
    const [messageTime, setMessageTime] = useState(0);
    const [inputtedType, setInputtedType] = useState("");
    const [inputtedTerms, setInputtedTerms] = useState("");
    const [inputtedOwner, setInputtedOwner] = useState("");

    const [inputtedPassword, setInputtedPassword] = useState("");

    const [accounts, setAccounts] = useState([]);

    const wallet = useAnchorWallet();
    const mounted = useIsMounted();

    const router = useRouter();

    const searchParams = useSearchParams()

    const [isActive, setIsActive] = useState(false);
    const [selected, setIsSelected] = useState("Choose type");
    
    function handleBlur(e: Event) {
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
                                            setIsSelected(e.target.textContent);
                                            setIsActive(!isActive);
                                            }}
                                            className={styles.item}
                                        >
                                            Text
                                        </div>
                                        <div
                                            className={styles.item}
                                            onClick={(e) => {
                                            setIsSelected(e.target.textContent);
                                            setIsActive(!isActive);
                                            }}
                                        >
                                            Encrypted
                                        </div>
                                        <div
                                            className={styles.item}
                                            onClick={(e) => {
                                            setIsSelected(e.target.textContent);
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
                                <h1 className={styles.textSubHeader}>Owners name</h1>
                                <input 
                                    className={styles.inputText}
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
                        {selected == "Hashed" ? <button onClick={handleDownloadClick}>Download .txt File</button>: null}

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
                            Create contract
                            </button>
                        </div>
                    </div>
                )}   
            </section>
        </main>
    )
}