import React from 'react'
import styles from "../styles";

// regex expression for all chars that are allowed
const regex = /^[A-Za-z0-9]+$/;

const CustomInput = ({ label, placeholder, value, handleValueChange }) => {
    return (
        <>
            {/* htmlFor attribute links the label with its corresponding input field */}
            <label htmlFor='name' className={styles.label}> {label}</label>
            <input
                type="text"
                placeholder={placeholder}
                onChange={(e) => {
                    {/* if the value entered is empty, and if it matches our regex, then call hnadleValueChange*/ }
                    {/* i.e. essentially update the playerName*/ }
                    if (e.target.value === '' || regex.test(e.target.value)) handleValueChange(e.target.value);
                }}
                className={styles.input}
            />
        </>
    )
}

export default CustomInput