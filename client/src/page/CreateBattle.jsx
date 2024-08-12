import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '../styles';
// hook we created for the Global Context
import { useGlobalContext } from '../context';
// higher order component (can wrap another component)
import { PageHOC, CustomButton, CustomInput, GameLoad } from "../components";

const CreateBattle = () => {
    const { contract, battleName, setBattleName, gameData } = useGlobalContext();
    const [waitBattle, setWaitBattle] = useState(false);
    const navigate = useNavigate();

    // changes when gameData changes
    useEffect(() => {
        // check if the current logged in player created a battle or not
        // syntax: first checks if gameData exists and not null. If exsits, it checks... if battle is pending
        if (gameData?.activeBattle) {
            console.log("game status: ", gameData.activeBattle.battleStatus);

            if (gameData.activeBattle.battleStatus === 0n) {
                setWaitBattle(true);
            }
        } else {
            console.log("No active battle or gameData is not loaded yet.");
        }
    }, [gameData])

    const handleClick = async () => {
        // if the user did not fill in the field, just return
        if (!battleName || !battleName.trim()) return null;

        try {
            await contract.createBattle(battleName);
            // after battle creation, set wait to true
            setWaitBattle(true);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            {/* if waitBattle is ture, load the GameLoad component */}
            {waitBattle && <GameLoad />}

            <div className='flex flex-col'>
                {/* we are not initialiting the "value" here: since we are gonna need it in other componetns, we define this state in GlobalContext instead */}
                <CustomInput
                    label="Battle"
                    placeholder="Enter battle name"
                    value={battleName}
                    handleValueChange={setBattleName}
                />

                <CustomButton
                    title="Create Battle"
                    handleClick={handleClick}
                    restStyles="mt-6"
                />
            </div>

            <p className={styles.infoText} onClick={() => navigate('/join-battle')}>Or join already existing battles.</p >
        </>
    );
};

// PageOHC higher order component wrap Home component for reusability
// @note how thie HOC can be modified: by passing props, here:
// 1. a component (that can have custom contect/styling)
// 2. an empty react fragment with text as title
export default PageHOC(
    CreateBattle,
    <>Create <br /> a new battle.</>,
    <>Create your own battle and wait for other players to join you.</>
);
