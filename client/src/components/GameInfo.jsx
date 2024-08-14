import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import CustomButton from "./CustomButton";
import { useGlobalContext } from '../context';

import { alertIcon, gameRules } from "../assets";
import styles from "../styles"


const GameInfo = () => {
    const { contract, gameData, setShowAlwert } = useGlobalContext();
    const [toggleSideBar, setToggleSideBar] = useState(false);
    const navigate = useNavigate();

    const handleBattleExit = async () => { }

    return (
        <>
            {/* div for the menu icon */}
            <div className={styles.gameInfoIconBox}>
                <div
                    className={`${styles.gameInfoIcon} ${styles.flexCenter}`}
                    onClick={() => setToggleSideBar(true)}
                >
                    <img
                        src={alertIcon}
                        alt="info"
                        className={styles.gameInfoImg}
                    />
                </div>
            </div >

            {/* div for the menu sidebar that is displayed only if the menu icon was clicked */}
            {/* @note Slide-in Effect: Controlled by applying the translate-x-0 class when toggleSideBar is true.*/}
            <div className={`${styles.gameInfoSidebar} ${toggleSideBar ? 'translate-x-0' : 'translate-x-full'} ${styles.glassEffect} ${styles.flexBetween} backdrop-blur-3xl`}>
                <div className='flex flex-col'>
                    <div className={styles.gameInfoSidebarCloseBox}>
                        {/* close icon*/}
                        <div
                            className={`${styles.flexCenter} ${styles.gameInfoSidebarClose}`}
                            onClick={() => setToggleSideBar(false)}
                        >
                            X
                        </div>
                    </div>
                    <h3 className={styles.gameInfoHeading}>
                        Game Rules:
                    </h3>
                    <div className='mt-3'>
                        {/* @note iterate over the elements of the gameRules array. For each rule in the gameRules array, a new <p> element is created.*/}
                        {gameRules.map((rule, index) => (
                            <p key={`game-rule-${index}`} className={styles.gameInfoText}>
                                <span className='font-bold'>{index + 1}. </span>
                                {rule}
                            </p>
                        ))}

                    </div>
                </div>

                <div className={`${styles.flexBetween} mt-10 gap-4 w--full`}>
                    <CustomButton
                        title="Change battleground"
                        handleClick={() => navigate('/battleground')}
                    />
                    <CustomButton
                        title="Exit battle"
                        handleClick={() => { handleBattleExit }}
                    />
                </div>
            </div>
        </>
    )
}

export default GameInfo