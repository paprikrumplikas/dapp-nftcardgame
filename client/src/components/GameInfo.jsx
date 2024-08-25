import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import CustomButton from "./CustomButton";
import { useGlobalContext } from '../context';

import { alertIcon, gameRules } from "../assets";
import styles from "../styles"


const GameInfo = () => {
    const { contract, gameData, setShowAlert, setErrorMessage, fetchGameData } = useGlobalContext();
    const [toggleSideBar, setToggleSideBar] = useState(false);
    const navigate = useNavigate();

    // exit function
    const handleBattleExit = async () => {
        const battleName = gameData.activeBattle.name;

        setShowAlert({
            status: true,
            type: 'info',
            message: `You are quitting battle "${battleName}".... With this, you are gonna lose.`
        })

        try {
            // this sets the quitting player as the loser on the blockchain, and resets other player data
            // the contract is gonna emit a BattleEnded event which is gonna picked up by an event listener to renavigate users to the create battle page
            // await contract.quitBattle(battleName);

            console.log("In GameInfo...");


            const tx = await contract.quitBattle(battleName);   // gonna emite BattleEnded
            console.log("In GameInfo, initiating tx.");
            await tx.wait(); // Wait for the transaction to be mined

            console.log("In GameInfo, tx mined.");

        } catch (error) {
            setErrorMessage(error);
        }
    }

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

                <div className={`${styles.flexBetween} mt-10 gap-4`}>
                    <CustomButton
                        title="Change battleground"
                        handleClick={() => navigate('/battleground')}
                    />
                    <CustomButton
                        title="Leaderboard"
                        handleClick={() => { navigate('/leaderboard') }}
                    />
                    <CustomButton
                        title="Exit battle"
                        handleClick={() => { handleBattleExit() }}
                    />


                </div>
            </div>
        </>
    )
}

export default GameInfo