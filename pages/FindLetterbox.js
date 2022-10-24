import { ethers } from 'ethers';
import { InjectedConnector } from "@web3-react/injected-connector";
import LetterBoxList from '../components/LetterBoxList';
import styles from '../styles/Global.module.css';
import LetterBoxingABI from "../util/LetterBoxing.json";
import * as  constants from '../util/constants.js';
import React, { useState, useEffect } from 'react';

const DEPLOYED_CONTRACT_ADDRESS = constants.DEPLOYED_CONTRACT_ADDRESS;
const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ETHERS_PROVIDER);

export const injected = new InjectedConnector();
  
export const getStaticProps = async () => {
    const contract = new ethers.Contract(DEPLOYED_CONTRACT_ADDRESS, LetterBoxingABI["abi"], provider);
    const allLetterboxes = await contract.letterboxUrlList(); 
    let letterBoxList = [];
    for (let i = 0; i < allLetterboxes.length; i++) {
        const letterboxMetaData = await contract.getLetterboxFromURL(allLetterboxes[i]);
        const letterboxTokenID = letterboxMetaData[1];
        const resources = await contract.getActiveResources(letterboxTokenID); 
        const{ metadataURI } = await contract.getResource(resources[0]);
        await fetch(metadataURI)
            .then(response => response.json())
            .then(data => {
                console.log("isStamp: " + data.properties.isStamp)
                let isStamp;
                data.properties.isStamp === true ? isStamp = true : isStamp = false;
                letterBoxList.push({
                    id: allLetterboxes[i],
                    name: data.name,
                    description: data.description,
                    src: data.hasOwnProperty('media_uri_image') ? data.media_uri_image : null,
                    city: data.properties.city,
                    country: data.properties.country,
                    lattitude: data.properties.lattitude,
                    longitude: data.properties.longitude,
                    state: data.properties.state,
                    zip: data.properties.zip,
                    isStamp: isStamp,
                    tokenID: letterboxTokenID.toString()
                })
            });
    }
    return {
        props: { letterBoxList: letterBoxList },
        revalidate: 10
    };
};
const FindLetterbox = ({ letterBoxList }) => {
    return (
        <div className=''>
            <div>
                <div>&nbsp;</div>
                <h1 className={styles.center}>Letterboxes</h1>
                <LetterBoxList letterbox={letterBoxList}/>
            </div> 
        </div>
    );
};

export default FindLetterbox;