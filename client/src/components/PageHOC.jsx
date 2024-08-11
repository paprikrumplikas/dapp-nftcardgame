import React from 'react';
import { useNavigate } from "react-router-dom";

import { useGlobalContext } from '../context';
import { logo, heroImg } from "../assets";
import styles from "../styles";
import Alert from "./Alert";



// HOCs are for reusability. We are gonna use this layout for quite many pages
// @note diff between higher order components and regular ones is that HOC func components accept other lower level func components as a first input param. Esentially, they act as a wrapper for the lower level component.
// @note => () => : function inside a function
const PageHOC = (Component, title, description) => () => {
    const { showAlert } = useGlobalContext();

    // initilaize navigate hook
    // @note useNavigate is a hook that sets up and returns a function (navigate) to perform the navigation when needed. It cannot be called directly to navigate
    const navigate = useNavigate();

    return (
        // styles.hocContainer is a CSS module, an object (not a class name applied diectly as a string), hence the curly braces
        <div className={styles.hocContainer}>
            {/* if showAlert status exists (truthy), we are gonna show and alert component */}
            {showAlert?.status && <Alert type={showAlert.type} message={showAlert.message} />}
            {/* click on logo navigates to homepage */}
            <div className={styles.hocContentBox}>
                <img src={logo} alt="logo" className={styles.hocLogo} onClick={() => navigate('/')} />
                {/* Rendering the custom style of the component that was submitted as props, plus any other custom thing submitted as props */}
                <div className={styles.hocBodyWrapper}>
                    <div className='flex flex-row w-full'>
                        <h1 className={`flex ${styles.headText} head-text`}>{title}</h1>
                    </div>
                    <p className={`${styles.normalText} my-10`}>{description}</p>
                    <Component />
                </div>

                {/* footer */}
                <p className={styles.footerText} > Made with 💜 by FE Lab.</p>
            </div>
            <div className='flex flex-1'>
                <img src={heroImg} alt="hero-img" className='w-full xl_h-full object-cover' />
            </div>
        </div >
    )
}

export default PageHOC