import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import styles from "../styles";
import { Alert } from "../components";
import { useGlobalContext } from '../context';

import { attack, attackSound, defense, defenseSound, player01 as player01Icon, player02 as player02Icon } from "../assets";
import { playerAudio } from "./utils/animation.js"

function Battle() {
    const { contract, gameData, walletAddress, showAlert, setShowAlert } = useGlobalContext();
    const navigate = useNavigate();

    const [player1] = useState({});
    const [player2] = useState({});

    return (
        <div>Battle</div>
    )
}

export default Battle