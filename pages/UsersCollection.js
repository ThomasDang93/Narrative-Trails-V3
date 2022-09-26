import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import styles from '../styles/Global.module.css';
import LetterBoxingABI from "../util/LetterBoxing.json";
import UserStamp from '../components/UserStamp';
import * as  constants from '../util/constants.js';
import { getUserStamp } from '../util/nft_operations.js';

import GettingStarted from '../components/GettingStarted';

const DEPLOYED_CONTRACT_ADDRESS = constants.DEPLOYED_CONTRACT_ADDRESS;

export const injected = new InjectedConnector();

const UsersCollection = () => {
    const {
        active,
        account,
        library: provider,
      } = useWeb3React();
    const [state, setState] = useState({
        stampList: []
    });

    useEffect(() => {
      if(active) {
        getStamp();
      }
    },[active]);

    const getStamp = async () => {
        const contract = new ethers.Contract(DEPLOYED_CONTRACT_ADDRESS, LetterBoxingABI["abi"], provider.getSigner());
        const stampList = await getUserStamp({
            account: account,
            contract: contract
        });
        setState({
            ...state,
            stampList: stampList
        });
    };
      
    return (
        <div className='h-screen'>
            {active && state.stampList.length > 0 ? 
            <div className={styles.center}>
                <div>&nbsp;</div>
                <h1>Stamps</h1>
                <UserStamp stamp={state} />
            </div> : <GettingStarted />}
        </div>
    );
};

export default UsersCollection;