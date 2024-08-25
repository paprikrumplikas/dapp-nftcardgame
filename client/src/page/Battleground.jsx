import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '../styles';
import { Alert } from '../components';
// array with the id, image, and name of the battleground
import { battlegrounds } from "../assets";
import { useGlobalContext } from '../context';


const Battleground = () => {
    const { setShowAlert, showAlert, setBattleGround } = useGlobalContext();
    const navigate = useNavigate();

    const handleBattlaGroundChoice = (ground) => {
        setBattleGround(ground.id);

        //@note also save it to local storage so if a user reloads the page we keep his chosen battleground
        // whether this has been set to local stroage is checked in the context, index.jsx
        localStorage.setItem('battleground', ground.id);

        setShowAlert({ status: true, type: 'info', message: `${ground.name} is ready!` });

        setTimeout(() => {
            // @note navigate where we came from @syntax
            navigate(-1);
        }, 1000)
    }

    return (
        <div className={`${styles.flexCenter} ${styles.battlegroundContainer}`}>
            {showAlert?.status && <Alert type={showAlert.type} message={showAlert.message} />}

            <h1 className={`${styles.headText} text-center`}>
                Choose your
                <span className='text-siteViolet'> Battle </span>
                Ground
            </h1>

            <div className={`${styles.flexCenter} ${styles.battleGroundsWrapper}`}>
                {battlegrounds.map((ground) => (
                    <div
                        key={ground.id}
                        className={`${styles.flexCenter} ${styles.battleGroundCard}`}
                        onClick={() => handleBattlaGroundChoice(ground)}
                    >
                        <img
                            src={ground.image}
                            alt="ground"
                            className={styles.battleGroundCardImg}
                        />
                        <div className='info absolute'>
                            <p className={styles.battleGroundCardText}>
                                {ground.name}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    )
}

export default Battleground