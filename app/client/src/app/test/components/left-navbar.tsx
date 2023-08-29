"use client"
import { stat } from 'fs';
import styles from '../styles/dashboard.module.scss'
import { useState, useEffect} from "react"


export default function LeftNavBar(){
    const [testvariable, settestvariable] = useState("testa");
    const [testClassname, settestClassname] = useState(styles.test1);
    const [teststate, setteststate] = useState(0);
    function handleClick(){
        if (teststate == 0){
            settestvariable("test fungerar")
            settestClassname(styles.test2)
            setteststate(1);
        }else{
            settestvariable("testa")
            settestClassname(styles.test1)
            setteststate(0);
        }
        
    }

    const [contentList, setContentList] = useState([
        {t: 12, body: "test", l: styles.test3},
        {t: 64, body: "teadst", l: styles.test2},
        {t: 91, body: "test325", l: styles.test1}

    ])
    useEffect(() => {
        console.log("denna funktion körs vid varje render")
        window.addEventListener('scroll', handleClick)
    })
    return(
      <div className={styles.div}>
        <p>
            {testvariable}
        </p>
        <button onClick={handleClick}>ändra värde</button>
        <div className={testClassname}>Denna div ändrar färg när man klickar på ändra värde</div>

        {contentList.map((ind) => (
            <div className={ind.l}>
                <div>Detta är ett test där man loopar igenom contentList med ind</div>
                <h1>Detta är texten: {ind.body}</h1>
                <h2>Detta är värdet: {ind.t}</h2>
            </div>
        ))}
      </div>
    )
  }