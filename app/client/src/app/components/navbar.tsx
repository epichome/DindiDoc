import styles from '../styles/dashboard.module.scss'
import Image from 'next/image'
import Link from 'next/link';
export default function Navbar(){
    return(
        <div>
            <section id="main" className={styles.navbar}>
                <div className={styles.navbarContainer}>
                    <Link href="/">
                        <Image
                        className={styles.navbarImage}
                        src="/images/logov2.png"
                        width={45}
                        height={35}
                        alt="Picture of the author"
                        />
                    </Link>
                    <div className={styles.navbarContentContainer}>
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
                </div>
            </section>
        </div>
    )
}