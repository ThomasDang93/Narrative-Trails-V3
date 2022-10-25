import React, { useState, useEffect} from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import styles from '../styles/Global.module.css';
import LetterBoxingABI from "../util/LetterBoxing.json";
import UserStamp from '../components/UserStamp';
import * as  constants from '../util/constants.js';
import { getUserStamp } from '../util/nft_operations.js';
import PendingLetterBoxList from '../components/PendingLetterBoxList';
import GettingStarted from '../components/GettingStarted';
import useSWR from "swr";

const DEPLOYED_CONTRACT_ADDRESS = constants.DEPLOYED_CONTRACT_ADDRESS;

export const injected = new InjectedConnector();

const UsersCollection = () => {
    const { 
        account,
        active,
        library: provider 
    } = useWeb3React();
    const [state, setState] = useState({
        stampList: []
    });
    const fetcher = async(...args) => await fetch(...args).then((res) => res.json());
    const { data, error } = useSWR(
        `/api/get_pending_letterbox_by_wallet/?wallet_address=${account}`,
        fetcher
    );
    useEffect(() => {
        if(active) {
            fetchData();
        }
    },[active]);
    
    useEffect(() => {
        setState({...state})
    },[]);
    const fetchData = async() => {
        const contract = new ethers.Contract(DEPLOYED_CONTRACT_ADDRESS, LetterBoxingABI["abi"], provider.getSigner());
        let [stamps] = await Promise.all([getUserStamp({account: account, contract: contract})]);
        
        setState({
            ...state,
            stampList: stamps
        });    
    };
    console.log('Fetched Data: ' + data)
    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>
    return (
        <div className='h-screen'>
            {console.log(state)}
            {active && state.stampList.length > 0 ? 
            <div className={styles.center}>
                <div>&nbsp;</div>
                <h1>Stamps</h1>
                <UserStamp stamp={state} />
                <div>&nbsp;</div>
                <h1 className={styles.center}>Your Pending Letterboxes</h1>
                <PendingLetterBoxList letterbox={data}/>
            </div> : <GettingStarted />}
        </div>
    );
};

export default UsersCollection;