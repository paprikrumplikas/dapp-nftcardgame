import React, { useState, useEffect } from 'react';
// @note cool package that adds tilting animation to elements wrapped by the <Tilt> tag
import Tilt from "react-parallax-tilt";

import styles from "../styles";

//  array of all card assets 
import { allCards } from "../assets";

// we want to fecth a random card asset from the collection 
const generateRandomCardImage = () => allCards[Math.floor(Math.random() * (allCards.length - 1))];

const img1 = generateRandomCardImage();
const img2 = generateRandomCardImage();


const Card = ({ card, title, restStyles, cardRef, playerTwo }) => {
    const [cardImages, setCardImages] = useState({ img1: null, img2: null });   //@custom

    // @custom, needed to ensure that within a battle, card images dont change even on relaod
    useEffect(() => {
        // Retrieve images from localStorage or generate new ones
        const savedImg1 = localStorage.getItem('img1');
        const savedImg2 = localStorage.getItem('img2');

        if (savedImg1 && savedImg2) {
            setCardImages({
                img1: savedImg1,
                img2: savedImg2
            });
        } else {
            const newImg1 = generateRandomCardImage();
            const newImg2 = generateRandomCardImage();

            setCardImages({
                img1: newImg1,
                img2: newImg2
            });

            // Store the new images in localStorage
            localStorage.setItem('img1', newImg1);
            localStorage.setItem('img2', newImg2);
        }
    }, []);



    return (
        <Tilt>
            <div ref={cardRef} /*@note needed for the placement of the animation*/ className={`${styles.cardContainer} ${restStyles}`}>

                {/* Card img */}
                <img
                    src={playerTwo ? cardImages.img2 : cardImages.img1}
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