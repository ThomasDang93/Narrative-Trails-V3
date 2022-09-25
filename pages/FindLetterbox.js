import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import LetterBoxList from '../components/LetterBoxList';
import styles from '../styles/Global.module.css';
import LetterBoxingABI from "../util/LetterBoxing.json";
import * as  constants from '../util/constants.js';

export const injected = new InjectedConnector();
const DEPLOYED_CONTRACT_ADDRESS = constants.DEPLOYED_CONTRACT_ADDRESS;
const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ETHERS_PROVIDER); 
const FindLetterbox = () => {
    const [state, setState] = useState({
        letterBoxList: []
    });

    useEffect(() => {
            getLetterboxes();
    },[]);

    const getLetterboxes = async () => {
        const contract = new ethers.Contract(DEPLOYED_CONTRACT_ADDRESS, LetterBoxingABI["abi"], provider);
        console.log('contract: ' + contract)
        let allLetterboxes = await contract.letterboxList(); 
        
        let letterBoxList = [];
        
        for (let i = 0; i < allLetterboxes.length; i++) {
            console.log('allLetterboxes: ' + allLetterboxes[i].toNumber()); //token ID
            const iboxResources = await contract.getActiveResources(allLetterboxes[i].toNumber()); 
            console.log('iboxResources: ' + iboxResources[0]); //resource ID
            const{id, metadataURI} = await contract.getResource(iboxResources[0]);
            console.log('metadataURI: ' + metadataURI);
            await fetch(metadataURI)
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
            <div>
                <div>&nbsp;</div>
                <h1 className={styles.center}>Letterboxes</h1>
                <LetterBoxList letterbox={state}/>
            </div> 
        </div>
    );
};

export default FindLetterbox;