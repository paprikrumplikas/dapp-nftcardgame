import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGlobalContext } from '../context';
import { CustomButton, PageHOC } from '../components';
import styles from "../styles"


const JoinBattle = () => {
    const navigate = useNavigate();
    const { gameData, contract, setShowAlert, setBattleName, walletAddress } = useGlobalContext();


    const renderCount = useRef(0);
    renderCount.current += 1;
    console.log("Number of games:", gameData.pendingBattles.length);
    console.log("Render count: ", renderCount);


    const handleClick = async (battleName) => {
        setBattleName(battleName)

        try {
            await contract.joinBattle(battleName);

            setShowAlert({
                status: true,
                type: "success",
                message: `Joining ${battleName}`
            })
        } catch (error) {
            console.log(error);
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
    <>Join <br /> a battle!</>,
    <>Join already existing battles</>
)