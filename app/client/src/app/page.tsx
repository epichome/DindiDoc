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
    <section className={styles.about}>
        <h1 className={styles.textTitle}>Documents + <br/> On chain security</h1>

        <div className={styles.textLeftFloat}>
            <h1 className={styles.textSubheader}>DindiDoc utilizes the Solona Blockchain, in order to provide safe, reliable and efficient digital original documents.</h1>
        </div>

        <Image
              src="/images/image.png"
              width={200}
              height={200}
              alt="Picture of the author"
              id='footer-left-img'
              className={styles.imageLarge}
            />

        <h2 className={styles.textHeader}>Original Documents in short</h2>
        <h2 className={styles.textMain}>DindiDoc lets you create documents that satisfies the legal requirments to be considered original.</h2>
    </section>
    <section className={styles.contact}></section>
    <Footer/>
    </main>
  )
}

