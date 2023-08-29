import styles from '../styles/dashboard.module.scss'
import Image from 'next/image'
import Link from 'next/link';
export default function Navbar(){
    return(
        <main>
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
                </div>
            </section>
        </main>
    )
}