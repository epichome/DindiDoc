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
import addSignature from "../api/addSignature/route";
import addNote from '../api/addNote/route'
import transferContract from '../api/transferContract/route'
import deleteContract from '../api/deleteContract/route'

import CryptoJS from 'crypto-js';

import { set } from "@coral-xyz/anchor/dist/cjs/utils/features";
import { TRUE } from "sass";

async function getData (contractAddress: string, wallet: any){
    const contract = await fetchContractData(
        contractAddress,
        wallet,
    );
    return contract
}
function encryptData(inData:any, password:any){
    var key = CryptoJS.enc.Utf8.parse(password);
    var iv = CryptoJS.enc.Hex.parse(password);
    var outData = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(inData), key,
        {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString();
    return outData
}
function decryptData(inTerms:any, password:any){
    var key = CryptoJS.enc.Utf8.parse(password);
    var iv = CryptoJS.enc.Hex.parse(password);
    var decrypted = CryptoJS.AES.decrypt(inTerms, key,
        {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        
    var decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    return(decryptedText)
}

function checkOriginality(){

}

export default function ChangeContractSection(){
    const [messageAccount, _] = useState(Keypair.generate());
    const [terms, setTerms] = useState<string>();
    const [auth, setAuth] = useState<string>();
    const [note, setNote] = useState("");
    const [type, setType] = useState<string>();
    const [owner, setOwner] = useState("");
    const [signer1, setSigner1] = useState<string>();
    const [signer2, setSigner2] = useState<string>();

    const [password, setPassword] = useState("");
    const [unlocked, setUnlocked] = useState(false);

    const[termsHashedCheck, setTermsHashedCheck] = useState("");
    const[Signature1HashedCheck, setSignature1HashedCheck] = useState("");
    const[Signature2HashedCheck, setSignature2HashedCheck] = useState("");
    const[NotesHashedCheck, setNotesHashedCheck] = useState("");
    const[COOHashedCheck, setCOOHashedCheck] = useState("");
    const[isOriginal, setIsOriginal] = useState(false);

    const [message, setMessage] = useState("");
    const [messageAuthor, setMessageAuthor] = useState("");
    const [messageTime, setMessageTime] = useState(0);
    const [inputtedMessage, setInputtedMessage] = useState("");
    const [inputtedSigner, setInputtedSigner] = useState("");

    const [transferTo, setTransferTo] = useState("");
    const [newOwner, setNewOwner] = useState("");

    const wallet = useAnchorWallet();
    const mounted = useIsMounted();

    const router = useRouter();

    const searchParams = useSearchParams()

    const contractAddress = searchParams.get('adress') || "";

    const [fileContent, setFileContent] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            setFileContent(content);
            var js = JSON.parse(content)
            setTermsHashedCheck(js["Terms"])
            setSignature1HashedCheck(js["Signer1"])
            setSignature2HashedCheck(js["Signer2"])
            setNotesHashedCheck(js["Notes"])
            setCOOHashedCheck(js["Owner"])
        };
        reader.readAsText(file);
        }
    };

    useEffect(() => {
        const j = getData(contractAddress, wallet).then(i => {
            var contract = i
            setTerms(contract?.terms)
            setAuth(contract?.authority.toString())
            setNote(contract?.notes || "")
            setType(contract?.storageType.toString())
            setOwner(contract?.chainOfOwnership || "")
            setSigner1(contract?.signature1)
            setSigner2(contract?.signature2)

            if(contract?.storageType.toString() !== "1"){
                setUnlocked(true)
            }
            if(contract?.storageType.toString() !== "2"){
                setIsOriginal(true)
            }
        });
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
                <h1>Edit Contract</h1>
            </div>
            {type == "1" && !unlocked?
                <section className={styles.contentContainer}>
                    <h1 className={styles.textHeader}>Password</h1>
                    <input 
                        placeholder="Password" 
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className={styles.inputText}
                    />
                    <button
                            disabled={!password}
                            className={!password ? styles.inputBtnInactive : styles.inputBtnActive}
                            onClick={() => {
                                const te = decryptData(terms, password)
                                const ow = decryptData(owner, password)
                                if (te !== ""){
                                    setUnlocked(true)
                                    setTerms(te)
                                    setOwner(ow)
                                } else{
                                    console.log("Wrong password")
                                }
                                
                            }}>
                    Unlock</button>
                </section> : null
            }

            {type == "2" ? 
            <section className={styles.contentContainer}>
                <h1 className={styles.textHeader}>Check originality</h1>
                <div className={styles.inputContainer}>
                <div>
                    <input type="file" accept=".txt, .json" onChange={handleFileChange} />
                    <h1>{fileContent}</h1>
                </div>
                    <div className={styles.textLabel}>Terms:</div>
                    <textarea
                    placeholder="Terms"
                    onChange={(e) => setTermsHashedCheck(e.target.value)}
                    value={termsHashedCheck}
                    className={styles.inputTextSmallArea}
                    />

                    <div className={styles.textLabel}>Signatures:</div>
                    <textarea
                    placeholder="Signature one"
                    onChange={(e) => setSignature1HashedCheck(e.target.value)}
                    value={Signature1HashedCheck}
                    className={styles.inputTextSmallArea}
                    />

                    <textarea
                    placeholder="Signature two"
                    onChange={(e) => setSignature2HashedCheck(e.target.value)}
                    value={Signature2HashedCheck}
                    className={styles.inputTextSmallArea}
                    />          

                    <div className={styles.textLabel}>Notes:</div>
                    <textarea
                    placeholder="Notes"
                    onChange={(e) => setNotesHashedCheck(e.target.value)}
                    value={NotesHashedCheck}
                    className={styles.inputTextSmallArea}
                    />

                    <div className={styles.textLabel}>ChainOfOwners:</div>
                    <textarea
                    placeholder="ChainOfOwners"
                    onChange={(e) => setCOOHashedCheck(e.target.value)}
                    value={COOHashedCheck}
                    className={styles.inputTextSmallArea}
                    />

                    <button
                    className={styles.inputBtnActive}
                    onClick={async () => {
                        checkOriginality()
                        var original = 1
                        if (terms != CryptoJS.SHA256(termsHashedCheck).toString(CryptoJS.enc.Hex)){
                            original = 0;
                        }
                        
                        //signers
                        if (signer1 != CryptoJS.SHA256(Signature1HashedCheck).toString(CryptoJS.enc.Hex) && signer1 !== ""){
                            original = 0;
                        }
                        if (signer1 != CryptoJS.SHA256(Signature2HashedCheck).toString(CryptoJS.enc.Hex) && signer2 !== ""){
                            original = 0;
                        }
                        
                        //note
                        var notesList = NotesHashedCheck.split("\n")
                        var notesHashed = ""
                        var notesHCheck = note.split("\n")
                        if(note !== ""){
                            if(notesList.length !== notesHCheck.length - 1){
                                original = 0
                            }

                            for (var i = 0; i < notesList.length - 1; i++){
                                notesHashed = CryptoJS.SHA256(notesHashed + notesList[i]).toString(CryptoJS.enc.Hex)
                                if(notesHCheck[i] !== notesHashed){
                                    original = 0
                                }
                            }
                        }
                       
                        //chain of owner
                        var COOList = COOHashedCheck.split("\n")
                        var COOHashed = ""
                        var CooHCheck = owner.split("\n")
                        if(owner !== ""){
                            if(COOList.length !== CooHCheck.length - 1){
                                original = 0
                            }
                            for (var i = 0; i < COOList.length - 1; i++){
                                COOHashed = CryptoJS.SHA256(COOHashed + COOList[i]).toString(CryptoJS.enc.Hex)
                                if(CooHCheck[i] !== COOHashed){
                                    original = 0
                                }
                                COOHashed += "\n"
                            }
                        }
                        if(original == 1){
                            setIsOriginal(true)
                        }
                        
                    }}
                    >
                    Check
                    </button>
                </div>
            </section>: null}
            
            {unlocked && isOriginal &&(
            <div>
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
                            {note?.split("\n").map((ind) => (
                                <div className={styles.textSmallArea}>
                                    {type == "1" ? ind: ind}
                                </div>
                            ))}

                        </div>
                        <div className={styles.textContainer}>
                            <div className={styles.textLabel}>ChainOfOwners:</div>
                            {owner?.split("\n").map((ind) => (
                                <div className={styles.textSmallArea}>{type == "1" ? ind: ind}</div>
                            ))}
                        </div>
                    </div>
                    
                    <div>Signers: {signer1 + " " + signer2}</div>
                    

                </section>
                <section className={styles.contentContainerInput}>
                    <h1 className={styles.textHeader}>Sign Contract</h1>
                    {wallet && (
                        <div className={styles.inputContainer}>
                            <textarea
                            placeholder="Proof of signature"
                            onChange={(e) => setInputtedSigner(e.target.value)}
                            value={inputtedSigner}
                            className={styles.inputTextSmallArea}
                            />
                            <button
                            disabled={!inputtedSigner}
                            className={!inputtedSigner ? styles.inputBtnInactive : styles.inputBtnActive}
                            onClick={async () => {
                                var signer = 0
                                if (signer1 !== ""){
                                    signer = 1
                                }
                                var iMsg = inputtedSigner
                                if (type == "1"){
                                    iMsg = encryptData(inputtedSigner, password)
                                }
                                if (type == "2"){
                                    iMsg = CryptoJS.SHA256(note + inputtedSigner).toString(CryptoJS.enc.Hex)
                                }
                                const contract = await addSignature(iMsg, signer, wallet, contractAddress)
                                if (contract) {
                                    window.location.reload()
                                }
                            }}
                            >
                            Sign
                            </button>
                        </div>
                    )}   
                </section>
                <section className={styles.contentContainerN}>
                    <div className={styles.inputSeparator}>
                        <h1 className={styles.textHeader}>Add Note</h1>
                        {wallet && (
                            <div className={styles.inputContainer}>
                                <textarea
                                placeholder="New note"
                                onChange={(e) => setInputtedMessage(e.target.value)}
                                value={inputtedMessage}
                                className={styles.inputTextSmallArea}
                                />
                                <button
                                disabled={!inputtedMessage}
                                className={!inputtedMessage ? styles.inputBtnInactive : styles.inputBtnActive}
                                onClick={async () => {
                                    var iMsg = inputtedMessage
                                    if (type == "1"){
                                        iMsg = encryptData(inputtedMessage, password)
                                    }
                                    if (type == "2"){
                                        iMsg = CryptoJS.SHA256(note + inputtedMessage).toString(CryptoJS.enc.Hex)
                                    }
                                    const contract = await addNote(iMsg, wallet, contractAddress)
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
                                    var nOw = newOwner
                                    if (type == "1"){
                                        nOw = encryptData(newOwner, password)
                                    }
                                    if (type == "2"){
                                        nOw = CryptoJS.SHA256(owner + newOwner).toString(CryptoJS.enc.Hex)
                                    }
                                    const contract = await transferContract(transferTo, nOw, wallet, contractAddress)
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
            </div>)} 
        </main>
    )
}
