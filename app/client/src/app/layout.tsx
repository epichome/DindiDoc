import type { Metadata } from 'next'
//import { Inter } from 'next/font/google'

//const inter = Inter({ subsets: ['latin'] })
import styles from './styles/main.module.scss'

export const metadata: Metadata = {
  title: 'DindiDoc',
  description: 'Create digital original documents',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel='icon' href='/images/logov2.png' type="image/x-icon"/>
        <link rel="apple-touch-icon" sizes="180x180" href='/images/logov2.png' />
        <link rel="icon" type="image/png" sizes="32x32" href='/images/logov2.png'/>
        <link rel="icon" type="image/png" sizes="16x16" href='/images/logov2.png'/>
      </head>
      <body className={styles.body}>{children}</body>
    </html>
  )
}
