import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context';

// higher order component (can wrap another component)
import { PageHOC, CustomInput, CustomButton } from "../components";

const Leaderboard = () => {

    const navigate = useNavigate();

    return (
        <div>Leaderboard</div>
    )
}

export default Leaderboard