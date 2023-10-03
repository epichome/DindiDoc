"use client"
import Image from 'next/image'
import Link from 'next/link';
import styles from '../styles/main.module.scss'

export default function Footer() {
    return(
        <section className={styles.footer}>
                <div className={styles.footerLeft}>
                    <Image
                    src="/images/logov2.png"
                    width={50}
                    height={50}
                    alt="Picture of the author"
                    id='footer-left-img'
                    />
                </div>
            <div className={styles.footerRight}>
                    <h1>Contact: me@manselfving.com</h1>
                    <div className={styles.footerRightNav}>
                        <h1>ABOUT</h1>
                        <h1>GITHUB</h1>
                        <h1>TWITTER</h1>
                        <h1>WHITEPAPER</h1>
                    </div>
            </div>
        </section>
    )
}