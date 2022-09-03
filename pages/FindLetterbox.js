import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import LetterBoxList from '../components/LetterBoxList';
import styles from '../styles/Global.module.css';
import LetterBoxingABI from "../util/LetterBoxing.json";
import * as  constants from '../util/constants.js';

const DEPLOYED_CONTRACT_ADDRESS = constants.DEPLOYED_CONTRACT_ADDRESS;

export const injected = new InjectedConnector();

const FindLetterbox = () => {
    const [hasMetamask, setHasMetamask] = useState(false);
    const {
        active,
        activate,
        account,
        library: provider,
      } = useWeb3React();
    const [state, setState] = useState({
        letterBoxList: []
    });

    useEffect(() => {
        if(active) {
            getNFTs();
        }
    },[active]);

    useEffect(() => {
        if (typeof window.ethereum !== "undefined") {
            setHasMetamask(true);
        }
    });

    const connect = async () => {
        if (typeof window.ethereum !== "undefined") {
          try {
            await activate(injected);
            setHasMetamask(true);
          } catch (e) {
            console.log(e);
          }
        }
    };

    const getNFTs = async () => {
        const contract = new ethers.Contract(DEPLOYED_CONTRACT_ADDRESS, LetterBoxingABI["abi"], provider.getSigner());
        let allLetterboxes = await contract.letterboxList(); 
        let letterBoxList = [];
        for (let i = 0; i < allLetterboxes.length; i++) {
            const iboxResources = await contract.getFullResources(
                allLetterboxes[i].toNumber()
            );
            const iboxURI = iboxResources[0].metadataURI;
            await fetch(iboxURI)
                .then(response => response.json())
                .then(data => {
                    letterBoxList.push({
                    id: allLetterboxes[i].toNumber(),
                    name: data.name,
                    description: data.description,
                    src: data.media_uri_image,
                    city: data.properties.city,
                    country: data.properties.country,
                    lattitude: data.properties.lattitude,
                    longitude: data.properties.longitude,
                    state: data.properties.state,
                    zip: data.properties.zip
                    })
                });
        }
        setState({
            ...state,
            letterBoxList: letterBoxList
        });
    };

    return (
        <div >
            {hasMetamask ? (
                active ? (
                <div className={styles.topright}>Connected</div>
                ) : (
                    <button className={styles.topright} onClick={() => connect()}>Connect</button>
                )
            ) : (
                <div className={styles.topright}>Please Install Metamask</div>
            )}
            {
                active ? 
                <div>
                    <div>&nbsp;</div>
                    <h1 className={styles.center}>Letterboxes</h1>
                    <LetterBoxList letterbox={state}/>
                </div> 
                : <h1 className={styles.center}>Connect Wallet</h1>
            }
        </div>
    );
};

export default FindLetterbox;