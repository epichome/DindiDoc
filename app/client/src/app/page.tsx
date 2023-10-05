"use client"
import Image from 'next/image'
import Link from 'next/link';
import Footer from './components/footer'
import styles from './styles/main.module.scss'
import { useState, useEffect} from "react"

export default function Home() {  
  const [headerShowState, setHeaderShowState] = useState (styles.headerActive)

  function showHeader(){
    setHeaderShowState(styles.headerActive)
  }

  function hideHeader(){
    setHeaderShowState(styles.headerInactive)
  }

  const [LandingState, setLandingState] = useState (styles.landing)
  const [HeaderColorState, setHeaderColorState] = useState ("")
  function scrollChange(){
    var vh = window.innerHeight
    var elem = document.getElementById("landing");
    if (elem != null){
      var rect = elem.getBoundingClientRect();
      //if elem is in position, change the color of background 
      if (rect.top < -vh/2){
          setLandingState(styles.landingChange)
          setHeaderColorState(styles.headerChange)
          
      }else{
          setLandingState(styles.landing)
          setHeaderColorState("")
      }
    }
  }

  const [lastScrollTop, setlastScrollTop] = useState (0)
  function handleScroll(){ // or window.addEventListener("scroll"....
    var st = window.pageYOffset || document.documentElement.scrollTop;
    scrollChange()
    if (st > lastScrollTop){
        //downscroll code
        hideHeader()
    } else {
        // upscroll code
        showHeader()
    }
    setlastScrollTop( st <= 0 ? 0 : st) // For Mobile or negative scrolling
  }
  useEffect(() => {
    // element should be replaced with the actual target element on which you have applied scroll, use window in case of no target element.
    window.addEventListener("scroll", handleScroll)
  });
  
  return (
    <main className={styles.main}>
      <section className={`${styles.header} ${headerShowState} ${HeaderColorState}`}>
        <div className={styles.headerLeft}>
          <Image
            src="/images/logov2.png"
            width={50}
            height={50}
            alt="Picture of the author"
          />
        </div>
        <div className={styles.headerRight}>
            <Link href="/whitepaper"><p>ABOUT</p></Link>
            <Link href="https://github.com/epichome/DindiDoc"><p>GITHUB</p></Link>
            <Link href="/dashboard"><p>LOGIN</p></Link>
            <Link href="/dashboard"><div className={styles.contactHeader}></div></Link>
        </div>
      </section>
      <section className={`${styles.landing} ${LandingState}`} id='landing'>
          <div className={styles.landingTxt}>
              <h1>DindiDoc</h1>
              <p> - Original documents made digital</p>
          </div>
      </section>
      <div className={styles.bodyPosition}>
        <section className={styles.about}>
            <h1 className={styles.textTitle}>Documents + <br/> On chain security</h1>

            <div className={styles.textLeftFloat}>
                <h1 className={styles.textSubheader}>DindiDoc utilizes the Solona Blockchain, in order to provide safe, reliable and efficient digital original documents.</h1>
            </div>

            <Image
                  src="/images/gray.jpg"
                  width={1200}
                  height={1200}
                  alt="Picture of the author"
                  id='footer-left-img'
                  className={styles.imageLarge}
                />

            <h2 className={styles.textHeader}>Digital Original Documents in short</h2>
            <h2 className={styles.textMain}>Digital Original Documents is electronic documents that have been uniquely linked to a blockchain network and satisfies the requirments of the law to be considered original. A blockchain is a decentralized and immutable ledger that records transactions and data across a network of computers. When a document is stored on a blockchain, it is encrypted and timestamped to ensure its integrity and security. This process creates a tamper-proof and transparent record of the document&apos;s existence and content at a specific point in time.</h2>
        
            <h2 className={styles.textHeader}>Key Characteristics</h2>
            <h2 className={styles.textSubKHeader}>Immutability</h2>
            <h2 className={styles.textKMain}>Once a document is added to a blockchain, it cannot be altered. This guarantees that the document remains unchanged and trustworthy. DindiDoc also have a separate function for adding notes on the contract afterwards if specified.</h2>
            <h2 className={styles.textSubKHeader}>Timestamping</h2>
            <h2 className={styles.textKMain}>Each document on the blockchain is timestamped, providing a clear record of when it was created or modified.</h2>
            <h2 className={styles.textSubKHeader}>Transparency and Decentralization</h2>
            <h2 className={styles.textKMain}>Blockchain transactions are visible to all participants in the network. Users can verify the authenticity of a document by inspecting its history on the blockchain. Blockchains are distributed across a network of computers, making them resistant to single points of failure and reducing the risk of fraud or data loss.</h2>
            
        </section>
        <section className={styles.aboutFunction}>
          <div className={styles.aboutFunctionTitle}>Features</div>
          <div className={styles.aboutFunctionContainer}>
              <div className={styles.aboutFunctionContent}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 15a6 6 0 1 0-5.743-4.257L9 11l-5.707 5.707a1 1 0 0 0-.293.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1 1 1 0 0 1 1-1 1 1 0 0 0 1-1 1 1 0 0 1 1-1h.586a1 1 0 0 0 .707-.293L13 15l.257-.257A5.999 5.999 0 0 0 15 15zm2-6a2 2 0 0 0-2-2"/></svg>
                <p className={styles.aboutFunctionHeader}>Safe</p>
                <p className={styles.aboutFunctionText}>DindiDoc utilizes the Solana blockchain for the storage of information. Only the current owner of the keypair can control the contracts.</p>
              </div>
              <div className={styles.aboutFunctionContent}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="m4 8 8-5 4 2.5M4 8v8l8 5M4 8l4 2.5m4 2.5 8-5m-8 5v8m0-8-4-2.5M20 8v8l-8 5m8-13-4-2.5m-8 5 8-5"/></svg>
                <p className={styles.aboutFunctionHeader}>Freely transferable</p>
                <p className={styles.aboutFunctionText}>The Contracts can be Freely transfereble between different wallets.</p>
              </div>
              <div className={styles.aboutFunctionContent}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 10V8a2 2 0 0 1 2-2h2m-4 4c1.333 0 4-.8 4-4m-4 4v4m18-4V8a2 2 0 0 0-2-2h-2m4 4c-1.333 0-4-.8-4-4m4 4v4M7 6h10m4 8v2a2 2 0 0 1-2 2h-2m4-4c-1.333 0-4 .8-4 4m0 0H7m-4-4v2a2 2 0 0 0 2 2h2m-4-4c1.333 0 4 .8 4 4"/><circle cx="12" cy="12" r="2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                <p className={styles.aboutFunctionHeader}>Cheap</p>
                <p className={styles.aboutFunctionText}>The contracts are both cheap to create and update.</p>
              </div>
              <div className={styles.aboutFunctionContent}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="m19 7-1.343 1.343m0 0A8 8 0 1 0 6.343 19.657 8 8 0 0 0 17.657 8.343zM12 10v4M9 3h6"/></svg>
                <p className={styles.aboutFunctionHeader}>Fast</p>
                <p className={styles.aboutFunctionText}>The actions are fast to execute.</p>
              </div>
              <div className={styles.aboutFunctionContent}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.603c1.667-1.271 5.5-2.86 9 0V19c-3.5-2.86-7.333-1.271-9 0m0-12.397c-1.667-1.271-5.5-2.86-9 0V19c3.5-2.86 7.333-1.271 9 0m0-12.397V19"/></svg>
                <p className={styles.aboutFunctionHeader}>Designed to comply with exisiting legislation</p>
                <p className={styles.aboutFunctionText}>DindiDoc is designed to comply with UNCITRAL&apos;s MLETR, dDOC specifications from ITFA&apos;s DNI initiative, as well as the Swedish case law on Digital Original promisary notes.</p>
              </div>
              <div className={styles.aboutFunctionContent}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 16v-5m4 5V8m4 8v-2M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6M19 2v3m0 3V5m0 0h3m-3 0h-3"/></svg>
                <p className={styles.aboutFunctionHeader}>Easy signing</p>
                <p className={styles.aboutFunctionText}>Both parties can easely sign the contract with the built in signing tool.</p>
              </div>
            </div>
        </section>
        <section className={styles.imageSection}>
          <div className={styles.imageContainer}>
            <Image
                src="/images/flower.jpg"
                width={1200}
                height={1200}
                alt="Picture of the author"
                id='footer-left-img'
                className={styles.imageSmallL}
              />
            <Image
                src="/images/zurich.jpg"
                width={1200}
                height={1200}
                alt="Picture of the author"
                id='footer-left-img'
                className={styles.imageSmallR}
              />
          </div>
        </section>
        <Footer/>
      </div>
    </main>
  )
}

