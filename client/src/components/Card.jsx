import React from 'react';
// @note cool package that adds tilting animation to elements wrapped by the <Tilt> tag
import Tilt from "react-parallax-tilt";

import styles from "../styles";
// array of all card assets
import { allCards } from "../assets";

// we want to fecth a random card asset from the collection
const generateRandomCardImage = () => allCards[Math.floor(Math.random() * (allCards.length - 1))];

const img1 = generateRandomCardImage();
const img2 = generateRandomCardImage();

const Card = ({ card, title, restStyles, cardRef, playerTwo }) => {
    return (
        <Tilt>
            <div className={`${styles.cardContainer} ${restStyles}`}>

                {/* Card img */}
                <img
                    src={playerTwo ? img2 : img1}
                    alt="card"
                    className={styles.cardImg}
                />

                {/* Attack points */}
                <div className={`${styles.cardPointContainer} sm:left-[21.2%] left-[22%] ${styles.flexCenter}`}>
                    <p className={`${styles.cardPoint} text-yellow-400`}>
                        {card.att}
                    </p>
                </div>

                {/* Defense points */}
                <div className={`${styles.cardPointContainer} sm:right-[14.2%] right-[15%] ${styles.flexCenter}`}>
                    <p className={`${styles.cardPoint} text-red-700`}>
                        {card.def}
                    </p>
                </div>

                {/* Defense points */}
                <div className={`${styles.cardTextContainer} ${styles.flexCenter}`}>
                    <p className={styles.cardText}>{title}</p>
                </div>

            </div>
        </Tilt>
    )
}

export default Card