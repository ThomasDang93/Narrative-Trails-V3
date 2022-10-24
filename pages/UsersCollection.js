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
import { useRouter } from "next/router";

const DEPLOYED_CONTRACT_ADDRESS = constants.DEPLOYED_CONTRACT_ADDRESS;

export const injected = new InjectedConnector();

const UsersCollection = () => {
    const { 
        account,
        active,
        library: provider 
    } = useWeb3React();
    const [state, setState] = useState({
        stampList: [],
        pendingLetterboxes: []
    });
    const router = useRouter();

    useEffect(() => {
        if(active) {
            getStamp();
            fetchData();
        }
    },[active]);

    const fetchData = async() => {
        await fetch(`/api/get_pending_letterbox_by_wallet/?wallet_address=${account}`, {
            method: 'GET'
        }).then(response => response.json())
            .then(data => {
                for(let i = 0; i < data.length; i++) {
                    state.pendingLetterboxes.push({
                        id: data[i].url_hash,
                        name: data[i].letterbox_name,
                        src: data[i].image_uri
                    })
                }
            })
    };

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
            {console.log(state)}
            {active && state.stampList.length > 0 ? 
            <div className={styles.center}>
                <div>&nbsp;</div>
                <h1>Stamps</h1>
                <UserStamp stamp={state} />
                <div>&nbsp;</div>
                <h1 className={styles.center}>Your Pending Letterboxes</h1>
                <PendingLetterBoxList letterbox={state.pendingLetterboxes}/>
            </div> : <GettingStarted />}
        </div>
    );
};

export default UsersCollection;