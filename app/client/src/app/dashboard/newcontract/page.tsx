"use client"
import styles from '../../styles/dashboard.module.scss'
import Navbar from '../../components/navbar'
import Footer from '../../components/footer'
import AddContractSection from '../../components/addContractSection'
import type { AppProps } from "next/app";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { endpoint } from "../../api/utils/constants";
import "@solana/wallet-adapter-react-ui/styles.css";

export default function Home() {  
    const phantomWallet = new PhantomWalletAdapter();
    return (
    <main>
        <div className={styles.containerBody}>
            <Navbar/>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={[phantomWallet]} autoConnect>
                    <WalletModalProvider>
                        <AddContractSection/>
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </div>
        <Footer/>
    </main>
)}
                  
                  