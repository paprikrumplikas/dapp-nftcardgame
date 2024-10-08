import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGlobalContext } from '../context';
import { CustomButton, PageHOC } from '../components';
import styles from "../styles"


const JoinBattle = () => {
    const navigate = useNavigate();
    const { gameData, contract, setShowAlert, setBattleName, walletAddress, setErrorMessage, fetchGameData } = useGlobalContext();


    /* const renderCount = useRef(0);
     renderCount.current += 1;
     console.log("Number of games:", gameData.pendingBattles.length);
     console.log("Render count: ", renderCount); 
    */


    const handleClick = async (battleName) => {
        // navigation to the proper page is coded in the listener BUT 
        // this is not enough f a player navigates away from the page or reloads, they won't automatically be redirected back to the battle page unless the event happens again
        setBattleName(battleName);

        try {

            setShowAlert({
                status: true,
                type: "success",
                message: `Joining battle "${battleName}"...`
            })

            const tx = await contract.joinBattle(battleName);
            const receipt = await tx.wait(); // Wait for the transaction to be mined

            fetchGameData();


        } catch (error) {
            //console.log(error);
            setErrorMessage(error);

        }
    };


    return (
        <>
            <h2 className={styles.joinHeadText}>
                Available Battles

                <div className={styles.joinContainer}>

                    {/* if gameData.pendingBattles.length exists */}
                    {/* filter out those battles that the connected wallet created, otherwise he would be playing with himself */}
                    {gameData.pendingBattles.length
                        ? gameData.pendingBattles
                            .filter((battle) => !battle.players.includes(walletAddress))
                            .map((battle, index) => (
                                <div key={battle.name + index} className={styles.flexBetween}>
                                    <p className={styles.joinBattleTitle}>
                                        {index + 1}. {battle.name}
                                    </p>
                                    <CustomButton
                                        title="Join"
                                        handleClick={() => handleClick(battle.name)}
                                    />
                                </div>
                            ))
                        :
                        <p className={styles.joinLoading}>
                            Reload the page to see new battles.
                        </p>
                    }
                </div>
            </h2>
            <p className={styles.infoText} onClick={() => navigate('/create-battle')}>
                Or create a new battle.
            </p>
        </>
    )
}

export default PageHOC(
    JoinBattle,
    <>Join <br /> a battle</>,
    <>Join already existing battles</>
)