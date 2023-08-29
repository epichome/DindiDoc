                  //längst upp sök på contract          min profil 
//navbar på vänster sida
                  //My contracts --> hantera enskilda kontrakt + signera   
                  //skapa nya kontrakt 
"use client"
import styles from '../styles/dashboard.module.scss'
import Navbar from '../components/navbar'
import ContractSection from '../components/contractSection'
import type { AppProps } from "next/app";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { endpoint } from "../api/utils/constants";
import "@solana/wallet-adapter-react-ui/styles.css";

export default function Home() {  
    const phantomWallet = new PhantomWalletAdapter();
    return (
    <main className={styles.body}>
        <Navbar/>
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={[phantomWallet]}>
                <WalletModalProvider>
                    <ContractSection/>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    </main>
)}
                  
                  