import React from 'react';
import { AlertIcon } from "../assets";
import styles from "../styles";


// Function to extract a user-friendly error message
const extractErrorMessage = (message) => {
    //console.log('Received message:', message); // Debug log to check the structure

    // Check if message is an object and has nested info
    if (typeof message === 'object' && message !== null) {
        if (message.info && message.info.error && message.info.error.message) {
            console.log("Lets see: ", message.info.error.message)
            return message.info.error.message;
        }
    }
    // If it's a string, or we don't have a specific nested message, return the message as is
    return message?.message || message;
}

const Alert = ({ type, message }) => {
    const displayedMessage = extractErrorMessage(message);


    return (
        <div className={`${styles.alertContainer} ${styles.flexCenter}`}>
            <div className={`${styles.alertWrapper} ${styles[type]}`}>
                <AlertIcon type={type} />
                {displayedMessage}
            </div>
        </div>
    );
}

export default Alert