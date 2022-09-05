import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import styles from '../../styles/Global.module.css';
import LetterBoxingABI from "../../util/LetterBoxing.json";
import StampList from "../../components/StampList";
import * as  constants from '../../util/constants.js';
import Map from '../../components/Map';

export const injected = new InjectedConnector();

const DEPLOYED_CONTRACT_ADDRESS = constants.DEPLOYED_CONTRACT_ADDRESS;

const Letterbox = () => {
  const router = useRouter();
  const { query } = useRouter();
  const id = router.query.id;
  const {
    active,
    account,
    library: provider,
  } = useWeb3React();
  const [state, setState] = useState({
        name: "",
        description: "",
        src: "",
        city: "",
        country: "",
        lattitude: "",
        longitude: "",
        state: "",
        zip: "",
        stampBoxList: []
  });

  useEffect(() => {
    if(active) {
      getLetterBox();
    }
  },[active]);

  const getLetterBox = async () => {
    const contract = new ethers.Contract(DEPLOYED_CONTRACT_ADDRESS, LetterBoxingABI["abi"], provider.getSigner());
    const iboxURI = await contract.letterboxMetadataURI(id);
    console.log("iboxURI = ", iboxURI)
    let letterboxList;
    await fetch(iboxURI)
        .then(response => response.json())
        .then(data => {
            letterboxList = {
                name: data.name,
                description: data.description,
                src: data.media_uri_image,
                city: data.properties.city,
                country: data.properties.country,
                lattitude: data.properties.lattitude,
                longitude: data.properties.longitude,
                state: data.properties.state,
                zip: data.properties.zip
        }});

    const resources = await contract.getFullResources(id);
    let stampList = [];
    for(let i = 1; i < resources.length; i++) {
      const resourceURI = resources[i].metadataURI;
      console.log("JSON URI: ", resourceURI);
      await fetch(resourceURI)
          .then(response => response.json())
          .then(data => {
                  stampList.push({
                    src: data.media_uri_image
                  });
          });
    }
    setState({
        ...state,
        name: letterboxList.name,
        description: letterboxList.description,
        src: letterboxList.src,
        city: letterboxList.city,
        country: letterboxList.country,
        lattitude: letterboxList.lattitude,
        longitude: letterboxList.longitude,
        state: letterboxList.state,
        zip: letterboxList.zip,
        stampBoxList: stampList
    });
    router.query.latitude = letterboxList.lattitude;
    router.query.longitude = letterboxList.longitude;
    router.push(router);
  };

  const foundLetterbox = async () => {
    if (active) {
      console.log("Signer: ", provider.getSigner());
      const signer = provider.getSigner();
      const contractAddress = DEPLOYED_CONTRACT_ADDRESS;
      const contract = new ethers.Contract(contractAddress, LetterBoxingABI["abi"], signer);
      try{
        let letterboxResources = await contract.getFullResources(id);
        console.log('letterbox resource count: ', letterboxResources.length);
        await contract.stampToLetterbox(account, id, true);
        await contract.letterboxToStamp(account, id, {gasLimit:500000});
        letterboxResources = await contract.getFullResources(id);

      } catch(error) {
        console.log(error);
      }
        
    } else {
      console.log("Please install MetaMask");
    }
  };

  return (
    <div>
      <div className="flex mb-4 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="w-full px-5">
          <img src={state.src} alt="Image cap" top width="100%"></img>
          <div>&nbsp;</div>
          <button className={styles.submitbtn} onClick={() => foundLetterbox()}>I found it!</button> 
          <div>&nbsp;</div>
          <h2>Resources</h2>
          <StampList stampList={state}/>
        </div>
        <div className="w-full px-5">
          <h1>{<b>Name: </b>} {state.name} {" #"}{id}</h1>
          <div>&nbsp;</div>
          {<b>Description: </b>} {state.description}
          <div>&nbsp;</div>
          {<b>City: </b>} {state.city}
          <div>&nbsp;</div>
          {<b>State: </b>} {state.state}
          <div>&nbsp;</div>
          {<b>Country: </b>} {state.country}
          <div>&nbsp;</div>
          {<b>Zip: </b>} {state.zip}
          <div>&nbsp;</div>
          {<b>Lattitude: </b>} {query.latitude}
          <div>&nbsp;</div>
          {<b>Longitude: </b>} {query.longitude}
          <div>&nbsp;</div>
          {<b>City: </b>} {state.city}
          <div>&nbsp;</div>
          <Map state={state} query={query}/>
        </div>
      </div>
    </div>
  );
};
 
export default Letterbox;