import { useState } from "react";
import styles from '../styles/dropdown.module.scss';

export default function DropDown() {
    const [isActive, setIsActive] = useState(false);
    const [selected, setIsSelected] = useState("Choose type");
    
    function handleBlur(e: Event) {
      setIsActive(false)
    }
    return (
    <div
        tabIndex={0}
        onBlur={handleBlur}>
    <div className={styles.dropdown}>
        <div
        onClick={(e) => {
            setIsActive(!isActive);
        }}
        className={styles.dropdownBtn}
        >
        {selected}
        <span
            className={isActive ? styles.faCaretUp : styles.faCaretDown}
        />
        </div>
        <div
        className={styles.dropdownContent}
        style={{ display: isActive ? "block" : "none" }}
        >
        <div
            onClick={(e) => {
            setIsSelected(e.target.textContent);
            setIsActive(!isActive);
            }}
            className={styles.item}
        >
            Text
        </div>
        <div
            className={styles.item}
            onClick={(e) => {
            setIsSelected(e.target.textContent);
            setIsActive(!isActive);
            }}
        >
            Encrypted
        </div>
        <div
            className={styles.item}
            onClick={(e) => {
            setIsSelected(e.target.textContent);
            setIsActive(!isActive);
            }}
        >
            Hashed
        </div>
        </div>
    </div>
    </div>
    );
  }