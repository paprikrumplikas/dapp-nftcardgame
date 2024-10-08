import React from 'react';

import { useNavigate } from 'react-router-dom';
import CustomButton from "./CustomButton";
import { useGlobalContext } from '../context';

//icons
import { player01, player02 } from "../assets";
import styles from "../styles";

import { shortenAddress } from '../utils/shortenAddress';

const GameLoad = () => {
    const { walletAddress } = useGlobalContext();
    const navigate = useNavigate();

    return (
        <div className={`${styles.flexBetween} ${styles.gameLoadContainer}`}>
            <div className={styles.gameLoadBtnBox}>
                <CustomButton
                    title="Choose Battleground"
                    handleClick={() => navigate('/battleground')}
                    restStyles="mt-6"
                />
            </div>

            <div className={`flex-1 ${styles.flexCenter} flex-col`}>
                <h1 className={`${styles.headText} text-center`}>
                    Waiting for a <br /> worthy opponent...
                </h1>
                <p className={styles.gameLoadText}>
                    Pro tip: while you are waiting, choose your preferred battleground!
                </p>

                <div className={styles.gameLoadPlayersBox}>
                    <div className={`${styles.flexCenter} flex-col`}>
                        <img src={player01} className={styles.gameLoadPlayerImg} />
                        <p className={styles.gameLoadPlayerText}>
                            {shortenAddress(walletAddress)}
                        </p>
                    </div>
                    <h2 className={styles.gameLoadVS}>Vs</h2>
                    <div className={`${styles.flexCenter} flex-col`}>
                        <img src={player02} className={styles.gameLoadPlayerImg} />
                        <p className={styles.gameLoadPlayerText}>
                            0x?????...?????
                        </p>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default GameLoad